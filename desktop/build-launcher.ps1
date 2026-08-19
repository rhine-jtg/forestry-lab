$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$compilerCandidates = @(
    "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe",
    "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
)
$compiler = $compilerCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $compiler) {
    throw "C# compiler csc.exe was not found."
}

$outputDirectory = Join-Path $projectRoot "dist"
$outputPath = Join-Path $outputDirectory "Forestry-Lab.exe"
$indexPath = Join-Path $projectRoot "index.html"
$stylesPath = Join-Path $projectRoot "styles.css"
$scriptPath = Join-Path $projectRoot "app.js"
$fontPath = Join-Path $projectRoot "assets\fonts\fusion-pixel-10px-proportional-zh_hans.otf.woff2"
$fontLicensePath = Join-Path $projectRoot "assets\fonts\OFL.txt"
$arkFontLicensePath = Join-Path $projectRoot "assets\fonts\LICENSES\ark-pixel\OFL.txt"
$boutiqueFontLicensePath = Join-Path $projectRoot "assets\fonts\LICENSES\boutique-bitmap-9x9\OFL.txt"
$galmuriFontLicensePath = Join-Path $projectRoot "assets\fonts\LICENSES\galmuri\LICENSE.txt"
$sourcePath = Join-Path $PSScriptRoot "ForestryLauncher.cs"
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null

$arguments = @(
    "/nologo",
    "/target:winexe",
    "/optimize+",
    "/platform:anycpu",
    "/out:$outputPath",
    "/reference:System.dll",
    "/reference:System.Windows.Forms.dll",
    "/resource:$indexPath,ForestryLab.index.html",
    "/resource:$stylesPath,ForestryLab.styles.css",
    "/resource:$scriptPath,ForestryLab.app.js",
    "/resource:$fontPath,ForestryLab.font.woff2",
    "/resource:$fontLicensePath,ForestryLab.font.OFL.txt",
    "/resource:$arkFontLicensePath,ForestryLab.font.ark.OFL.txt",
    "/resource:$boutiqueFontLicensePath,ForestryLab.font.boutique.OFL.txt",
    "/resource:$galmuriFontLicensePath,ForestryLab.font.galmuri.LICENSE.txt",
    $sourcePath
)

& $compiler @arguments
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Output "Built $outputPath"
