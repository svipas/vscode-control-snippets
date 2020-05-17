import * as vscode from "vscode";
import { ExtensionData } from "./extension";

enum ExtensionStoreKey {
	VSCODE_VERSION = "vscode_version",
	DISABLED_EXTENSIONS = "disabled_extensions",
}

export class ExtensionStore {
	readonly disabledExtensions?: ExtensionData[];
	private readonly globalState: vscode.ExtensionContext["globalState"];
	private isNewVSCodeVersion?: boolean;

	constructor(globalState: vscode.ExtensionContext["globalState"]) {
		this.globalState = globalState;
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
			this.isNewVSCodeVersion = true;
		}
	}

	get shouldDisableExtensions(): boolean {
		return vscode.env.appName.includes("Insiders") || !!this.isNewVSCodeVersion;
	}

	findExtensionById(id: string): ExtensionData | undefined {
		return this.disabledExtensions?.find((ext) => ext.id === id);
	}

	async saveDisabledExtensions(extensions: ExtensionData[]): Promise<void> {
		const disabledExtensionsId: Pick<
			ExtensionData,
			"id"
		>[] = extensions.map((ext) => ({ id: ext.id }));
		await this.globalState.update(
			ExtensionStoreKey.DISABLED_EXTENSIONS,
			disabledExtensionsId
		);
	}

	async updateVSCodeVersion(): Promise<void> {
		await this.globalState.update(
			ExtensionStoreKey.VSCODE_VERSION,
			vscode.version
		);
	}
}
