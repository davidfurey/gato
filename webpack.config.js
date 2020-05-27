const path = require('path');
const { fork } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//how does this work?
class LaunchServerPlugin {
  apply(compiler) {
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

const serverConfig = env => {
  const isProd = env && env.production;
  const isWatch = env && env.watch;

  const plugins = [new MiniCssExtractPlugin()]

  if (isWatch) {
    plugins.push(new LaunchServerPlugin());
  }

  const mode = isProd ? "production" : "development";

  return {
    name: 'server',
    mode,
    entry: './src/server/server.ts',
    target: 'node',
    node: {
      __dirname: false,
    },
    output: {
      filename: isProd ? 'server/server.js': 'server.js',
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
            }
          ],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ]
    },
  }
}

const clientConfig = env => {
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
    devServer: {
      contentBase: path.join(__dirname, 'html')
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|gif|jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name:       '[name].[ext]',
                // name:        '[path][name].[ext]',
                outputPath: '/public/fonts/',
                publicPath: '/public/fonts/'
              }
            }
          ]
        }
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        chunks: ['app'],
        template: 'src/index.html',
        title: 'On Screen Graphics'
      }),
      new HtmlWebpackPlugin({
        filename: "control.html",
        chunks: ['control'],
        template: 'src/index.html',
        title: 'On Screen Graphics - Control'
      }),
      new HtmlWebpackPlugin({
        filename: "viewer.html",
        chunks: ['viewer'],
        template: 'src/index.html',
        title: 'On Screen Graphics - Viewer'
      }),
      new HtmlWebpackPlugin({
        filename: "manage.html",
        chunks: ['manage'],
        template: 'src/index.html',
        title: 'On Screen Graphics - Manage'
      }),
      new MiniCssExtractPlugin(),
    ],
    output: {
      filename: '[name].bundle.[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
    },
  }
};

module.exports = [ serverConfig, clientConfig ];