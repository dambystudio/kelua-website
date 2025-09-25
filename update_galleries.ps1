# Script per aggiornare tutte le gallerie con filename automatico e campi opzionali

$configPath = "tina\config.ts"
$content = Get-Content $configPath -Raw

# Lista delle gallerie da aggiornare
$galleries = @(
    "galleria_jeans",
    "galleria_maglieria", 
    "galleria_camicie",
    "galleria_pantaloni",
    "galleria_felpe",
    "galleria_giubbotti",
    "galleria_accessori"
)

foreach ($gallery in $galleries) {
    Write-Host "Aggiornando $gallery..."
    
    # Pattern per trovare la configurazione della galleria
    $pattern = "(\s+// Galleria [^{]+\s+{\s+name: `"$gallery`",\s+label: `"[^`"]+`",\s+path: `"[^`"]+`",\s+format: `"md`",)\s+(fields:)"
    
    # Sostituzione con configurazione filename
    $replacement = '$1
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.titolo
                ?.toLowerCase()
                ?.replace(/ /g, "-")
                ?.replace(/[^\w-]+/g, "");
            },
          },
        },
        $2'
    
    $content = $content -replace $pattern, $replacement
    
    # Aggiorna isTitle per il campo titolo
    $titlePattern = "(\s+type: `"string`",\s+name: `"titolo`",\s+label: `"Titolo`",\s+required: true,)\s+(description:)"
    $titleReplacement = '$1
            isTitle: true,
            $2'
    $content = $content -replace $titlePattern, $titleReplacement
    
    # Rendi opzionale il campo descrizione
    $descPattern = "(\s+type: `"string`",\s+name: `"descrizione`",\s+label: `"Descrizione`",)\s+(description: `"[^`"]+`",)"
    $descReplacement = '$1
            label: "Descrizione (opzionale)",
            required: false,
            $2'
    $content = $content -replace $descPattern, $descReplacement
    
    # Rendi opzionale il campo ordine  
    $ordinePattern = "(\s+type: `"number`",\s+name: `"ordine`",\s+label: `"Ordine`",)\s+(description: `"[^`"]+`",)"
    $ordineReplacement = '$1
            label: "Ordine (opzionale)",
            required: false,
            $2'
    $content = $content -replace $ordinePattern, $ordineReplacement
}

# Salva il file aggiornato
Set-Content $configPath $content -Encoding UTF8
Write-Host "Aggiornamento completato!"