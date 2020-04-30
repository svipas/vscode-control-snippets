## [Unreleased]

## 1.8.0 (April 30, 2020)

- Format project with Prettier 2.
- Rename `main.test.ts` to `extension.test.ts`.
- Fix wrong method usage if nothing was selected in the picker.
- Throw error if snippet is already disabled/enabled while disabling/enabling it.
- Create tests for disabling/enabling snippets.

## 1.7.6 (April 29, 2020)

- Change indentation to tabs.
- Update all dependencies.
- Change filename convention to kebab-case.
- Add `vscode:publish` script.

## 1.7.5 (March 6, 2020)

- Update all dependencies.
- Refactor extension.

## 1.7.4 (February 25, 2020)

- Update all dependencies including TypeScript to 3.8

## 1.7.3 (February 13, 2020)

- Update all dependencies.
- Refactor extension.

## 1.7.2 (January 17, 2020)

- Update all dependencies.
- Properly return `exitCode` after tests.

## 1.7.1 (December 18, 2019)

- Update all dependencies.
- Publish extension with `--yarn` flag in `vsce` command.

## 1.7.0 (December 13, 2019)

- Set `target` in `tsconfig.json` to `ES2017` instead of `es6` and remove `lib` key.
- Refactor extension logic to make it easier to maintain and to reduce some boilerplate.

## 1.6.1 (December 13, 2019)

- Update all dependencies.

## 1.6.0 (December 9, 2019)

- Update all dependencies.
- Refactor `ExtensionStore` to store only disabled extensions.
- Fix restoring of disabled extensions snippets after extension activation for Insiders build.

## 1.5.0 (December 4, 2019)

- Update all dependencies.
- Update `LICENSE` year.
- Set `extensionKind` to `["workspace"]` in `package.json`.
- Rename `extension.test.ts` to `main.test.ts` and refactor tests.
- Set main file name to `main.ts` instead of `extension.ts`.
- Create `errors.ts` which contains all extension errors.
- Create `main.ts` and refactor extension to save modified extensions snippets in global store.
- Prompt for reload modal only if something was changed after "OK" press.
- Restore modified extensions snippets after VS Code update.
- Update control snippets image and move it to `images` dir.
- Create `ExtensionStore` to store current VS Code version and modified extension snippets in global store.

## 1.4.2 (November 15, 2019)

- Update all dependencies.
- Minor changes to extension tests.
- Use new TypeScript features in several places.

## 1.4.1 (October 24, 2019)

- Update `azure-pipelines.yml` to use Node 12 and fix triggers.

## 1.4.0 (October 24, 2019)

- Add `azure-pipelines.yml` and `control-snippets.png` to `.vscodeignore`.
- Update dependencies.
- Add more `keywords` in `package.json`.
- Set `extensionKind` as `workspace` in `package.json`.
- Update `README.md` by explaining why you still see snippets in Windows. Fixes [#2](https://github.com/svipas/vscode-control-snippets/issues/2). Thanks [gluons](https://github.com/gluons).

## 1.3.0 (August 20, 2019)

- Add Azure Pipelines.
- Create several tests.
- Fix bug in `getExtensionIdFromDescription()` which was returning bad extension id.

## 1.2.0 (August 19, 2019)

- Instead of `(manually installed)` show `(installed)`.
- If extension is local show 🔋emoji, if extension is remote show 🔌emoji.
- Update `README.md`.
- Update image of how extension looks like.

## 1.1.0 (August 11, 2019)

- Add `LICENSE` file.
- Update `README`.
- Add more extension categories in `package.json`.
- Change minimum vscode version from `1.36.0` to `1.30.0`.
- Instead of extension id display name and instead of extension path display extension id and if it's built-in or manually installed.
- Enable search in quick pick by description.
- Change quick pick placeholder text.
- Update image of how extension looks like.

## 1.0.1 (August 10, 2019)

- Add image of how extension looks like.
- Change extension category from `Snippets` to `Other` in `package.json`.
- Change quick pick placeholder text.

## 1.0.0 (August 10, 2019)

- Initial release.
