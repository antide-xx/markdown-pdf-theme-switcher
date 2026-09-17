const fs = require("fs");
const os = require("os");
const path = require("path");
const vscode = require("vscode");

const VERSION_FILE = ".installed-version";

function stableDir() {
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || os.homedir(), "markdown-pdf-styles");
  }
  if (process.platform === "darwin") {
    return path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "markdown-pdf-styles"
    );
  }
  return path.join(os.homedir(), ".config", "markdown-pdf-styles");
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function installFiles(context, force) {
  const dest = stableDir();
  const version = String(context.extension.packageJSON.version || "0");
  const marker = path.join(dest, VERSION_FILE);
  const complete =
    fs.existsSync(path.join(dest, "themes.json")) &&
    fs.existsSync(path.join(dest, "fonts", "ibm-plex.css")) &&
    fs.existsSync(path.join(dest, "themes", "corporate-modern.css"));
  const sameVersion =
    fs.existsSync(marker) && fs.readFileSync(marker, "utf8").trim() === version;
  if (!force && complete && sameVersion) return dest;

  copyDir(path.join(context.extensionPath, "themes"), path.join(dest, "themes"));
  copyDir(path.join(context.extensionPath, "fonts"), path.join(dest, "fonts"));
  fs.copyFileSync(
    path.join(context.extensionPath, "themes.json"),
    path.join(dest, "themes.json")
  );
  fs.writeFileSync(marker, `${version}\n`);
  return dest;
}

function loadCatalog(dest) {
  return JSON.parse(fs.readFileSync(path.join(dest, "themes.json"), "utf8"));
}

function stylePaths(dest, theme) {
  const fontsCss = path.join(dest, "fonts", "ibm-plex.css");
  const themeCss = path.join(dest, theme.file);
  if (!fs.existsSync(themeCss)) {
    throw new Error(`Theme CSS missing: ${themeCss}`);
  }
  return fs.existsSync(fontsCss) ? [fontsCss, themeCss] : [themeCss];
}

function configTargets() {
  const targets = [vscode.ConfigurationTarget.Global];
  if (vscode.workspace.workspaceFolders?.length) {
    targets.push(vscode.ConfigurationTarget.Workspace);
  }
  return targets;
}

async function applyTheme(dest, slug, catalog) {
  const theme = catalog.themes[slug];
  if (!theme) throw new Error(`Unknown theme: ${slug}`);
  const styles = stylePaths(dest, theme);
  const mdPdf = vscode.workspace.getConfiguration("markdown-pdf");
  const ours = vscode.workspace.getConfiguration("markdownPdfStyles");
  const margin = theme.margin || {};

  for (const target of configTargets()) {
    await mdPdf.update("styles", styles, target);
    await mdPdf.update("stylesRelativePathFile", false, target);
    await mdPdf.update("includeDefaultStyles", false, target);
    await mdPdf.update("printBackground", true, target);
    await mdPdf.update("format", "Letter", target);
    await mdPdf.update("displayHeaderFooter", false, target);
    if (margin.top) await mdPdf.update("margin.top", margin.top, target);
    if (margin.right) await mdPdf.update("margin.right", margin.right, target);
    if (margin.bottom) await mdPdf.update("margin.bottom", margin.bottom, target);
    if (margin.left) await mdPdf.update("margin.left", margin.left, target);
    await ours.update("theme", slug, target);
  }
}

function stylesAlreadyOurs(dest) {
  const styles = vscode.workspace.getConfiguration("markdown-pdf").get("styles") || [];
  return styles.some(
    (style) => typeof style === "string" && style.startsWith(dest)
  );
}

async function ensureApplied(context) {
  const dest = installFiles(context, false);
  if (stylesAlreadyOurs(dest)) return dest;
  const catalog = loadCatalog(dest);
  const slug =
    vscode.workspace.getConfiguration("markdownPdfStyles").get("theme") ||
    catalog.defaultTheme;
  if (!catalog.themes[slug]) return dest;
  await applyTheme(dest, slug, catalog);
  return dest;
}

async function switchTheme(context) {
  const dest = installFiles(context, false);
  const catalog = loadCatalog(dest);
  const current =
    vscode.workspace.getConfiguration("markdownPdfStyles").get("theme") ||
    catalog.defaultTheme;

  const items = Object.entries(catalog.themes).map(([slug, theme]) => ({
    label: `${slug === current ? "$(check) " : ""}${theme.name}`,
    description: slug,
    detail: theme.use,
    slug
  }));

  const picked = await vscode.window.showQuickPick(items, {
    title: "Markdown PDF theme",
    placeHolder: catalog.themes[current]
      ? `Current: ${catalog.themes[current].name}`
      : "Select a theme",
    matchOnDescription: true,
    matchOnDetail: true,
    ignoreFocusOut: true
  });
  if (!picked) return;

  if (picked.slug === current && stylesAlreadyOurs(dest)) {
    const choice = await vscode.window.showInformationMessage(
      `${catalog.themes[current].name} is already the active theme. Reload the window anyway?`,
      "Reload Window"
    );
    if (choice === "Reload Window") {
      await vscode.commands.executeCommand("workbench.action.reloadWindow");
    }
    return;
  }

  try {
    await applyTheme(dest, picked.slug, catalog);
  } catch (err) {
    vscode.window.showErrorMessage(`Could not switch theme: ${err.message}`);
    return;
  }

  await vscode.commands.executeCommand("workbench.action.reloadWindow");
}

async function reinstallFiles(context) {
  const dest = installFiles(context, true);
  const catalog = loadCatalog(dest);
  const slug =
    vscode.workspace.getConfiguration("markdownPdfStyles").get("theme") ||
    catalog.defaultTheme;
  await applyTheme(dest, catalog.themes[slug] ? slug : catalog.defaultTheme, catalog);
  vscode.window.showInformationMessage(
    `Markdown PDF themes installed to ${dest}. Reload the window if an export still looks unchanged.`
  );
}

function activate(context) {
  ensureApplied(context).catch((err) => {
    console.error("markdown-pdf-theme-switcher", err);
  });
  context.subscriptions.push(
    vscode.commands.registerCommand("markdownPdfStyles.switchTheme", () =>
      switchTheme(context)
    ),
    vscode.commands.registerCommand("markdownPdfStyles.reinstallFiles", () =>
      reinstallFiles(context)
    )
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
