import * as vscode from 'vscode';
import { ExtensionData } from './extension';

enum ExtensionStoreKey {
  VSCODE_VERSION = 'vscode_version',
  DISABLED_EXTENSIONS = 'disabled_extensions'
}

export class ExtensionStore {
  private readonly _globalState: vscode.ExtensionContext['globalState'];
  private readonly _disabledExtensions?: ExtensionData[];
  private _isNewVSCodeVersion?: boolean;

  constructor(globalState: vscode.ExtensionContext['globalState']) {
    this._globalState = globalState;
    this._disabledExtensions = this._globalState.get<ExtensionData[]>(ExtensionStoreKey.DISABLED_EXTENSIONS);

    const vscodeVersionFromStorage = this._globalState.get<string>(ExtensionStoreKey.VSCODE_VERSION);
    if (vscodeVersionFromStorage && vscodeVersionFromStorage !== vscode.version) {
      this._isNewVSCodeVersion = true;
    }
  }

  get shouldDisableExtensions(): boolean {
    return vscode.env.appName.includes('Insiders') || !!this._isNewVSCodeVersion;
  }

  get disabledExtensions(): ExtensionData[] | undefined {
    return this._disabledExtensions;
  }

  async saveDisabledExtensions(extensions: ExtensionData[]): Promise<void> {
    const disabledExtensionsId: Pick<ExtensionData, 'id'>[] = extensions.map(ext => ({ id: ext.id }));
    await Promise.all([
      this._globalState.update(ExtensionStoreKey.DISABLED_EXTENSIONS, disabledExtensionsId),
      this.updateVSCodeVersion
    ]);
  }

  async updateVSCodeVersion(): Promise<void> {
    await this._globalState.update(ExtensionStoreKey.VSCODE_VERSION, vscode.version);
  }
}
