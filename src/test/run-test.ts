import * as path from 'path';
import { runTests } from 'vscode-test';

(async function main() {
  // The folder containing the Extension Manifest package.json
  // Passed to `--extensionDevelopmentPath`
  const extensionDevelopmentPath = process.cwd();

  // The path to test runner
  // Passed to --extensionTestsPath
  const extensionTestsPath = path.join(__dirname, './suite');

  // Download VS Code, unzip it and run the integration test
  await runTests({ extensionDevelopmentPath, extensionTestsPath });
})();
