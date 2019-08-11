# Control Snippets &middot; [![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/svipas.control-snippets.svg)](https://marketplace.visualstudio.com/items?itemName=svipas.control-snippets)

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

&#x26a0; Reload or restart of VS Code is required after disable or enable snippets from extensions to take effect.

### I got _"Extensions have been modified on disk. Please reload the window."_ message

If you got **"Extensions have been modified on disk. Please reload the window."** message that means VS Code detected changes in extensions and reload of VS Code is required. After reload of VS Code you will not get that message anymore and snippets would be enabled or disabled.

### After VS Code update

You will probably have to repeat same steps you did before to disable or enable snippets for extensions.

## Contributing

Feel free to open issues or PRs!

<details>
<summary><strong>Debug extension</strong></summary>

- Open this repository inside VS Code.
- Run `Debug: Select and Start Debugging` from command palette or open debug sidebar.
- Select `Run Extension`.

</details>
