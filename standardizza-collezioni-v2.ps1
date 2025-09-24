# Script per standardizzare tutte le pagine delle collezioni
$collezioni = @(
    @{ slug = 'sportswear'; nome = 'Sportswear'; descrizione = 'Stile casual e comfort per il tempo libero e lo sport'; icona = '👟'; collection = 'galleria-sportswear' },
    @{ slug = 'jeans'; nome = 'Jeans'; descrizione = 'Denim di qualità per uno stile sempre alla moda'; icona = '👖'; collection = 'galleria-jeans' },
    @{ slug = 'felpe'; nome = 'Felpe'; descrizione = 'Comfort e stile per le giornate più fresche'; icona = '🧥'; collection = 'galleria-felpe' },
    @{ slug = 'maglie'; nome = 'Maglie'; descrizione = 'Versatilità e comfort per ogni momento della giornata'; icona = '👕'; collection = 'galleria-maglie' },
    @{ slug = 'camicie'; nome = 'Camicie'; descrizione = 'Eleganza classica per ogni occasione'; icona = '👔'; collection = 'galleria-camicie' },
    @{ slug = 'pantaloni'; nome = 'Pantaloni'; descrizione = 'Stile e comodità per ogni occasione'; icona = '👖'; collection = 'galleria-pantaloni' },
    @{ slug = 'giubbotti'; nome = 'Giubbotti'; descrizione = 'Protezione e stile per affrontare ogni stagione'; icona = '🧥'; collection = 'galleria-giubbotti' },
    @{ slug = 'accessori'; nome = 'Accessori'; descrizione = 'Dettagli che fanno la differenza nel tuo look'; icona = '👜'; collection = 'galleria-accessori' }
)

# Template base per tutte le pagine collezioni
$template = @"
---
// Pagina {NOME}
import Layout from '../../layouts/Layout.astro';
import Navbar from '../../components/Navbar.astro';
import Footer from '../../components/Footer.astro';
import OptimizedImage from '../../components/OptimizedImage.astro';
import { getCollection } from 'astro:content';

// Carica i dati della collezione {NOME_LOWER}
const galleria{NOME_CAMEL} = await getCollection('{COLLECTION}');

// Filtra solo gli elementi attivi
const {SLUG_CAMEL}Attivi = galleria{NOME_CAMEL}
  .filter(item => item.data.attivo)
  .sort((a, b) => (a.data.ordine || 0) - (b.data.ordine || 0));

const collezioneInfo = {
  nome: '{NOME}',
  descrizione: '{DESCRIZIONE}',
  icona: '{ICONA}',
  colore: '#ddbb76',
  totalArticoli: {SLUG_CAMEL}Attivi.length
};

// SEO data per {NOME_LOWER}
const seoData = {
  title: "{NOME} Kelua - {DESCRIZIONE} a San Giovanni Rotondo",
  description: `Scopri la collezione {NOME_LOWER} Kelua: ${{SLUG_CAMEL}Attivi.length}+ capi di qualità. Stile e comfort a San Giovanni Rotondo.`,
  keywords: [
    "{NOME_LOWER} San Giovanni Rotondo",
    "abbigliamento {NOME_LOWER}",
    "vestiti {NOME_LOWER}",
    "{NOME} Kelua",
    "{NOME_LOWER} Puglia",
    "abbigliamento qualità San Giovanni Rotondo"
  ],
  ogImage: "/background.png",
  jsonLD: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://keluamoda.it/collezioni/{SLUG}/#webpage",
    "name": "{NOME} Kelua",
    "description": "Collezione completa di {NOME_LOWER} per uomo e donna. {DESCRIZIONE}.",
    "url": "https://keluamoda.it/collezioni/{SLUG}",
    "mainEntity": {
      "@type": "Product",
      "name": "Collezione {NOME}",
      "category": "{NOME}",
      "brand": {
        "@type": "Brand",
        "name": "Kelua"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://keluamoda.it"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Collezioni",
          "item": "https://keluamoda.it/collezioni"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "{NOME}",
          "item": "https://keluamoda.it/collezioni/{SLUG}"
        }
      ]
    }
  }
};
---

<Layout 
  title={seoData.title}
  description={seoData.description}
  keywords={seoData.keywords}
  ogImage={seoData.ogImage}
  canonicalURL="https://keluamoda.it/collezioni/{SLUG}"
  jsonLD={seoData.jsonLD}
>
  <Navbar />
  
  <!-- Hero Section Collezione -->
  <section class="collezione-hero">
    <div class="container">
      <div class="hero-content">
        <div class="breadcrumb">
          <a href="/collezioni" class="breadcrumb-link">Collezioni</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{collezioneInfo.nome}</span>
        </div>
        
        <h1 class="hero-title">
          <span class="hero-icon">{collezioneInfo.icona}</span>
          {collezioneInfo.nome}
        </h1>
        <p class="hero-subtitle">{collezioneInfo.descrizione}</p>
        <div class="hero-stats">
          <span class="stats-highlight">{collezioneInfo.totalArticoli}</span> articoli disponibili
        </div>
      </div>
    </div>
  </section>

  <!-- Galleria Collezione -->
  <main class="collezione-main">
    <div class="container">
      {{SLUG_CAMEL}Attivi.length > 0 ? (
        <div class="galleria-grid">
          {{SLUG_CAMEL}Attivi.map((item, index) => (
            <div class="gallery-item" style={`animation-delay: ${{index * 0.1}}s`}>
              <div class="image-container">
                <OptimizedImage
                  src={item.data.immagine}
                  alt={item.data.nome || item.data.titolo}
                  class="gallery-image"
                  width={400}
                  height={500}
                  loading="lazy"
                />
                <div class="image-overlay">
                  <div class="item-info">
                    <h3 class="item-nome">{item.data.nome || item.data.titolo}</h3>
                    {item.data.descrizione && (
                      <p class="item-descrizione">{item.data.descrizione}</p>
                    )}
                    {item.data.prezzo && (
                      <div class="item-prezzo">{item.data.prezzo}</div>
                    )}
                    {item.data.categoria && (
                      <span class="item-categoria">{item.data.categoria}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div class="empty-state">
          <div class="empty-content">
            <span class="empty-icon">{ICONA}</span>
            <h3 class="empty-title">Collezione in Preparazione</h3>
            <p class="empty-description">
              Stiamo preparando questa magnifica collezione per te. 
              Torna presto per scoprire i nostri {NOME_LOWER}!
            </p>
            <a href="/collezioni" class="empty-cta">Esplora Altre Collezioni</a>
          </div>
        </div>
      )}

      <!-- Call to Action -->
      <div class="collezione-cta-section">
        <div class="cta-content">
          <h3 class="cta-title">Hai bisogno di consulenza?</h3>
          <p class="cta-description">
            I nostri esperti sono pronti ad aiutarti a scegliere il capo perfetto per te.
          </p>
          <div class="cta-actions">
            <a href="/#contatti" class="cta-btn primary">Contattaci</a>
            <a href="tel:0882302070" class="cta-btn secondary">Chiama Ora</a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</Layout>
"@

# Aggiunge gli stili CSS uguali per tutti
$styles = Get-Content "src/pages/collezioni/abiti-cerimonia.astro" -Raw
$cssStart = $styles.IndexOf('<style>')
$cssEnd = $styles.IndexOf('</style>') + 8
$css = $styles.Substring($cssStart, $cssEnd - $cssStart)

$script = $styles.Substring($styles.IndexOf('<script>'))

foreach ($col in $collezioni) {
    Write-Host "Creando $($col.nome)..." -ForegroundColor Green
    
    $content = $template
    $content = $content -replace '{NOME}', $col.nome
    $content = $content -replace '{NOME_LOWER}', $col.nome.ToLower()
    $content = $content -replace '{NOME_CAMEL}', ($col.nome -replace '\s', '')
    $content = $content -replace '{SLUG}', $col.slug
    $content = $content -replace '{SLUG_CAMEL}', ($col.slug -replace '-', '')
    $content = $content -replace '{DESCRIZIONE}', $col.descrizione
    $content = $content -replace '{ICONA}', $col.icona
    $content = $content -replace '{COLLECTION}', $col.collection
    
    $fullContent = $content + "`n`n" + $css + "`n`n" + $script
    
    $outputPath = "src/pages/collezioni/$($col.slug).astro"
    $fullContent | Set-Content -Path $outputPath -Encoding UTF8
    
    Write-Host "✓ $($col.nome) creato" -ForegroundColor Blue
}

Write-Host "`n🎉 Tutte le collezioni standardizzate!" -ForegroundColor Green