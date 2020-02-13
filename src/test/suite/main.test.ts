import * as assert from 'assert';
import { Extension, ExtensionData } from '../../extension';

suite('Control Snippets', () => {
  test('getAllExtensionsData()', async () => {
    const extensions = await Extension.readAllExtensions();
    extensions.all.forEach(ext => {
      const isAllValuesDefined = Object.keys(ext).every(key => ext[key as keyof ExtensionData] != null);
      assert(isAllValuesDefined, 'missing properties');
    });
  });

  test('getExtensionIdFromDescription()', () => {
    const builtin = 'vscode.bat (built-in) 🔋';
    assert.strictEqual(Extension.idFromText(builtin), 'vscode.bat');

    const installed = 'ms-vscode.Go (installed) 🔌';
    assert.strictEqual(Extension.idFromText(installed), 'ms-vscode.Go');
  });
});
