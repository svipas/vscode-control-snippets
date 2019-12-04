import * as vscode from 'vscode';
import { ExtensionData } from './extension';

enum ExtensionStoreKey {
  VSCODE_VERSION = 'vscode_version',
  EXTENSIONS_DATA = 'extensions_data'
}

export class ExtensionStore {
  private readonly _globalState: vscode.ExtensionContext['globalState'];
  private _isNewVSCodeVersion = false;
  private readonly _extensionsData?: ExtensionData[];

  constructor(globalState: vscode.ExtensionContext['globalState']) {
    this._globalState = globalState;

    const vscodeVersionFromStore = globalState.get<string>(ExtensionStoreKey.VSCODE_VERSION);
    if (!vscodeVersionFromStore) {
      globalState.update(ExtensionStoreKey.VSCODE_VERSION, vscode.version);
    } else if (vscodeVersionFromStore !== vscode.version) {
      globalState.update(ExtensionStoreKey.VSCODE_VERSION, vscode.version);
      this._isNewVSCodeVersion = true;
    }

    this._extensionsData = this._globalState.get<ExtensionData[]>(ExtensionStoreKey.EXTENSIONS_DATA);
  }

  get isNewVSCodeVersion() {
    return this._isNewVSCodeVersion;
  }

  get extensionsData(): ExtensionData[] | undefined {
    return this._extensionsData;
  }

  saveExtensionsData(extensions: ExtensionData[]) {
    const mappedExtensions: Pick<ExtensionData, 'id' | 'isSnippetsEnabled'>[] = extensions.map(ext => ({
      id: ext.id,
      isSnippetsEnabled: ext.isSnippetsEnabled
    }));
    this._globalState.update(ExtensionStoreKey.EXTENSIONS_DATA, mappedExtensions);
  }
}
