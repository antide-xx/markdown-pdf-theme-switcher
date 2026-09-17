#!/usr/bin/env bash
# Package a VSIX. Prefers @vscode/vsce; falls back to a zip that Cursor/VS Code can install.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
VERSION="$(node -p "require('./package.json').version")"
NAME="$(node -p "require('./package.json').name")"
OUT="$ROOT/${NAME}-${VERSION}.vsix"
rm -f "$OUT"

if command -v vsce >/dev/null 2>&1; then
  vsce package -o "$OUT"
elif command -v npx >/dev/null 2>&1; then
  npx --yes @vscode/vsce package -o "$OUT"
else
  STAGE="$(mktemp -d)"
  trap 'rm -rf "$STAGE"' EXIT
  mkdir -p "$STAGE/extension"
  cp "$ROOT/package.json" "$ROOT/extension.js" "$ROOT/README.md" "$ROOT/LICENSE" "$ROOT/themes.json" "$STAGE/extension/"
  cp -R "$ROOT/themes" "$ROOT/fonts" "$ROOT/media" "$STAGE/extension/"
  cat > "$STAGE/[Content_Types].xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json"/>
  <Default Extension="vsixmanifest" ContentType="text/xml"/>
  <Default Extension="js" ContentType="application/javascript"/>
  <Default Extension="md" ContentType="text/markdown"/>
  <Default Extension="css" ContentType="text/css"/>
  <Default Extension="ttf" ContentType="font/ttf"/>
  <Default Extension="txt" ContentType="text/plain"/>
  <Default Extension="png" ContentType="image/png"/>
</Types>
XML
  cat > "$STAGE/extension.vsixmanifest" <<XML
<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
  <Metadata>
    <Identity Language="en-US" Id="${NAME}" Version="${VERSION}" Publisher="antide-xx" />
    <DisplayName>Markdown PDF Theme Switcher</DisplayName>
    <Description xml:space="preserve">Professional CSS themes for Markdown PDF, with a Command Palette switcher and embedded IBM Plex.</Description>
    <Categories>Other</Categories>
    <Properties>
      <Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.80.0" />
      <Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace" />
    </Properties>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" />
  </Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
  </Assets>
</PackageManifest>
XML
  (cd "$STAGE" && zip -q -r "$OUT" .)
fi

echo "$OUT"
