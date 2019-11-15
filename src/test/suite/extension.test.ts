import * as assert from 'assert';
import * as vscode from 'vscode';
import { Extension, getAllExtensions, getExtensionIdFromDescription } from '../../extension';

suite('Extension', () => {
  test('Control Snippets', done => {
    const cancellationTokenSource = new vscode.CancellationTokenSource();

    vscode.commands.executeCommand('extension.control-snippets', cancellationTokenSource.token);

    setTimeout(() => {
      cancellationTokenSource.cancel();
      done();
    }, 1000);
  });

  test('getAllExtensions()', async () => {
    const extensions = await getAllExtensions();

    extensions.forEach(ext => {
      const isAllValuesDefined = Object.keys(ext).every(key => ext[key as keyof Extension] != null);
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
