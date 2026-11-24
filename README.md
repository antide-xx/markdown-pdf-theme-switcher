# Markdown PDF Theme Switcher

A Cursor / VS Code extension that installs **17 original professional CSS themes** for [Markdown PDF](https://github.com/yzane/vscode-markdown-pdf) (`yzane.markdown-pdf`) and lets you switch them from the Command Palette.

Themes embed **IBM Plex** so Linux exports do not fall back to Ubuntu Type 3. Paper size is Letter.

## Install

Install **Markdown PDF** (`yzane.markdown-pdf`) first. Then install this extension from the Marketplace:

- VS Code: search **Markdown PDF Theme Switcher**, or run `ext install antide-xx.markdown-pdf-theme-switcher`
- Command line: `code --install-extension antide-xx.markdown-pdf-theme-switcher`

Until the Marketplace listing is live, install the `.vsix` from [Releases](https://github.com/antide-xx/markdown-pdf-theme-switcher/releases):

```bash
cursor --install-extension markdown-pdf-theme-switcher-0.2.0.vsix
code --install-extension markdown-pdf-theme-switcher-0.2.0.vsix
```

On first load the extension copies themes to a stable folder (`~/.config/markdown-pdf-styles` on Linux) and writes **user-wide** Markdown PDF settings, so any folder you open will export with the same type.

## Use

1. Command Palette → **Markdown PDF: Switch Theme**
2. Pick a theme. The window reloads so Markdown PDF picks up the stylesheet.
3. Open a Markdown file → **Markdown PDF: Export (pdf)**

**Markdown PDF: Reinstall Theme Files** recopies CSS and fonts after an upgrade.

## Themes

Open the [style gallery](previews/gallery.html) for a full-page look at every theme.

<table>
<tr>
<td align="center" width="33%"><a href="previews/corporate-clean.png"><img src="previews/corporate-clean.png" alt="Corporate Clean"></a><br><b>Corporate Clean</b><br>Quiet business documents</td>
<td align="center" width="33%"><a href="previews/corporate-modern.png"><img src="previews/corporate-modern.png" alt="Corporate Modern"></a><br><b>Corporate Modern</b><br>Client deliverables (default)</td>
<td align="center" width="33%"><a href="previews/executive-memo.png"><img src="previews/executive-memo.png" alt="Executive Memo"></a><br><b>Executive Memo</b><br>Short internal briefs</td>
</tr>
<tr>
<td align="center"><a href="previews/professional-report.png"><img src="previews/professional-report.png" alt="Professional Report"></a><br><b>Professional Report</b><br>Multi-page reviews</td>
<td align="center"><a href="previews/legal-contract.png"><img src="previews/legal-contract.png" alt="Legal Contract"></a><br><b>Legal Contract</b><br>Agreements and NDAs</td>
<td align="center"><a href="previews/legal-modern.png"><img src="previews/legal-modern.png" alt="Legal Modern"></a><br><b>Legal Modern</b><br>Contracts that should feel current</td>
</tr>
<tr>
<td align="center"><a href="previews/proposal-sow.png"><img src="previews/proposal-sow.png" alt="Proposal / SOW"></a><br><b>Proposal / SOW</b><br>Scopes and client proposals</td>
<td align="center"><a href="previews/meeting-notes.png"><img src="previews/meeting-notes.png" alt="Meeting Notes"></a><br><b>Meeting Notes</b><br>Agendas and action items</td>
<td align="center"><a href="previews/technical-document.png"><img src="previews/technical-document.png" alt="Technical Document"></a><br><b>Technical Document</b><br>Engineering notes</td>
</tr>
<tr>
<td align="center"><a href="previews/production-document.png"><img src="previews/production-document.png" alt="Production Document"></a><br><b>Production Document</b><br>Film / post notes</td>
<td align="center"><a href="previews/editorial-serif.png"><img src="previews/editorial-serif.png" alt="Editorial Serif"></a><br><b>Editorial Serif</b><br>Treatments and essays</td>
<td align="center"><a href="previews/minimal-document.png"><img src="previews/minimal-document.png" alt="Minimal Document"></a><br><b>Minimal Document</b><br>When the theme should disappear</td>
</tr>
<tr>
<td align="center"><a href="previews/academic-paper.png"><img src="previews/academic-paper.png" alt="Academic Paper"></a><br><b>Academic Paper</b><br>Course papers</td>
<td align="center"><a href="previews/invoice-statement.png"><img src="previews/invoice-statement.png" alt="Invoice / Statement"></a><br><b>Invoice / Statement</b><br>Billing</td>
<td align="center"><a href="previews/one-page-brief.png"><img src="previews/one-page-brief.png" alt="One-Page Brief"></a><br><b>One-Page Brief</b><br>Leave-behinds</td>
</tr>
<tr>
<td align="center"><a href="previews/one-page-resume.png"><img src="previews/one-page-resume.png" alt="One-Page Resume"></a><br><b>One-Page Resume</b><br>Single-page résumés</td>
<td align="center"><a href="previews/field-checklist.png"><img src="previews/field-checklist.png" alt="Field Checklist"></a><br><b>Field Checklist</b><br>Shoot / field lists</td>
<td></td>
</tr>
</table>

Command Palette slugs match the filenames: `corporate-modern`, `one-page-resume`, and so on. Samples are in `sample/`.

## Build from source

```bash
git clone https://github.com/antide-xx/markdown-pdf-theme-switcher.git
cd markdown-pdf-theme-switcher
./scripts/package-vsix.sh
```

That writes `markdown-pdf-theme-switcher-0.2.0.vsix` in the repo root.

Publisher ID is `antide-xx`. `./scripts/package-vsix.sh` builds a VSIX; `npx @vscode/vsce publish` pushes it to the [Visual Studio Marketplace](https://marketplace.visualstudio.com/) once a publisher token is configured. See [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension).

## Why user settings

Markdown PDF resolves CSS from the **open folder**. If settings only live in one workspace, exporting from another folder (a one-off proposal, a clone, a temp file) silently uses the default Ubuntu stylesheet. This extension writes Global `markdown-pdf.styles` and `includeDefaultStyles: false`.

## License

- Extension and original CSS: [MIT](LICENSE)
- IBM Plex (bundled in `fonts/`): [SIL Open Font License 1.1](fonts/LICENSE.txt). Reserved Font Name **Plex**.
