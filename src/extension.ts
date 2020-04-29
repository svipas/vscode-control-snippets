import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export interface ExtensionData {
	id: string;
	name: string;
	description: string;
	path: string;
	packageJSON: {
		name: string;
		publisher: string;
		displayName?: string;
		contributes: {
			snippets?: any;
			snippets_disabled?: any;
		};
	};
	isSnippetsEnabled?: boolean;
}

export function getExtensionIdFromText(text?: string): string | undefined {
	if (text?.includes('built-in')) {
		return text.slice(0, text.indexOf('(built-in)') - 1);
	}

	if (text?.includes('installed')) {
		return text.slice(0, text.indexOf('(installed)') - 1);
	}
}

export async function getAllExtensionsFromVSCode(): Promise<{
	all: ExtensionData[];
	disabled: ExtensionData[];
	enabled: ExtensionData[];
	isAllEnabled: boolean;
	isAllDisabled: boolean;
}> {
	const allExtensions: ExtensionData[] = [];
	const disabledExtensions: ExtensionData[] = [];
	const enabledExtensions: ExtensionData[] = [];

	for (const ext of vscode.extensions.all) {
		// Read package.json instead of accessing it from extension because it caches results and we need it in real-time.
		const fileContent = await fs.promises.readFile(path.join(ext.extensionPath, 'package.json'), 'utf8');
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
			allExtensions.push(extension);
			enabledExtensions.push(extension);
		} else if (packageJSON.contributes.snippets_disabled) {
			extension.isSnippetsEnabled = false;
			allExtensions.push(extension);
			disabledExtensions.push(extension);
		}
	}

	return {
		all: allExtensions,
		enabled: enabledExtensions,
		disabled: disabledExtensions,
		isAllDisabled: disabledExtensions.length === allExtensions.length,
		isAllEnabled: enabledExtensions.length === allExtensions.length
	};
}
