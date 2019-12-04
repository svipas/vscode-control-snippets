import * as assert from 'assert';
import { ExtensionData, getAllExtensionsData, getExtensionIdFromDescription } from '../../extension';

suite('Control Snippets', () => {
  test('getAllExtensionsData()', async () => {
    const extensionsData = await getAllExtensionsData();
    extensionsData.forEach(ext => {
      const isAllValuesDefined = Object.keys(ext).every(key => ext[key as keyof ExtensionData] != null);
      assert(isAllValuesDefined, 'missing properties');
    });
  });

  test('getExtensionIdFromDescription()', () => {
    const builtin = 'vscode.bat (built-in) 🔋';
    assert.strictEqual(getExtensionIdFromDescription(builtin), 'vscode.bat');

    const installed = 'ms-vscode.Go (installed) 🔌';
    assert.strictEqual(getExtensionIdFromDescription(installed), 'ms-vscode.Go');
  });
});
