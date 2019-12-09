import * as vscode from 'vscode';
import { ExtensionData } from './extension';

enum ExtensionStoreKey {
  DISABLED_EXTENSIONS = 'disabled_extensions'
}

export class ExtensionStore {
  private readonly _globalState: vscode.ExtensionContext['globalState'];
  private readonly _disabledExtensions?: ExtensionData[];

  constructor(globalState: vscode.ExtensionContext['globalState']) {
    this._globalState = globalState;
    this._disabledExtensions = this._globalState.get<ExtensionData[]>(ExtensionStoreKey.DISABLED_EXTENSIONS);
  }

  get disabledExtensions(): ExtensionData[] | undefined {
    return this._disabledExtensions;
  }

  saveDisabledExtensions(extensions: ExtensionData[]) {
    const disabledExtensionsId: Pick<ExtensionData, 'id'>[] = extensions.map(ext => ({ id: ext.id }));
    this._globalState.update(ExtensionStoreKey.DISABLED_EXTENSIONS, disabledExtensionsId);
  }

  clearDisabledExtensions() {
    this._globalState.update(ExtensionStoreKey.DISABLED_EXTENSIONS, undefined);
  }
}
