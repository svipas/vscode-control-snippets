import * as vscode from "vscode";
import { ExtensionData } from "./extension";

enum ExtensionStoreKey {
	VSCODE_VERSION = "vscode_version",
	DISABLED_EXTENSIONS = "disabled_extensions",
}

export class ExtensionStore {
	readonly disabledExtensions?: ExtensionData[];
	private readonly _globalState: vscode.ExtensionContext["globalState"];
	private _isNewVSCodeVersion?: boolean;

	constructor(globalState: vscode.ExtensionContext["globalState"]) {
		this._globalState = globalState;
		this.disabledExtensions = globalState.get<ExtensionData[]>(
			ExtensionStoreKey.DISABLED_EXTENSIONS
		);

		const vscodeVersionFromStorage = globalState.get<string>(
			ExtensionStoreKey.VSCODE_VERSION
		);
		if (
			vscodeVersionFromStorage &&
			vscodeVersionFromStorage !== vscode.version
		) {
			this._isNewVSCodeVersion = true;
		}
	}

	get shouldDisableExtensions(): boolean {
		return (
			vscode.env.appName.includes("Insiders") || !!this._isNewVSCodeVersion
		);
	}

	findExtensionById(id: string): ExtensionData | undefined {
		return this.disabledExtensions?.find((ext) => ext.id === id);
	}

	async saveDisabledExtensions(extensions: ExtensionData[]): Promise<void> {
		const disabledExtensionsId: Pick<
			ExtensionData,
			"id"
		>[] = extensions.map((ext) => ({ id: ext.id }));
		await this._globalState.update(
			ExtensionStoreKey.DISABLED_EXTENSIONS,
			disabledExtensionsId
		);
	}

	async updateVSCodeVersion(): Promise<void> {
		await this._globalState.update(
			ExtensionStoreKey.VSCODE_VERSION,
			vscode.version
		);
	}
}
