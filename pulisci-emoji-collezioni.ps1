# Script per rimuovere emoji corrotte da tutte le collezioni
$collezioni = @('sportswear', 'jeans', 'felpe', 'maglie', 'camicie', 'pantaloni', 'giubbotti', 'accessori')

foreach ($slug in $collezioni) {
    Write-Host "Pulendo $slug..." -ForegroundColor Green
    
    $filePath = "src/pages/collezioni/$slug.astro"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Rimuovi tutti i caratteri emoji corrotti
        $content = $content -replace 'ðŸ[^"]*"', '""'
        $content = $content -replace 'ðŸ[^'']*''', "''"
        $content = $content -replace 'ðŸ[^\s]*', ''
        
        # Rimuovi pattern specifici trovati
        $content = $content -replace 'ðŸ'"', ''
        $content = $content -replace 'ðŸ'Ÿ', ''
        $content = $content -replace 'ðŸ'–', ''
        $content = $content -replace 'ðŸ'•', ''
        $content = $content -replace 'ðŸ'"', ''
        $content = $content -replace 'ðŸ'œ', ''
        $content = $content -replace 'ðŸ§¥', ''
        
        # Pulisci icona vuota nel collezioneInfo
        $content = $content -replace "icona: '',", "icona: '',"
        $content = $content -replace "icona: '[^']*',", "icona: '',"
        
        # Rimuovi span hero-icon se vuoto
        $content = $content -replace '<span class="hero-icon">\{collezioneInfo\.icona\}</span>', ''
        $content = $content -replace '<span class="hero-icon"></span>', ''
        
        # Rimuovi span empty-icon se vuoto  
        $content = $content -replace '<span class="empty-icon">\{[^}]*\}</span>', '<span class="empty-icon"></span>'
        $content = $content -replace 'empty-icon">[^<]*</span>', 'empty-icon"></span>'
        
        $content | Set-Content -Path $filePath -Encoding UTF8
        
        Write-Host "✓ Pulito $slug" -ForegroundColor Blue
    } else {
        Write-Host "✗ File non trovato: $filePath" -ForegroundColor Red
    }
}

Write-Host "Pulizia emoji completata!" -ForegroundColor Green