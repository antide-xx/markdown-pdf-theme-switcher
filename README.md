# Markdown PDF Theme Switcher

A Cursor / VS Code extension that installs **16 original professional CSS themes** for [Markdown PDF](https://github.com/yzane/vscode-markdown-pdf) (`yzane.markdown-pdf`) and lets you switch them from the Command Palette.

Themes embed **IBM Plex** so Linux exports do not fall back to Ubuntu Type 3. Paper size is Letter.

## Install

1. Install **Markdown PDF** (`yzane.markdown-pdf`) if it is not already installed.
2. Download the `.vsix` from [Releases](https://github.com/antide-xx/markdown-pdf-theme-switcher/releases).
3. Command Palette → **Extensions: Install from VSIX…** and pick the file.

From a terminal:

```bash
# Cursor
cursor --install-extension markdown-pdf-theme-switcher-0.2.0.vsix

# VS Code
code --install-extension markdown-pdf-theme-switcher-0.2.0.vsix
```

On first load the extension copies themes to a stable folder (`~/.config/markdown-pdf-styles` on Linux) and writes **user-wide** Markdown PDF settings, so any folder you open will export with the same type.

## Use

1. Command Palette → **Markdown PDF: Switch Theme**
2. Pick a theme. The window reloads so Markdown PDF picks up the stylesheet.
3. Open a Markdown file → **Markdown PDF: Export (pdf)**

**Markdown PDF: Reinstall Theme Files** recopies CSS and fonts after an upgrade.

## Themes

| Slug | Best for |
| --- | --- |
| `corporate-clean` | Quiet business documents |
| `corporate-modern` | Client deliverables (default) |
| `executive-memo` | Short internal briefs |
| `professional-report` | Multi-page reviews |
| `legal-contract` | Agreements and NDAs |
| `legal-modern` | Contracts that should feel current |
| `proposal-sow` | Scopes and client proposals |
| `meeting-notes` | Agendas and action items |
| `technical-document` | Engineering notes |
| `production-document` | Film / post notes |
| `editorial-serif` | Treatments and essays |
| `minimal-document` | When the theme should disappear |
| `academic-paper` | Course papers |
| `invoice-statement` | Billing |
| `one-page-brief` | Leave-behinds |
| `field-checklist` | Shoot / field lists |

A sample proposal is in `sample/proposal.md`.

## Build from source

```bash
git clone https://github.com/antide-xx/markdown-pdf-theme-switcher.git
cd markdown-pdf-theme-switcher
./scripts/package-vsix.sh
```

That writes `markdown-pdf-theme-switcher-0.2.0.vsix` in the repo root.

Publishing to the VS Marketplace / Open VSX needs a publisher token for `antide-xx`. Until then, install from the GitHub Release VSIX.

## Why user settings

Markdown PDF resolves CSS from the **open folder**. If settings only live in one workspace, exporting from another folder (a one-off proposal, a clone, a temp file) silently uses the default Ubuntu stylesheet. This extension writes Global `markdown-pdf.styles` and `includeDefaultStyles: false`.

## License

- Extension and original CSS: [MIT](LICENSE)
- IBM Plex (bundled in `fonts/`): [SIL Open Font License 1.1](fonts/LICENSE.txt). Reserved Font Name **Plex**.
