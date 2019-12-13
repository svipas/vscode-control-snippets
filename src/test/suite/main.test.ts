import * as assert from 'assert';
import { extension, ExtensionData } from '../../extension';

suite('Control Snippets', () => {
  test('getAllExtensionsData()', async () => {
    const extensions = await extension.readAllExtensions();
    extensions.all.forEach(ext => {
      const isAllValuesDefined = Object.keys(ext).every(key => ext[key as keyof ExtensionData] != null);
      assert(isAllValuesDefined, 'missing properties');
    });
  });

  test('getExtensionIdFromDescription()', () => {
    const builtin = 'vscode.bat (built-in) 🔋';
    assert.strictEqual(extension.getIdFromText(builtin), 'vscode.bat');

    const installed = 'ms-vscode.Go (installed) 🔌';
    assert.strictEqual(extension.getIdFromText(installed), 'ms-vscode.Go');
  });
});
