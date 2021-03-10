import path from 'path'
import type { ChildProcess } from 'child_process';
import { fork } from 'child_process'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack from 'webpack'
import type { Compiler, Configuration } from 'webpack';
import GitRevisionPlugin from 'git-revision-webpack-plugin'
import PermissionsOutputPlugin from 'webpack-permissions-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import nodeExternals from 'webpack-node-externals'
import { default as typescriptIsTransformer } from 'typescript-is/lib/transform-inline/transformer'
import ts from 'typescript';

const gitRevisionPlugin = new GitRevisionPlugin()

class LaunchServerPlugin {
	server?: ChildProcess;
	apply(compiler: Compiler): void {
      compiler.hooks.afterEmit.tap('LaunchServerPlugin', () => {
          console.log('Server starting...');
          this.server = fork('./dist/server.js');
          this.server.on('close', () => console.log('Server stopping...'));
      });

      compiler.hooks.watchRun.tap('LaunchServerPlugin', () => {
          if (this.server) {
              this.server.kill();
          }
      });
  }
}

const serverConfig = (
	env: Record<string, boolean | undefined>,
): Configuration => {
  const isProd = env && env.production;
  const isWatch = env && env.watch;

  const plugins = [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!package.json', '!package-lock.json', '!node_modules/**'],
    }),
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
    new PermissionsOutputPlugin({
      buildFiles: [
        path.resolve(__dirname, 'dist/server.js'),
      ]
    })
  ]

  if (isWatch) {
    plugins.push(new LaunchServerPlugin());
  }

  const mode = isProd ? "production" : "development";

  return {
    name: 'server',
    mode,
    entry: './src/server/server.ts',
    target: 'node',
    externals: [nodeExternals()],
    node: {
      __dirname: false,
    },
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist')
    },
    watch: isWatch,
    watchOptions: {
        ignored: /node_modules/,
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    plugins: plugins,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react',
                  '@babel/preset-env',
                ],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                getCustomTransformers: (program: ts.Program) => ({
                  before: [typescriptIsTransformer(program)]
                }),
								configFile: 'tsconfig.server.json',
							},
            }
          ],
        },
      ]
    },
  }
}

const clientConfig = (
	env: Record<string, boolean | undefined>,
): Configuration => {
  const isProd = env && env.production;

  const mode = isProd ? "production" : "development";

  return {
    name: 'client',
    mode,
    entry: {
      app: './src/index.tsx',
      control: './src/control.tsx',
      viewer: './src/viewer.tsx',
      manage: './src/manage.tsx'
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: (program: ts.Program) => ({
                before: [typescriptIsTransformer(program)]
              }),
              configFile: 'tsconfig.client.json',
            }
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: (url: string, _resourcePath: string) => {
                  if (url.startsWith("/")) {
                    return false;
                  }
                  return true;
                }
              }
            }
          ]
        },
        {
          test: /\.(png|gif|jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name:       'fonts/[name].[ext]',
                publicPath: '../'
              }
            }
          ]
        }
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
      fallback: {
        "path": require.resolve("path-browserify")
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        'VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      }),
      new HtmlWebpackPlugin({
        chunks: ['app'],
        template: 'src/index.html',
        title: 'GATO'
      }),
      new HtmlWebpackPlugin({
        filename: "control.html",
        chunks: ['control'],
        template: 'src/index.html',
        title: 'GATO - Control'
      }),
      new HtmlWebpackPlugin({
        filename: "viewer.html",
        chunks: ['viewer'],
        template: 'src/index.html',
        title: 'GATO - Viewer'
      }),
      new HtmlWebpackPlugin({
        filename: "manage.html",
        chunks: ['manage'],
        template: 'src/index.html',
        title: 'GATO - Manage'
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
    ],
    output: {
      filename: 'js/[name].bundle.[chunkhash].js',
      path: path.resolve(__dirname, 'dist/public'),
    },
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3040',
        },
      },
    },
  }
};

module.exports = [ serverConfig, clientConfig ];