# Script per correzioni finali alle collezioni
$collezioni = @{
    'sportswear' = @{nome='Sportswear'; descrizione='Stile casual e comfort per il tempo libero e lo sport'}
    'jeans' = @{nome='Jeans'; descrizione='Denim di qualita per uno stile sempre alla moda'}
    'felpe' = @{nome='Felpe'; descrizione='Comfort e stile per le giornate piu fresche'}
    'maglie' = @{nome='Maglie'; descrizione='Versatilita e comfort per ogni momento della giornata'}
    'camicie' = @{nome='Camicie'; descrizione='Eleganza classica per ogni occasione'}
    'pantaloni' = @{nome='Pantaloni'; descrizione='Stile e comodita per ogni occasione'}
    'giubbotti' = @{nome='Giubbotti'; descrizione='Protezione e stile per affrontare ogni stagione'}
    'accessori' = @{nome='Accessori'; descrizione='Dettagli che fanno la differenza nel tuo look'}
}

foreach ($slug in $collezioni.Keys) {
    $info = $collezioni[$slug]
    Write-Host "Correggendo $($info.nome)..."
    
    $content = Get-Content "src/pages/collezioni/$slug.astro" -Raw
    
    # Correggi descrizione
    $content = $content -replace 'Eleganza e raffinatezza per i momenti piÃ¹ importanti della vita', $info.descrizione
    $content = $content -replace 'Eleganza e raffinatezza per i momenti più importanti della vita', $info.descrizione
    
    # Correggi SEO
    $content = $content -replace 'Eleganza per Uomo e Donna', $info.descrizione
    $content = $content -replace 'capi eleganti per matrimoni, eventi speciali e cerimonie', 'capi di qualita'
    $content = $content -replace 'QualitÃ  e stile', 'Stile e comfort'
    $content = $content -replace 'Qualità e stile', 'Stile e comfort'
    
    # Correggi empty state
    $content = $content -replace 'abiti da cerimonia', $info.nome.ToLower()
    
    $content | Set-Content -Path "src/pages/collezioni/$slug.astro" -Encoding UTF8
    
    Write-Host "Corretto $($info.nome)"
}

Write-Host "Correzioni completate!"