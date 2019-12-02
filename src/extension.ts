import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { MODIFY_EXTENSION_INVALID_ACTION_ERROR } from './errors';

export enum ModifyExtensionAction {
  Enable,
  Disable
}

export interface ExtensionData {
  id: string;
  name: string;
  description: string;
  path: string;
  packageJSON: ExtensionPackageJSON;
  isSnippetsEnabled?: boolean;
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

export function getExtensionIdFromDescription(description?: string): string | undefined {
  if (description?.includes('built-in')) {
    return description.slice(0, description.indexOf('(built-in)') - 1);
  }

  if (description?.includes('installed')) {
    return description.slice(0, description.indexOf('(installed)') - 1);
  }
}

/**
 * Modify extension (write to package.json).
 */
export async function modifyExtensionSnippets(
  modifyAction: ModifyExtensionAction,
  extension: ExtensionData
): Promise<void> {
  const { packageJSON } = extension;

  if (modifyAction === ModifyExtensionAction.Disable) {
    packageJSON.contributes.snippets_disabled = packageJSON.contributes.snippets;
    packageJSON.contributes.snippets = undefined;
  } else if (modifyAction === ModifyExtensionAction.Enable) {
    packageJSON.contributes.snippets = packageJSON.contributes.snippets_disabled;
    packageJSON.contributes.snippets_disabled = undefined;
  } else {
    throw MODIFY_EXTENSION_INVALID_ACTION_ERROR;
  }

  await fs.promises.writeFile(path.join(extension.path, 'package.json'), JSON.stringify(packageJSON));
}

export async function getAllExtensionsData(): Promise<ExtensionData[]> {
  const extensionsData: ExtensionData[] = [];

  for (const ext of vscode.extensions.all) {
    // Read package.json instead of accessing it from extension because it caches results and we need it in real-time.
    const fileContent = (await fs.promises.readFile(path.join(ext.extensionPath, 'package.json'))).toString();
    const packageJSON = JSON.parse(fileContent);

    if (!packageJSON.contributes) {
      continue;
    }

    const isBuiltin = packageJSON.publisher === 'vscode';
    const emoji = ext.extensionKind === vscode.ExtensionKind.UI ? '🔋' : '🔌';
    let name = packageJSON.name;
    if (!isBuiltin && packageJSON.displayName && packageJSON.displayName !== '%displayName%') {
      name = packageJSON.displayName;
    }

    const extension: ExtensionData = {
      id: ext.id,
      path: ext.extensionPath,
      description: `${ext.id} (${isBuiltin ? 'built-in' : 'installed'}) ${emoji}`,
      name,
      packageJSON
    };

    if (packageJSON.contributes.snippets) {
      extension.isSnippetsEnabled = true;
      extensionsData.push(extension);
    } else if (packageJSON.contributes.snippets_disabled) {
      extension.isSnippetsEnabled = false;
      extensionsData.push(extension);
    }
  }

  return extensionsData;
}
