import * as vscode from 'vscode';
import { readFile, writeFile } from 'fs';
import { join } from 'path';

interface Extension {
  id: string;
  name: string;
  description: string;
  path: string;
  packageJSON: ExtensionPackageJSON;
  isEnabled: boolean; // read extension package.json to know if snippet is disabled or enabled
  isBuiltin: boolean; // built-in extension
}

interface ExtensionPackageJSON {
  name: string;
  publisher: string;
  displayName?: string;
  contributes: {
    snippets?: any;
    snippets_disabled?: any;
  };
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.control-snippets', async () => {
    try {
      const quickPickItems: vscode.QuickPickItem[] = [];
      const extensions = await getAllExtensions();
      extensions.forEach(ext => {
        quickPickItems.push({
          label: ext.name,
          description: ext.description,
          picked: ext.isEnabled
        });
      });

      const selectedQuickPickValues = await promisifyThenable(
        vscode.window.showQuickPick(quickPickItems, {
          canPickMany: true,
          ignoreFocusOut: true,
          matchOnDescription: true,
          placeHolder: 'Select extension whose snippets to disable or enable'
        })
      );

      // Canceled by user
      if (!selectedQuickPickValues) {
        return;
      }

      const enabledExtensions: Extension[] = [];
      const disabledExtensions: Extension[] = [];

      // Nothing was selected
      if (selectedQuickPickValues.length === 0) {
        for (const ext of extensions) {
          // Extension is already disabled
          if (!ext.isEnabled || ext.packageJSON.contributes.snippets_disabled) {
            continue;
          }

          await disableExtension(ext);
          disabledExtensions.push(ext);
        }
      }

      // Only selected values from quick pick
      for (const value of selectedQuickPickValues) {
        const ext = extensions.find(ext => ext.id === getExtensionIdFromDescription(value.description));
        if (!ext) {
          continue;
        }

        // Extension is already enabled
        if (ext.isEnabled || ext.packageJSON.contributes.snippets) {
          enabledExtensions.push(ext);
          continue;
        }

        await enableExtension(ext);
        enabledExtensions.push(ext);
      }

      // Disable extensions by checking difference between disabled/enabled extensions from the quick pick
      if (disabledExtensions.length !== extensions.length) {
        for (const ext of extensions) {
          const isEnabledExtensionFromQuickPick = enabledExtensions.find(val => val.id === ext.id);
          if (isEnabledExtensionFromQuickPick) {
            continue;
          }

          const isDisabledExtensionFromQuickPick = disabledExtensions.find(val => val.id === ext.id);
          if (isDisabledExtensionFromQuickPick) {
            continue;
          }

          // Extension is already disabled
          if (!ext.isEnabled || ext.packageJSON.contributes.snippets_disabled) {
            continue;
          }

          await disableExtension(ext);
        }
      }

      const reloadModalResponse = await promisifyThenable(
        vscode.window.showInformationMessage(
          'To disable or enable snippets from extensions reload is required.',
          { modal: true },
          ...([{ title: 'Cancel', isCloseAffordance: true }, { title: 'Reload' }] as vscode.MessageItem[])
        )
      );

      if (!reloadModalResponse) {
        return;
      }

      if (reloadModalResponse.title === 'Reload') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      } else {
        vscode.window.showWarningMessage(
          'Note: Reload or restart of VS Code is required after disable or enable snippets from extensions to take effect.'
        );
      }
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function getAllExtensions(): Promise<Extension[]> {
  const extensions: Extension[] = [];

  for (const ext of vscode.extensions.all) {
    // Read package.json instead of accessing it from extension because it caches results and we need it in real-time
    const packageJSON = await readJSON<ExtensionPackageJSON>(join(ext.extensionPath, 'package.json'));
    if (!packageJSON.contributes) {
      continue;
    }

    const isBuiltin = packageJSON.publisher === 'vscode';
    let name = packageJSON.name;
    if (!isBuiltin && packageJSON.displayName && packageJSON.displayName !== '%displayName%') {
      name = packageJSON.displayName;
    }

    const extension: Extension = {
      id: ext.id,
      path: ext.extensionPath,
      isEnabled: null as any,
      description: `${ext.id} ${isBuiltin ? '(built-in)' : '(manually installed)'}`,
      isBuiltin,
      name,
      packageJSON
    };

    if (packageJSON.contributes.snippets) {
      extension.isEnabled = true;
      extensions.push(extension);
    } else if (packageJSON.contributes.snippets_disabled) {
      extension.isEnabled = false;
      extensions.push(extension);
    }
  }

  return extensions;
}

function promisifyThenable<T>(fn: Thenable<T | undefined>): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    fn.then(value => resolve(value), err => reject(err));
  });
}

function readJSON<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }

      try {
        resolve(JSON.parse(data.toString()));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function writeJSON<T>(path: string, data: T): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(path, JSON.stringify(data), err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Disable extension (write to package.json)
 */
function disableExtension(extension: Extension): Promise<void> {
  const { packageJSON } = extension;
  packageJSON.contributes.snippets_disabled = packageJSON.contributes.snippets;
  packageJSON.contributes.snippets = undefined;
  return writeJSON(join(extension.path, 'package.json'), packageJSON);
}

/**
 * Enable extension (write to package.json)
 */
function enableExtension(extension: Extension): Promise<void> {
  const { packageJSON } = extension;
  packageJSON.contributes.snippets = packageJSON.contributes.snippets_disabled;
  packageJSON.contributes.snippets_disabled = undefined;
  return writeJSON(join(extension.path, 'package.json'), packageJSON);
}

function getExtensionIdFromDescription(description: string | undefined): string | null {
  if (!description) {
    return null;
  }

  if (description.includes('(built-in)')) {
    return description.slice(0, description.indexOf('(built-in)') - 1);
  }

  if (description.includes('(manually installed)')) {
    return description.slice(0, description.indexOf('(manually installed)') - 1);
  }

  return null;
}
