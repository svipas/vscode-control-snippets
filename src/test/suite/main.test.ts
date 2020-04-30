import * as assert from 'assert';
import { ExtensionData, getAllExtensionsFromVSCode, getExtensionIdFromText } from '../../extension';

suite('Control Snippets', () => {
	test('getAllExtensionsFromVSCode()', async () => {
		const extensions = await getAllExtensionsFromVSCode();
		extensions.all.forEach((ext) => {
			const isAllValuesDefined = Object.keys(ext).every((key) => ext[key as keyof ExtensionData] != null);
			assert(isAllValuesDefined, 'missing properties');
		});
	});

	test('getExtensionIdFromText()', () => {
		const builtin = 'vscode.bat (built-in) 🔋';
		assert.strictEqual(getExtensionIdFromText(builtin), 'vscode.bat');

		const installed = 'ms-vscode.Go (installed) 🔌';
		assert.strictEqual(getExtensionIdFromText(installed), 'ms-vscode.Go');
	});
});
