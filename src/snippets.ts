import * as fs from 'fs';
import * as path from 'path';
import { ExtensionData } from './extension';

export class Snippets {
  static async disable(extension: ExtensionData): Promise<void> {
    extension.packageJSON.contributes.snippets_disabled = extension.packageJSON.contributes.snippets;
    extension.packageJSON.contributes.snippets = undefined;
    await this.savePackageJSON(extension);
  }

  static async enable(extension: ExtensionData): Promise<void> {
    extension.packageJSON.contributes.snippets = extension.packageJSON.contributes.snippets_disabled;
    extension.packageJSON.contributes.snippets_disabled = undefined;
    await this.savePackageJSON(extension);
  }

  private static savePackageJSON(extension: ExtensionData): Promise<void> {
    return fs.promises.writeFile(path.join(extension.path, 'package.json'), JSON.stringify(extension.packageJSON));
  }
}
