import * as path from "path";
import { runTests } from "vscode-test";

(async function main() {
	const extensionDevelopmentPath = process.cwd();
	const extensionTestsPath = path.join(__dirname, "./suite");

	try {
		const exitCode = await runTests({
			extensionDevelopmentPath,
			extensionTestsPath,
		});
		process.exitCode = exitCode;
	} catch {
		process.exitCode = 1;
	}
})();
