declare module 'webpack-permissions-plugin' {

  import { WebpackPluginInstance, Compiler } from "webpack";

  class PermissionsOutputPlugin implements WebpackPluginInstance {
    constructor(options: {
      buildFiles?: string[],
      buildFolders?: string[],
    })
    apply: (compiler: Compiler) => void;
  }

  export default PermissionsOutputPlugin
}