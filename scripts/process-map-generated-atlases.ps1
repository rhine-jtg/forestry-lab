param(
  [Parameter(Mandatory = $true)]
  [string]$WorkspaceRoot
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

if (-not ([System.Management.Automation.PSTypeName]"ForestryAtlasKeyer").Type) {
  $drawingAssemblies = [AppDomain]::CurrentDomain.GetAssemblies() |
    Where-Object { $_.Location } |
    Select-Object -ExpandProperty Location -Unique
  Add-Type -ReferencedAssemblies $drawingAssemblies -TypeDefinition @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class ForestryAtlasKeyer
{
    public static Bitmap RemoveConnectedBackground(Bitmap source, string mode)
    {
        bool removeAllCandidates = String.Equals(mode, "magenta", StringComparison.OrdinalIgnoreCase);
        var output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb);
        using (var graphics = Graphics.FromImage(output))
        {
            graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
            graphics.DrawImageUnscaled(source, 0, 0);
        }

        var rect = new Rectangle(0, 0, output.Width, output.Height);
        var data = output.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        try
        {
            int stride = Math.Abs(data.Stride);
            byte[] pixels = new byte[stride * output.Height];
            Marshal.Copy(data.Scan0, pixels, 0, pixels.Length);
            bool[] candidate = new bool[output.Width * output.Height];
            bool[] connected = new bool[candidate.Length];
            var queue = new Queue<int>();

            for (int y = 0; y < output.Height; y++)
            {
                for (int x = 0; x < output.Width; x++)
                {
                    int byteIndex = y * stride + x * 4;
                    byte b = pixels[byteIndex];
                    byte g = pixels[byteIndex + 1];
                    byte r = pixels[byteIndex + 2];
                    bool isBackground;
                    if (String.Equals(mode, "magenta", StringComparison.OrdinalIgnoreCase))
                    {
                        // Include chroma-key antialiasing fringes, not only exact #ff00ff pixels.
                        isBackground = r >= 130 && b >= 130 && g <= 110 &&
                            r - g >= 50 && b - g >= 50 && Math.Abs(r - b) <= 85;
                    }
                    else
                    {
                        int max = Math.Max(r, Math.Max(g, b));
                        int min = Math.Min(r, Math.Min(g, b));
                        isBackground = min >= 232 && max - min <= 5;
                    }
                    candidate[y * output.Width + x] = isBackground;
                }
            }

            Action<int, int> enqueue = (x, y) =>
            {
                int index = y * output.Width + x;
                if (!connected[index] && candidate[index])
                {
                    connected[index] = true;
                    queue.Enqueue(index);
                }
            };

            for (int x = 0; x < output.Width; x++)
            {
                enqueue(x, 0);
                enqueue(x, output.Height - 1);
            }
            for (int y = 0; y < output.Height; y++)
            {
                enqueue(0, y);
                enqueue(output.Width - 1, y);
            }

            while (queue.Count > 0)
            {
                int index = queue.Dequeue();
                int x = index % output.Width;
                int y = index / output.Width;
                if (x > 0) enqueue(x - 1, y);
                if (x + 1 < output.Width) enqueue(x + 1, y);
                if (y > 0) enqueue(x, y - 1);
                if (y + 1 < output.Height) enqueue(x, y + 1);
            }

            for (int y = 0; y < output.Height; y++)
            {
                for (int x = 0; x < output.Width; x++)
                {
                    int pixelIndex = y * output.Width + x;
                    if (!connected[pixelIndex] && !(removeAllCandidates && candidate[pixelIndex])) continue;
                    int byteIndex = y * stride + x * 4;
                    pixels[byteIndex] = 0;
                    pixels[byteIndex + 1] = 0;
                    pixels[byteIndex + 2] = 0;
                    pixels[byteIndex + 3] = 0;
                }
            }

            Marshal.Copy(pixels, 0, data.Scan0, pixels.Length);
        }
        finally
        {
            output.UnlockBits(data);
        }
        return output;
    }

    public static Bitmap RemoveSmallBorderComponents(Bitmap source)
    {
        var output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb);
        using (var graphics = Graphics.FromImage(output))
        {
            graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceCopy;
            graphics.DrawImageUnscaled(source, 0, 0);
        }

        var rect = new Rectangle(0, 0, output.Width, output.Height);
        var data = output.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        try
        {
            int stride = Math.Abs(data.Stride);
            byte[] pixels = new byte[stride * output.Height];
            Marshal.Copy(data.Scan0, pixels, 0, pixels.Length);
            int[] labels = new int[output.Width * output.Height];
            var areas = new List<int> { 0 };
            var touchesSide = new List<bool> { false };
            var queue = new Queue<int>();
            int component = 0;
            int[] dx = new int[] { -1, 1, 0, 0 };
            int[] dy = new int[] { 0, 0, -1, 1 };

            for (int y = 0; y < output.Height; y++)
            {
                for (int x = 0; x < output.Width; x++)
                {
                    int index = y * output.Width + x;
                    if (labels[index] != 0 || pixels[y * stride + x * 4 + 3] <= 8) continue;
                    component++;
                    labels[index] = component;
                    queue.Enqueue(index);
                    int area = 0;
                    bool side = false;
                    while (queue.Count > 0)
                    {
                        int current = queue.Dequeue();
                        int currentX = current % output.Width;
                        int currentY = current / output.Width;
                        area++;
                        if (currentX <= 1 || currentX >= output.Width - 2) side = true;
                        for (int direction = 0; direction < 4; direction++)
                        {
                            int nextX = currentX + dx[direction];
                            int nextY = currentY + dy[direction];
                            if (nextX < 0 || nextX >= output.Width || nextY < 0 || nextY >= output.Height) continue;
                            int next = nextY * output.Width + nextX;
                            if (labels[next] != 0 || pixels[nextY * stride + nextX * 4 + 3] <= 8) continue;
                            labels[next] = component;
                            queue.Enqueue(next);
                        }
                    }
                    areas.Add(area);
                    touchesSide.Add(side);
                }
            }

            int largestArea = 0;
            for (int i = 1; i < areas.Count; i++) largestArea = Math.Max(largestArea, areas[i]);
            for (int y = 0; y < output.Height; y++)
            {
                for (int x = 0; x < output.Width; x++)
                {
                    int pixelIndex = y * output.Width + x;
                    int label = labels[pixelIndex];
                    if (label == 0 || !touchesSide[label] || areas[label] >= largestArea * 0.55) continue;
                    int byteIndex = y * stride + x * 4;
                    pixels[byteIndex] = 0;
                    pixels[byteIndex + 1] = 0;
                    pixels[byteIndex + 2] = 0;
                    pixels[byteIndex + 3] = 0;
                }
            }
            Marshal.Copy(pixels, 0, data.Scan0, pixels.Length);
        }
        finally
        {
            output.UnlockBits(data);
        }
        return output;
    }

    public static int[] FindVerticalSeams(Bitmap source, int stages)
    {
        int[] counts = new int[source.Width];
        for (int x = 0; x < source.Width; x++)
        {
            int count = 0;
            for (int y = 0; y < source.Height; y++)
            {
                if (source.GetPixel(x, y).A > 8) count++;
            }
            counts[x] = count;
        }

        int[] seams = new int[stages + 1];
        seams[0] = 0;
        seams[stages] = source.Width;
        double cellWidth = source.Width / (double)stages;
        for (int stage = 1; stage < stages; stage++)
        {
            int expected = (int)Math.Round(stage * cellWidth);
            int radius = (int)Math.Round(cellWidth * 0.42);
            int start = Math.Max(seams[stage - 1] + 8, expected - radius);
            int end = Math.Min(source.Width - 8, expected + radius);
            int best = expected;
            int bestCount = Int32.MaxValue;
            int bestDistance = Int32.MaxValue;
            for (int x = start; x <= end; x++)
            {
                int distance = Math.Abs(x - expected);
                if (counts[x] < bestCount || (counts[x] == bestCount && distance < bestDistance))
                {
                    best = x;
                    bestCount = counts[x];
                    bestDistance = distance;
                }
            }
            seams[stage] = best;
        }
        return seams;
    }

    public static Bitmap TrimTransparent(Bitmap source, int padding)
    {
        int minX = source.Width;
        int minY = source.Height;
        int maxX = -1;
        int maxY = -1;
        for (int y = 0; y < source.Height; y++)
        {
            for (int x = 0; x < source.Width; x++)
            {
                if (source.GetPixel(x, y).A <= 8) continue;
                minX = Math.Min(minX, x);
                minY = Math.Min(minY, y);
                maxX = Math.Max(maxX, x);
                maxY = Math.Max(maxY, y);
            }
        }
        if (maxX < minX || maxY < minY) return new Bitmap(1, 1, PixelFormat.Format32bppArgb);
        minX = Math.Max(0, minX - padding);
        minY = Math.Max(0, minY - padding);
        maxX = Math.Min(source.Width - 1, maxX + padding);
        maxY = Math.Min(source.Height - 1, maxY + padding);
        return source.Clone(new Rectangle(minX, minY, maxX - minX + 1, maxY - minY + 1), PixelFormat.Format32bppArgb);
    }
}
"@
}

function Resolve-WorkspacePath {
  param([string]$RelativePath)
  return [System.IO.Path]::GetFullPath((Join-Path $WorkspaceRoot $RelativePath))
}

function Save-TransparentAtlas {
  param(
    [string]$InputPath,
    [string]$OutputPath,
    [ValidateSet("checker", "magenta")]
    [string]$Mode
  )

  $input = [System.Drawing.Bitmap]::new($InputPath)
  try {
    $transparent = [ForestryAtlasKeyer]::RemoveConnectedBackground($input, $Mode)
    try {
      $directory = Split-Path -Parent $OutputPath
      New-Item -ItemType Directory -Path $directory -Force | Out-Null
      $transparent.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
      $transparent.Dispose()
    }
  }
  finally {
    $input.Dispose()
  }
}

function Split-TransparentAtlas {
  param(
    [string]$AtlasPath,
    [int]$Columns,
    [int]$Rows,
    [string]$OutputDirectory,
    [string[]]$Names,
    [switch]$CleanBorderFragments
  )

  $atlas = [System.Drawing.Bitmap]::new($AtlasPath)
  try {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    $index = 0
    for ($row = 0; $row -lt $Rows; $row += 1) {
      $top = [Math]::Round($row * $atlas.Height / $Rows)
      $bottom = [Math]::Round(($row + 1) * $atlas.Height / $Rows)
      for ($column = 0; $column -lt $Columns; $column += 1) {
        $left = [Math]::Round($column * $atlas.Width / $Columns)
        $right = [Math]::Round(($column + 1) * $atlas.Width / $Columns)
        $rect = [System.Drawing.Rectangle]::new($left, $top, $right - $left, $bottom - $top)
        $cell = $atlas.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        try {
          if ($CleanBorderFragments) {
            $cleaned = [ForestryAtlasKeyer]::RemoveSmallBorderComponents($cell)
            try {
              $cleaned.Save((Join-Path $OutputDirectory ($Names[$index] + ".png")), [System.Drawing.Imaging.ImageFormat]::Png)
            }
            finally {
              $cleaned.Dispose()
            }
          }
          else {
            $cell.Save((Join-Path $OutputDirectory ($Names[$index] + ".png")), [System.Drawing.Imaging.ImageFormat]::Png)
          }
        }
        finally {
          $cell.Dispose()
        }
        $index += 1
      }
    }
  }
  finally {
    $atlas.Dispose()
  }
}

function Split-ProgressionAtlas {
  param(
    [string]$AtlasPath,
    [string]$OutputDirectory,
    [string[]]$Names
  )

  $atlas = [System.Drawing.Bitmap]::new($AtlasPath)
  try {
    New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
    $seams = [ForestryAtlasKeyer]::FindVerticalSeams($atlas, $Names.Count)
    for ($index = 0; $index -lt $Names.Count; $index += 1) {
      $left = $seams[$index]
      $right = $seams[$index + 1]
      $rect = [System.Drawing.Rectangle]::new($left, 0, $right - $left, $atlas.Height)
      $cell = $atlas.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      try {
        $cleaned = [ForestryAtlasKeyer]::RemoveSmallBorderComponents($cell)
        try {
          $trimmed = [ForestryAtlasKeyer]::TrimTransparent($cleaned, 4)
          try {
            $trimmed.Save((Join-Path $OutputDirectory ($Names[$index] + ".png")), [System.Drawing.Imaging.ImageFormat]::Png)
          }
          finally {
            $trimmed.Dispose()
          }
        }
        finally {
          $cleaned.Dispose()
        }
      }
      finally {
        $cell.Dispose()
      }
    }
  }
  finally {
    $atlas.Dispose()
  }
}

$propsInput = Resolve-WorkspacePath "assets/map/test-batch/props/source/valley-props-atlas-raw-v1.png"
$propsAtlas = Resolve-WorkspacePath "assets/map/test-batch/props/valley-props-atlas-v1.png"
Save-TransparentAtlas $propsInput $propsAtlas "checker"
Split-TransparentAtlas $propsAtlas 4 4 (Resolve-WorkspacePath "assets/map/test-batch/props/individual") @(
  "logs", "cargo-crates", "tied-barrels", "signpost",
  "apiary-boxes", "flower-cart", "bench", "street-lantern",
  "seedling-tray", "honey-basket", "notice-board", "sapling-handcart",
  "stone-well", "supply-tent", "copper-pump", "botanical-picnic-table"
)

$villagerInput = Resolve-WorkspacePath "assets/map/test-batch/characters/villager/source/villager-turnarounds-raw-v1.png"
$villagerAtlas = Resolve-WorkspacePath "assets/map/test-batch/characters/villager/villager-turnarounds-v1.png"
Save-TransparentAtlas $villagerInput $villagerAtlas "checker"
Split-TransparentAtlas $villagerAtlas 3 3 (Resolve-WorkspacePath "assets/map/test-batch/characters/villager/turnarounds") @(
  "beekeeper-front", "beekeeper-right", "beekeeper-back",
  "botanist-front", "botanist-right", "botanist-back",
  "merchant-front", "merchant-right", "merchant-back"
)

$buildingTypes = @("arbor", "archive", "market", "processing", "station", "warehouse")
foreach ($type in $buildingTypes) {
  $buildingRoot = Resolve-WorkspacePath ("assets/map/test-batch/buildings/" + $type)
  $input = Join-Path $buildingRoot ($type + "-state-strip-summer-generated-v1-chroma.png")
  $atlas = Join-Path $buildingRoot ($type + "-state-strip-summer-generated-v1.png")
  $stageNames = @(
    "${type}-site-summer-generated-v1"
    "${type}-lv1-summer-generated-v1"
    "${type}-lv2-summer-generated-v1"
    "${type}-lv3-summer-generated-v1"
  )
  Save-TransparentAtlas $input $atlas "magenta"
  Split-ProgressionAtlas $atlas $buildingRoot $stageNames
}

Write-Output "Processed static props, villager turnarounds, and six building progression atlases."
