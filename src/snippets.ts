import * as fs from 'fs';
import * as path from 'path';
import { ExtensionData } from './extension';

export async function disableSnippetForExtension(extension: ExtensionData): Promise<void> {
	extension.packageJSON.contributes.snippets_disabled = extension.packageJSON.contributes.snippets;
	extension.packageJSON.contributes.snippets = undefined;
	await savePackageJSON(extension);
}

export async function enableSnippetForExtension(extension: ExtensionData): Promise<void> {
	extension.packageJSON.contributes.snippets = extension.packageJSON.contributes.snippets_disabled;
	extension.packageJSON.contributes.snippets_disabled = undefined;
	await savePackageJSON(extension);
}

function savePackageJSON(extension: ExtensionData): Promise<void> {
	return fs.promises.writeFile(path.join(extension.path, 'package.json'), JSON.stringify(extension.packageJSON));
}
