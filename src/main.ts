import * as vscode from 'vscode';
import {
  ModifyExtensionAction,
  ExtensionData,
  getAllExtensionsData,
  getExtensionIdFromDescription,
  modifyExtensionSnippets
} from './extension';

export const EXTENSION_COMMAND = 'extension.control-snippets';
const MODAL_RELOAD = 'Reload';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(EXTENSION_COMMAND, async (args?: [vscode.CancellationToken?]) => {
    try {
      await openControlSnippets(args?.[0]);
    } catch (err) {
      vscode.window.showErrorMessage(err);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function openControlSnippets(cancellationToken?: vscode.CancellationToken) {
  const extensionsData = await getAllExtensionsData();
  const quickPickItems: vscode.QuickPickItem[] = extensionsData.map(ext => ({
    label: ext.name,
    description: ext.description,
    picked: ext.isSnippetsEnabled
  }));

  const selectedQuickPickValues = await vscode.window.showQuickPick(
    quickPickItems,
    {
      canPickMany: true,
      ignoreFocusOut: true,
      matchOnDescription: true,
      placeHolder: 'Select extension whose snippets to disable or enable'
    },
    cancellationToken
  );

  // Canceled by user.
  if (!selectedQuickPickValues) {
    return;
  }

  const enabledExtensions: ExtensionData[] = [];
  const disabledExtensions: ExtensionData[] = [];

  // Nothing was selected, disable all extensions.
  if (selectedQuickPickValues.length === 0) {
    for (const ext of extensionsData) {
      // Extension is already disabled.
      if (!ext.isSnippetsEnabled || ext.packageJSON.contributes.snippets_disabled) {
        continue;
      }

      await modifyExtensionSnippets(ModifyExtensionAction.Disable, ext);
      disabledExtensions.push(ext);
    }
  }

  // Only selected values from quick pick.
  for (const value of selectedQuickPickValues) {
    const ext = extensionsData.find(ext => ext.id === getExtensionIdFromDescription(value.description));
    if (!ext) {
      continue;
    }

    // Extension is already enabled.
    if (ext.isSnippetsEnabled || ext.packageJSON.contributes.snippets) {
      enabledExtensions.push(ext);
      continue;
    }

    await modifyExtensionSnippets(ModifyExtensionAction.Enable, ext);
    enabledExtensions.push(ext);
  }

  // Disable extensions by checking difference between disabled/enabled extensions from the quick pick.
  if (disabledExtensions.length !== extensionsData.length) {
    for (const ext of extensionsData) {
      const isEnabledExtensionFromQuickPick = enabledExtensions.find(val => val.id === ext.id);
      if (isEnabledExtensionFromQuickPick) {
        continue;
      }

      const isDisabledExtensionFromQuickPick = disabledExtensions.find(val => val.id === ext.id);
      if (isDisabledExtensionFromQuickPick) {
        continue;
      }

      // Extension is already disabled.
      if (!ext.isSnippetsEnabled || ext.packageJSON.contributes.snippets_disabled) {
        continue;
      }

      await modifyExtensionSnippets(ModifyExtensionAction.Disable, ext);
    }
  }

  let reloadModalResponse = await vscode.window.showInformationMessage(
    'To disable or enable snippets from extensions reload is required.',
    { modal: true },
    ...([{ title: 'Cancel', isCloseAffordance: true }, { title: MODAL_RELOAD }] as vscode.MessageItem[])
  );

  if (reloadModalResponse?.title === MODAL_RELOAD) {
    reloadWindow();
    return;
  }

  reloadModalResponse = await vscode.window.showWarningMessage(
    'Reload or restart of VS Code is required after disable or enable snippets from extensions to take effect.',
    { modal: false },
    { title: MODAL_RELOAD } as vscode.MessageItem
  );

  if (reloadModalResponse?.title === MODAL_RELOAD) {
    reloadWindow();
  }
}

function reloadWindow() {
  vscode.commands.executeCommand('workbench.action.reloadWindow');
}
