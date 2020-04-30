import * as assert from 'assert';
import { ExtensionData, getAllExtensionsFromVSCode, getExtensionIdFromText } from '../../extension';

describe('getAllExtensionsFromVSCode()', () => {
	it('should return all extensions from VS Code with all values defined', async () => {
		const extensions = await getAllExtensionsFromVSCode();
		extensions.all.forEach((ext) => {
			const isAllValuesDefined = Object.keys(ext).every((key) => ext[key as keyof ExtensionData] != null);
			assert(isAllValuesDefined, 'missing properties');
		});
	});
});

describe('getExtensionIdFromText()', () => {
	it('should return extension id from built-in and installed extensions', () => {
		const builtin = 'vscode.bat (built-in) 🔋';
		assert.strictEqual(getExtensionIdFromText(builtin), 'vscode.bat');

		const installed = 'ms-vscode.Go (installed) 🔌';
		assert.strictEqual(getExtensionIdFromText(installed), 'ms-vscode.Go');
	});
});
