# Script semplice per standardizzare collezioni
$collezioni = @(
    @{slug='sportswear'; nome='Sportswear'; descrizione='Stile casual e comfort per il tempo libero e lo sport'; collection='galleria-sportswear'},
    @{slug='jeans'; nome='Jeans'; descrizione='Denim di qualita per uno stile sempre alla moda'; collection='galleria-jeans'},
    @{slug='felpe'; nome='Felpe'; descrizione='Comfort e stile per le giornate piu fresche'; collection='galleria-felpe'},
    @{slug='maglie'; nome='Maglie'; descrizione='Versatilita e comfort per ogni momento della giornata'; collection='galleria-maglie'},
    @{slug='camicie'; nome='Camicie'; descrizione='Eleganza classica per ogni occasione'; collection='galleria-camicie'},
    @{slug='pantaloni'; nome='Pantaloni'; descrizione='Stile e comodita per ogni occasione'; collection='galleria-pantaloni'},
    @{slug='giubbotti'; nome='Giubbotti'; descrizione='Protezione e stile per affrontare ogni stagione'; collection='galleria-giubbotti'},
    @{slug='accessori'; nome='Accessori'; descrizione='Dettagli che fanno la differenza nel tuo look'; collection='galleria-accessori'}
)

foreach ($col in $collezioni) {
    Write-Host "Creando $($col.nome)..."
    
    # Copia e modifica il file
    Copy-Item "src/pages/collezioni/abiti-cerimonia.astro" "src/pages/collezioni/$($col.slug).astro"
    
    $content = Get-Content "src/pages/collezioni/$($col.slug).astro" -Raw
    
    # Sostituzioni base
    $content = $content -replace 'Abiti da Cerimonia', $col.nome
    $content = $content -replace 'abiti-cerimonia', $col.slug
    $content = $content -replace 'galleria-abiti-cerimonia', $col.collection
    $content = $content -replace 'galleriaAbiti', "galleria$($col.nome -replace ' ', '')"
    $content = $content -replace 'abitiAttivi', "$($col.slug -replace '-', '')Attivi"
    $content = $content -replace 'Eleganza e raffinatezza per i momenti piu importanti della vita', $col.descrizione
    
    # Rimuovi emoji
    $content = $content -replace "icona: '🤵'", "icona: ''"
    $content = $content -replace 'empty-icon">🤵</span>', 'empty-icon"></span>'
    $content = $content -replace '<span class="hero-icon">\{collezioneInfo\.icona\}</span>', ''
    
    $content | Set-Content -Path "src/pages/collezioni/$($col.slug).astro" -Encoding UTF8
    
    Write-Host "Creato $($col.nome)"
}

Write-Host "Fatto!"