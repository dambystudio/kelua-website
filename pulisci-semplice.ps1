# Script semplice per rimuovere emoji corrotte
$collezioni = @('sportswear', 'jeans', 'felpe', 'maglie', 'camicie', 'pantaloni', 'giubbotti', 'accessori')

foreach ($slug in $collezioni) {
    Write-Host "Pulendo $slug..."
    
    $filePath = "src/pages/collezioni/$slug.astro"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Rimuovi pattern generici di emoji corrotte
        $content = $content -replace 'Ã°[^"''<>\s]*', ''
        $content = $content -replace 'ð[^"''<>\s]*', ''
        
        # Pulisci icone vuote
        $content = $content -replace "icona: '[^']*'", "icona: ''"
        $content = $content -replace '<span class="hero-icon">[^<]*</span>', ''
        $content = $content -replace '<span class="empty-icon">[^<]*</span>', '<span class="empty-icon"></span>'
        
        $content | Set-Content -Path $filePath -Encoding UTF8
        Write-Host "Pulito $slug"
    }
}

Write-Host "Fatto!"