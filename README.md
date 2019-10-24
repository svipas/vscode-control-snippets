# Control Snippets &middot; [![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/svipas.control-snippets.svg)](https://marketplace.visualstudio.com/items?itemName=svipas.control-snippets) [![Build Status](https://dev.azure.com/svipas/svipas/_apis/build/status/svipas.vscode-control-snippets?branchName=master)](https://dev.azure.com/svipas/svipas/_build/latest?definitionId=5&branchName=master)

Disable or enable VS Code's built-in snippets and manually installed snippets from extensions.

<img src="https://raw.githubusercontent.com/svipas/vscode-control-snippets/master/control-snippets.png" width="70%">

## Installation

Install through VS Code extensions, search for `Control Snippets` by `Benas Svipas`. _If you can't find extension by name try to search by publisher name._

## Usage

1. Open Command Palette.
2. Write `Control Snippets` and disable or enable any snippets from extensions.
3. Reload or restart VS Code.

## FAQ

### I still see snippets

Reload or restart of VS Code is required after disable or enable snippets from extensions to take effect. _If you're in **Windows**, you have to **run VS Code as administrator** in order to use this extension._

### I got _"Extensions have been modified on disk. Please reload the window."_ message

If you got **"Extensions have been modified on disk. Please reload the window."** message that means VS Code detected changes in extensions and reload of VS Code is required. After reload of VS Code you will not get that message anymore and snippets would be enabled or disabled.

### After VS Code update

You will probably have to repeat same steps you did before to disable or enable snippets for extensions.

### Remote machine shows only few extensions

If you're connected to a remote machine you probably will not see all extensions as you see working locally because VS Code disables a lot of built-in extensions while connected remotely.

### Emoji meaning

- 🔋- extension runs where the UI (window) runs.
- 🔌- extension runs remotely.

## Contributing

Feel free to open issues or PRs!

<details>
<summary><strong>Debug extension</strong></summary>

- Open this repository inside VS Code.
- Run `Debug: Select and Start Debugging` from command palette or open debug sidebar.
- Select `Run Extension`.

</details>
