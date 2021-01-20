/* eslint-disable */
/**
 * Configuration file for VS Code Vandelay extension.
 * https://github.com/ericbiewener/vscode-vandelay#configuration
 */

module.exports = {
  // This is the only required property. At least one path must be included.
  includePaths: ['/home/maarten/projects/donatetk/src'],
  processImportPath: (importPath, absImportPath, activeFilepath, projectRoot) =>
    absImportPath.startsWith(projectRoot)
      ? absImportPath.slice(projectRoot.length + 10)
      : null,
};
