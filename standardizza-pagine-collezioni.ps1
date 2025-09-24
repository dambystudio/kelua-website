# Script per standardizzare tutte le pagine delle collezioni usando il modello di "Abiti da Cerimonia"

$collezioni = @{
    'sportswear' = @{
        nome = 'Sportswear'
        descrizione = 'Stile casual e comfort per il tempo libero e lo sport'
        icona = '👟'
        collection = 'galleria-sportswear'
        categoria = 'Abbigliamento Sportivo'
        empty_icon = '👕'
        empty_description = 'Stiamo preparando questa fantastica collezione sportswear per te. Torna presto per scoprire i nostri capi casual e sportivi!'
        cta_title = 'Trova il tuo stile perfetto'
        cta_description = 'Scopri la nostra selezione di abbigliamento sportivo e casual, perfetto per ogni momento della tua giornata.'
    }
    'jeans' = @{
        nome = 'Jeans'
        descrizione = 'Denim di qualità per uno stile sempre alla moda'
        icona = '👖'
        collection = 'galleria-jeans'
        categoria = 'Denim'
        empty_icon = '👖'
        empty_description = 'Stiamo preparando questa collezione di jeans per te. Torna presto per scoprire i nostri denim di qualità!'
        cta_title = 'Il denim perfetto per te'
        cta_description = 'Trova il jeans ideale nella nostra selezione di denim di alta qualità, perfetti per ogni occasione.'
    }
    'felpe' = @{
        nome = 'Felpe'
        descrizione = 'Comfort e stile per le giornate più fresche'
        icona = '🧥'
        collection = 'galleria-felpe'
        categoria = 'Felpe'
        empty_icon = '🧥'
        empty_description = 'Stiamo preparando questa collezione di felpe per te. Torna presto per scoprire i nostri capi comodi e stilosi!'
        cta_title = 'Comfort senza compromessi'
        cta_description = 'Scopri la nostra collezione di felpe, dove comfort e stile si incontrano per crearti il look perfetto.'
    }
    'maglie' = @{
        nome = 'Maglie'
        descrizione = 'Versatilità e comfort per ogni momento della giornata'
        icona = '👕'
        collection = 'galleria-maglie'
        categoria = 'Maglie'
        empty_icon = '👕'
        empty_description = 'Stiamo preparando questa collezione di maglie per te. Torna presto per scoprire i nostri capi versatili!'
        cta_title = 'Versatilità quotidiana'
        cta_description = 'Esplora la nostra selezione di maglie, perfette per ogni occasione e per creare look sempre diversi.'
    }
    'camicie' = @{
        nome = 'Camicie'
        descrizione = 'Eleganza classica per ogni occasione'
        icona = '👔'
        collection = 'galleria-camicie'
        categoria = 'Camicie'
        empty_icon = '👔'
        empty_description = 'Stiamo preparando questa collezione di camicie per te. Torna presto per scoprire i nostri capi eleganti!'
        cta_title = 'Eleganza senza tempo'
        cta_description = 'Scopri la nostra collezione di camicie, dove tradizione e modernità si fondono in capi di qualità superiore.'
    }
    'pantaloni' = @{
        nome = 'Pantaloni'
        descrizione = 'Stile e comodità per ogni occasione'
        icona = '👖'
        collection = 'galleria-pantaloni'
        categoria = 'Pantaloni'
        empty_icon = '👖'
        empty_description = 'Stiamo preparando questa collezione di pantaloni per te. Torna presto per scoprire i nostri capi di qualità!'
        cta_title = 'Il pantalone giusto per te'
        cta_description = 'Trova il pantalone perfetto nella nostra collezione, dove stile e comfort si uniscono per ogni occasione.'
    }
    'giubbotti' = @{
        nome = 'Giubbotti'
        descrizione = 'Protezione e stile per affrontare ogni stagione'
        icona = '🧥'
        collection = 'galleria-giubbotti'
        categoria = 'Giubbotti'
        empty_icon = '🧥'
        empty_description = 'Stiamo preparando questa collezione di giubbotti per te. Torna presto per scoprire i nostri capispalla di qualità!'
        cta_title = 'Stile per ogni stagione'
        cta_description = 'Esplora la nostra collezione di giubbotti, perfetti per proteggerti con stile in ogni stagione.'
    }
    'accessori' = @{
        nome = 'Accessori'
        descrizione = 'Dettagli che fanno la differenza nel tuo look'
        icona = '👜'
        collection = 'galleria-accessori'
        categoria = 'Accessori'
        empty_icon = '👜'
        empty_description = 'Stiamo preparando questa collezione di accessori per te. Torna presto per scoprire i dettagli che completano il tuo stile!'
        cta_title = 'I dettagli che contano'
        cta_description = 'Completa il tuo look con i nostri accessori selezionati, dove ogni dettaglio fa la differenza.'
    }
}

# Leggi il template da abiti-cerimonia.astro
$templatePath = "src/pages/collezioni/abiti-cerimonia.astro"
$template = Get-Content $templatePath -Raw

foreach ($collezione in $collezioni.GetEnumerator()) {
    $slug = $collezione.Key
    $info = $collezione.Value
    
    Write-Host "Standardizzando $($info.nome)..." -ForegroundColor Green
    
    # Crea il contenuto per questa collezione
    $content = $template
    
    # Sostituzioni per l'header del file
    $content = $content -replace '// Pagina Abiti da Cerimonia', "// Pagina $($info.nome)"
    $content = $content -replace "galleria-abiti-cerimonia", $info.collection
    $content = $content -replace "galleriaAbiti", "galleria$($info.nome.Replace(' ', '').Replace('è', 'e'))"
    $content = $content -replace "abitiAttivi", "$($slug.Replace('-', ''))Attivi"
    
    # Sostituzioni per collezioneInfo
    $content = $content -replace "nome: 'Abiti da Cerimonia'", "nome: '$($info.nome)'"
    $content = $content -replace "descrizione: 'Eleganza e raffinatezza per i momenti più importanti della vita'", "descrizione: '$($info.descrizione)'"
    $content = $content -replace "icona: '🤵'", "icona: '$($info.icona)'"
    
    # Sostituzioni per SEO
    $content = $content -replace "Abiti da Cerimonia Kelua - Eleganza per Uomo e Donna a San Giovanni Rotondo", "$($info.nome) Kelua - $($info.descrizione) a San Giovanni Rotondo"
    $content = $content -replace "Scopri la collezione di abiti da cerimonia Kelua: \$\{abitiAttivi\.length\}\+ capi eleganti per matrimoni, eventi speciali e cerimonie\. Qualità e stile a San Giovanni Rotondo\.", "Scopri la collezione $($info.nome.ToLower()) Kelua: \$\{$($slug.Replace('-', ''))Attivi\.length\}\+ capi di qualità\. Stile e comfort a San Giovanni Rotondo\."
    
    # Sostituzioni per keywords (esempio semplificato)
    $keywords = @(
        "$($info.nome.ToLower()) San Giovanni Rotondo",
        "abbigliamento $($info.categoria.ToLower())",
        "vestiti $($info.nome.ToLower())",
        "$($info.categoria) Kelua",
        "$($info.nome.ToLower()) Puglia",
        "abbigliamento qualità San Giovanni Rotondo"
    )
    $keywordString = ($keywords | ForEach-Object { "`"$_`"" }) -join ",`n    "
    
    # Sostituzioni per JSON-LD
    $content = $content -replace "/collezioni/abiti-cerimonia", "/collezioni/$slug"
    $content = $content -replace "Abiti da Cerimonia Kelua", "$($info.nome) Kelua"
    $content = $content -replace "Collezione completa di abiti da cerimonia eleganti per uomo e donna\. Qualità e stile per i tuoi momenti speciali\.", "Collezione completa di $($info.nome.ToLower()) per uomo e donna\. $($info.descrizione)\."
    $content = $content -replace "Collezione Abiti da Cerimonia", "Collezione $($info.nome)"
    $content = $content -replace "Abbigliamento Formale", $info.categoria
    $content = $content -replace "`"Abiti da Cerimonia`"", "`"$($info.nome)`""
    
    # Sostituzioni per empty state
    $content = $content -replace "empty-icon`">👔</span>", "empty-icon`">$($info.empty_icon)</span>"
    $content = $content -replace "Stiamo preparando questa magnifica collezione per te\. \s*Torna presto per scoprire i nostri abiti da cerimonia!", $info.empty_description
    
    # Sostituzioni per CTA
    $content = $content -replace "Hai bisogno di consulenza\?", $info.cta_title
    $content = $content -replace "I nostri esperti sono pronti ad aiutarti a scegliere l'abito perfetto per la tua occasione speciale\.", $info.cta_description
    
    # Salva il file
    $outputPath = "src/pages/collezioni/$slug.astro"
    $content | Set-Content -Path $outputPath -Encoding UTF8
    
    Write-Host "✓ $($info.nome) standardizzato in $outputPath" -ForegroundColor Blue
}

Write-Host "`n🎉 Tutte le collezioni sono state standardizzate!" -ForegroundColor Green