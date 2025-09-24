# Script per standardizzare tutte le pagine delle collezioni senza emoji
$collezioni = @(
    @{ slug = 'sportswear'; nome = 'Sportswear'; descrizione = 'Stile casual e comfort per il tempo libero e lo sport'; collection = 'galleria-sportswear'; categoria = 'Abbigliamento Sportivo' },
    @{ slug = 'jeans'; nome = 'Jeans'; descrizione = 'Denim di qualita per uno stile sempre alla moda'; collection = 'galleria-jeans'; categoria = 'Denim' },
    @{ slug = 'felpe'; nome = 'Felpe'; descrizione = 'Comfort e stile per le giornate piu fresche'; collection = 'galleria-felpe'; categoria = 'Felpe' },
    @{ slug = 'maglie'; nome = 'Maglie'; descrizione = 'Versatilita e comfort per ogni momento della giornata'; collection = 'galleria-maglie'; categoria = 'Maglie' },
    @{ slug = 'camicie'; nome = 'Camicie'; descrizione = 'Eleganza classica per ogni occasione'; collection = 'galleria-camicie'; categoria = 'Camicie' },
    @{ slug = 'pantaloni'; nome = 'Pantaloni'; descrizione = 'Stile e comodita per ogni occasione'; collection = 'galleria-pantaloni'; categoria = 'Pantaloni' },
    @{ slug = 'giubbotti'; nome = 'Giubbotti'; descrizione = 'Protezione e stile per affrontare ogni stagione'; collection = 'galleria-giubbotti'; categoria = 'Giubbotti' },
    @{ slug = 'accessori'; nome = 'Accessori'; descrizione = 'Dettagli che fanno la differenza nel tuo look'; collection = 'galleria-accessori'; categoria = 'Accessori' }
)

foreach ($col in $collezioni) {
    Write-Host "Standardizzando $($col.nome)..." -ForegroundColor Green
    
    # Copia il file template
    Copy-Item "src/pages/collezioni/abiti-cerimonia.astro" "src/pages/collezioni/$($col.slug)-temp.astro"
    
    # Leggi il contenuto
    $content = Get-Content "src/pages/collezioni/$($col.slug)-temp.astro" -Raw
    
    # Sostituzioni per l'header
    $content = $content -replace '// Pagina Abiti da Cerimonia', "// Pagina $($col.nome)"
    $content = $content -replace 'galleria-abiti-cerimonia', $col.collection
    $content = $content -replace 'galleriaAbiti', "galleria$($col.nome -replace '\s', '')"
    $content = $content -replace 'abitiAttivi', "$($col.slug -replace '-', '')Attivi"
    
    # Sostituzioni per collezioneInfo
    $content = $content -replace "nome: 'Abiti da Cerimonia'", "nome: '$($col.nome)'"
    $content = $content -replace "descrizione: 'Eleganza e raffinatezza per i momenti più importanti della vita'", "descrizione: '$($col.descrizione)'"
    $content = $content -replace "icona: '🤵'", "icona: ''"
    
    # Sostituzioni per SEO title
    $content = $content -replace "Abiti da Cerimonia Kelua - Eleganza per Uomo e Donna a San Giovanni Rotondo", "$($col.nome) Kelua - $($col.descrizione) a San Giovanni Rotondo"
    
    # Sostituzioni per SEO description
    $content = $content -replace "Scopri la collezione di abiti da cerimonia Kelua: \$\{abitiAttivi\.length\}\+ capi eleganti per matrimoni, eventi speciali e cerimonie\. Qualità e stile a San Giovanni Rotondo\.", "Scopri la collezione $($col.nome.ToLower()) Kelua: \$\{$($col.slug -replace '-', '')Attivi\.length\}\+ capi di qualita\. Stile e comfort a San Giovanni Rotondo\."
    
    # Sostituzioni per keywords
    $content = $content -replace '"abiti da cerimonia San Giovanni Rotondo"', "`"$($col.nome.ToLower()) San Giovanni Rotondo`""
    $content = $content -replace '"vestiti eleganti matrimonio"', "`"abbigliamento $($col.nome.ToLower())`""
    $content = $content -replace '"abiti cerimonia uomo donna"', "`"vestiti $($col.nome.ToLower())`""
    $content = $content -replace '"vestiti formali Kelua"', "`"$($col.nome) Kelua`""
    $content = $content -replace '"abiti eleganti Puglia"', "`"$($col.nome.ToLower()) Puglia`""
    $content = $content -replace '"cerimonie matrimoni San Giovanni Rotondo"', "`"abbigliamento qualita San Giovanni Rotondo`""
    
    # Sostituzioni per JSON-LD
    $content = $content -replace '/collezioni/abiti-cerimonia', "/collezioni/$($col.slug)"
    $content = $content -replace 'Abiti da Cerimonia Kelua', "$($col.nome) Kelua"
    $content = $content -replace 'Collezione completa di abiti da cerimonia eleganti per uomo e donna\. Qualità e stile per i tuoi momenti speciali\.', "Collezione completa di $($col.nome.ToLower()) per uomo e donna\. $($col.descrizione)\."
    $content = $content -replace 'Collezione Abiti da Cerimonia', "Collezione $($col.nome)"
    $content = $content -replace 'Abbigliamento Formale', $col.categoria
    $content = $content -replace '"Abiti da Cerimonia"', "`"$($col.nome)`""
    
    # Sostituzioni per empty state
    $content = $content -replace 'empty-icon">🤵</span>', 'empty-icon"></span>'
    $content = $content -replace 'Stiamo preparando questa magnifica collezione per te\.\s*Torna presto per scoprire i nostri abiti da cerimonia!', "Stiamo preparando questa magnifica collezione per te. Torna presto per scoprire i nostri $($col.nome.ToLower())!"
    
    # Sostituzioni per hero icon (rimuovi l'icona dal titolo)
    $content = $content -replace '<span class="hero-icon">\{collezioneInfo\.icona\}</span>', ''
    
    # Salva il file finale
    $content | Set-Content -Path "src/pages/collezioni/$($col.slug).astro" -Encoding UTF8
    
    # Rimuovi il file temporaneo
    Remove-Item "src/pages/collezioni/$($col.slug)-temp.astro" -Force
    
    Write-Host "✓ $($col.nome) standardizzato" -ForegroundColor Blue
}

Write-Host "Tutte le collezioni sono state standardizzate!" -ForegroundColor Green