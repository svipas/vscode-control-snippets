import * as vscode from 'vscode';
import {
  ExtensionData,
  getAllExtensionsData,
  getExtensionIdFromDescription,
  ModifyExtensionAction,
  modifyExtensionSnippets
} from './extension';
import { ExtensionStore } from './extension-store';

const EXTENSION_COMMAND = 'extension.control-snippets';
const MODAL_RELOAD = 'Reload Window';

export async function activate(context: vscode.ExtensionContext) {
  const store = new ExtensionStore(context.globalState);
  const controlSnippetsCommand = vscode.commands.registerCommand(
    EXTENSION_COMMAND,
    async (args?: [vscode.CancellationToken?]) => {
      try {
        const shouldPromptForReload = await openControlSnippets(args?.[0]);
        if (!shouldPromptForReload) {
          return;
        }

        // Save disabled extensions and current VS Code version to global store.
        const disabledExtensions = (await getAllExtensionsData()).filter(ext => {
          return ext.isSnippetsEnabled != null && !ext.isSnippetsEnabled;
        });
        await Promise.all([store.saveDisabledExtensions(disabledExtensions), store.updateVSCodeVersion()]);

        const reloadModalResponse = await showReloadModal();
        if (reloadModalResponse?.title === MODAL_RELOAD) {
          reloadWindow();
          return;
        }

        const reloadWarningResponse = await showReloadWarning();
        if (reloadWarningResponse?.title === MODAL_RELOAD) {
          reloadWindow();
        }
      } catch (err) {
        vscode.window.showErrorMessage(err);
      }
    }
  );

  context.subscriptions.push(controlSnippetsCommand);

  if (
    !store.shouldDisableExtensions ||
    !Array.isArray(store.disabledExtensions) ||
    store.disabledExtensions.length === 0
  ) {
    return;
  }

  try {
    let shouldPromptForReload = false;

    // Disable extensions snippets if there's any stored in global store.
    for (const ext of await getAllExtensionsData()) {
      if (ext.isSnippetsEnabled != null && !ext.isSnippetsEnabled) {
        continue;
      }

      const disabledExt = store.disabledExtensions.find(disabledExt => disabledExt.id === ext.id);
      if (!disabledExt) {
        continue;
      }

      await modifyExtensionSnippets(ModifyExtensionAction.Disable, ext);
      shouldPromptForReload = true;
    }

    if (shouldPromptForReload) {
      await store.updateVSCodeVersion();

      const reloadWarningResponse = await showReloadWarning();
      if (reloadWarningResponse?.title === MODAL_RELOAD) {
        reloadWindow();
      }
    }
  } catch (err) {
    vscode.window.showErrorMessage(err);
  }
}

export function deactivate() {}

/**
 * @returns true if it should prompt reload modal, false otherwise.
 */
async function openControlSnippets(cancellationToken?: vscode.CancellationToken): Promise<boolean> {
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
    return false;
  }

  const enabledExtensions: ExtensionData[] = [];

  // Nothing was selected, disable all extensions.
  if (selectedQuickPickValues.length === 0) {
    // All extensions snippets are already disabled.
    if (extensionsData.every(ext => ext.isSnippetsEnabled != null && !ext.isSnippetsEnabled)) {
      return false;
    }

    for (const ext of extensionsData) {
      // Extension is already disabled.
      if (ext.isSnippetsEnabled != null && !ext.isSnippetsEnabled) {
        continue;
      }

      await modifyExtensionSnippets(ModifyExtensionAction.Disable, ext);
    }

    return true;
  }

  // All extensions snippets are already enabled.
  if (selectedQuickPickValues.length === extensionsData.length && extensionsData.every(ext => ext.isSnippetsEnabled)) {
    return false;
  }

  let shouldPromptReloadModal = false;

  // Only selected values from quick pick.
  for (const value of selectedQuickPickValues) {
    const ext = extensionsData.find(ext => ext.id === getExtensionIdFromDescription(value.description));
    if (!ext) {
      continue;
    }

    // Extension is already enabled.
    if (ext.isSnippetsEnabled) {
      enabledExtensions.push(ext);
      continue;
    }

    await modifyExtensionSnippets(ModifyExtensionAction.Enable, ext);
    enabledExtensions.push(ext);
    shouldPromptReloadModal = true;
  }

  // Disable extensions by checking difference between enabled extensions.
  for (const ext of extensionsData) {
    const isEnabledExtensionFromQuickPick = enabledExtensions.find(val => val.id === ext.id);
    if (isEnabledExtensionFromQuickPick) {
      continue;
    }

    // Extension is already disabled.
    if (ext.isSnippetsEnabled != null && !ext.isSnippetsEnabled) {
      continue;
    }

    await modifyExtensionSnippets(ModifyExtensionAction.Disable, ext);
    shouldPromptReloadModal = true;
  }

  return shouldPromptReloadModal;
}

function reloadWindow() {
  vscode.commands.executeCommand('workbench.action.reloadWindow');
}

function showReloadModal() {
  return vscode.window.showInformationMessage(
    'To disable or enable snippets from extensions reload is required.',
    { modal: true },
    ...([{ title: 'Cancel', isCloseAffordance: true }, { title: MODAL_RELOAD }] as vscode.MessageItem[])
  );
}

function showReloadWarning() {
  return vscode.window.showWarningMessage(
    'Reload or restart of VS Code is required after disable or enable snippets from extensions to take effect.',
    { modal: false },
    { title: MODAL_RELOAD } as vscode.MessageItem
  );
}
