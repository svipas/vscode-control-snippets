import * as assert from 'assert';
import { getAllExtensions, getExtensionIdFromDescription } from '../../extension';

suite('Extension', () => {
  test('getAllExtensions()', async () => {
    const extensions = await getAllExtensions();
    extensions.forEach(ext => {
      if (
        'id' in ext &&
        'description' in ext &&
        'isEnabled' in ext &&
        'name' in ext &&
        'packageJSON' in ext &&
        'path' in ext
      ) {
        assert(true);
      } else {
        assert(false, 'missing properties');
      }
    });
  });

  test('getExtensionIdFromDescription()', () => {
    const builtin = 'vscode.bat (built-in) 🔋';
    const installed = 'ms-vscode.Go (installed) 🔌';
    assert.strictEqual(getExtensionIdFromDescription(builtin), 'vscode.bat');
    assert.strictEqual(getExtensionIdFromDescription(installed), 'ms-vscode.Go');
  });
});
