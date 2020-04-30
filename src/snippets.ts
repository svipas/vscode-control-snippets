import * as fs from 'fs';
import * as path from 'path';
import { ExtensionData } from './extension';

export async function disableSnippetForExtension(extension: ExtensionData): Promise<void> {
	const { contributes } = extension.packageJSON;

	if (contributes.snippets_disabled) {
		throw new Error(`${extension.name} is already disabled.`);
	}

	contributes.snippets_disabled = contributes.snippets;
	contributes.snippets = undefined;
	await savePackageJSON(extension);
}

export async function enableSnippetForExtension(extension: ExtensionData): Promise<void> {
	const { contributes } = extension.packageJSON;

	if (contributes.snippets) {
		throw new Error(`${extension.name} is already enabled.`);
	}

	contributes.snippets = contributes.snippets_disabled;
	contributes.snippets_disabled = undefined;
	await savePackageJSON(extension);
}

function savePackageJSON(extension: ExtensionData): Promise<void> {
	return fs.promises.writeFile(path.join(extension.path, 'package.json'), JSON.stringify(extension.packageJSON));
}
