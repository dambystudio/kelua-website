# Script per standardizzare tutte le collezioni con il colore #ddbb76
# Rimuove emoji e applica il nuovo template standardizzato

# Lista delle collezioni da standardizzare
$collezioni = @(
    @{Nome='sportswear'; Descrizione='Comfort e performance per il tempo libero e lo sport'; Collezione='galleria-sportswear'; DisplayName='Sportswear'},
    @{Nome='felpe'; Descrizione='Comfort urbano e stile casual per ogni stagione'; Collezione='galleria-felpe'; DisplayName='Felpe'},
    @{Nome='maglie'; Descrizione='Versatilità e comfort quotidiano'; Collezione='galleria-maglie'; DisplayName='Maglie'},
    @{Nome='camicie'; Descrizione='Classiche e moderne per ogni occasione'; Collezione='galleria-camicie'; DisplayName='Camicie'},
    @{Nome='pantaloni'; Descrizione='Eleganza e comfort per ogni momento'; Collezione='galleria-pantaloni'; DisplayName='Pantaloni'},
    @{Nome='giubbotti'; Descrizione='Protezione e stile per ogni stagione'; Collezione='galleria_giubbotti'; DisplayName='Giubbotti'},
    @{Nome='accessori'; Descrizione='Dettagli che fanno la differenza'; Collezione='galleria_accessori'; DisplayName='Accessori'},
    @{Nome='jeans'; Descrizione='Denim di qualità per ogni stile'; Collezione='galleria-jeans'; DisplayName='Jeans'}
)

Write-Host "🔧 Iniziando standardizzazione collezioni..." -ForegroundColor Cyan

foreach ($collezione in $collezioni) {
    $filePath = "src/pages/collezioni/$($collezione.Nome).astro"
    
    Write-Host "📝 Standardizzando: $($collezione.DisplayName)..." -ForegroundColor Yellow
    
    # Contenuto del file standardizzato
    $contenutoFile = @"
---
// Pagina $($collezione.DisplayName)
import Layout from '../../layouts/Layout.astro';
import Navbar from '../../components/Navbar.astro';
import Footer from '../../components/Footer.astro';
import OptimizedImage from '../../components/OptimizedImage.astro';
import { getCollection } from 'astro:content';

// Carica i dati della collezione $($collezione.Nome)
const galleria$($collezione.DisplayName) = await getCollection('$($collezione.Collezione)');

// Filtra solo gli elementi attivi
const $($collezione.Nome)Attivi = galleria$($collezione.DisplayName)
  .filter(item => item.data.attivo)
  .sort((a, b) => (a.data.ordine || 0) - (b.data.ordine || 0));

const collezioneInfo = {
  nome: '$($collezione.DisplayName)',
  descrizione: '$($collezione.Descrizione)',
  colore: '#ddbb76',
  totalArticoli: $($collezione.Nome)Attivi.length
};

// SEO data per $($collezione.Nome)
const seoData = {
  title: "$($collezione.DisplayName) Kelua - Qualità e Stile a San Giovanni Rotondo",
  description: `Scopri la collezione di $($collezione.Nome) Kelua: capi di qualità per il tuo stile. Eleganza e comfort a San Giovanni Rotondo.`,
  keywords: [
    "$($collezione.Nome) San Giovanni Rotondo",
    "abbigliamento qualità Kelua",
    "$($collezione.Nome) di stile Puglia",
    "moda $($collezione.Nome) elegante",
    "$($collezione.Nome) uomo donna",
    "qualità comfort stile",
    "abbigliamento moderno",
    "$($collezione.Nome) alla moda",
    "eleganza quotidiana",
    "stile contemporaneo"
  ],
  ogImage: "/uploads/optimized/IMG_2357.webp",
  jsonLD: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://keluamoda.it/collezioni/$($collezione.Nome)/#webpage",
    "name": "$($collezione.DisplayName) Kelua",
    "description": "Collezione completa di $($collezione.Nome) per stile e qualità quotidiana.",
    "url": "https://keluamoda.it/collezioni/$($collezione.Nome)",
    "mainEntity": {
      "@type": "Product",
      "name": "Collezione $($collezione.DisplayName)",
      "category": "Abbigliamento",
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
          "name": "$($collezione.DisplayName)",
          "item": "https://keluamoda.it/collezioni/$($collezione.Nome)"
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
  canonicalURL="https://keluamoda.it/collezioni/$($collezione.Nome)"
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
      {$($collezione.Nome)Attivi.length > 0 ? (
        <div class="galleria-grid">
          {$($collezione.Nome)Attivi.map((item, index) => (
            <div class="gallery-item" style={`animation-delay: `+`{index * 0.1}`+`s`}>
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
            <span class="empty-icon">👗</span>
            <h3 class="empty-title">Collezione in Preparazione</h3>
            <p class="empty-description">
              Stiamo preparando questa fantastica collezione per te.
              Torna presto per scoprire i nostri capi di qualità!
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
            I nostri esperti sono pronti ad aiutarti a scegliere il capo perfetto per il tuo stile.
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

<style>
/* Hero Section */
.collezione-hero {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.9) 0%, 
    rgba(26, 26, 26, 0.8) 50%, 
    rgba(0, 0, 0, 0.9) 100%
  ),
  url('/background.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 120px 0 80px;
  min-height: 50vh;
  display: flex;
  align-items: center;
  position: relative;
}

.collezione-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.breadcrumb {
  margin-bottom: 2rem;
  font-size: 1rem;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #ddbb76;
}

.breadcrumb-separator {
  margin: 0 10px;
  color: rgba(255, 255, 255, 0.5);
}

.breadcrumb-current {
  color: #ddbb76;
  font-weight: 600;
}

.hero-title {
  font-family: 'Glida Display Regular', 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  color: #ddbb76;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 20px rgba(221, 187, 118, 0.5);
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.hero-icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto 1.5rem;
  line-height: 1.6;
}

.hero-stats {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

.stats-highlight {
  color: #ddbb76;
  font-weight: 700;
  font-size: 1.3em;
  text-shadow: 0 0 10px rgba(221, 187, 118, 0.5);
}

/* Main Content */
.collezione-main {
  padding: 80px 0;
  background: #000;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Galleria Grid */
.galleria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.gallery-item:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 215, 0, 0.2);
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.95) 100%
  );
  padding: 40px 25px 25px;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover .image-overlay {
  transform: translateY(0);
}

.item-info {
  text-align: center;
}

.item-nome {
  font-size: 1.3rem;
  font-weight: 600;
  color: #ddbb76;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(221, 187, 118, 0.5);
}

.item-descrizione {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.item-prezzo {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ff6b47;
  background: rgba(255, 107, 71, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  border: 1px solid rgba(255, 107, 71, 0.3);
  margin-bottom: 0.5rem;
}

.item-categoria {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 15px;
  display: inline-block;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
}

.empty-title {
  font-size: 2rem;
  font-weight: 300;
  color: #ddbb76;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(221, 187, 118, 0.3);
}

.empty-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.empty-cta {
  display: inline-block;
  padding: 15px 30px;
  background: linear-gradient(135deg, #ddbb76, #c6ae6a);
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.empty-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 215, 0, 0.5);
}

/* CTA Section */
.collezione-cta-section {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 25px;
  padding: 50px 40px;
  text-align: center;
  backdrop-filter: blur(10px);
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.2rem;
  font-weight: 300;
  color: #ddbb76;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.cta-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background: linear-gradient(135deg, #ddbb76, #c6ae6a);
  color: #1a1a1a;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 215, 0, 0.5);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

/* Animations */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .collezione-hero {
    padding: 100px 0 60px;
    background-attachment: scroll;
  }
  
  .hero-title {
    flex-direction: column;
    gap: 10px;
  }
  
  .collezione-main {
    padding: 60px 0;
  }
  
  .galleria-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 60px;
  }
  
  .collezione-cta-section {
    padding: 40px 25px;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 250px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .galleria-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .gallery-item {
    aspect-ratio: 3/4;
  }
  
  .image-overlay {
    transform: translateY(0);
    background: linear-gradient(
      transparent 0%,
      rgba(0, 0, 0, 0.8) 60%,
      rgba(0, 0, 0, 0.95) 100%
    );
  }
}
</style>

<script>
// Animazioni e interazioni per la pagina collezione
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer per animazioni
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Osserva tutti gli elementi della galleria
  document.querySelectorAll('.gallery-item').forEach((item) => {
    observer.observe(item);
  });
});
</script>
"@

    # Scrivi il file
    Set-Content -Path $filePath -Value $contenutoFile -Encoding UTF8
    
    Write-Host "✅ Completato: $($collezione.DisplayName)" -ForegroundColor Green
}

Write-Host "`n🎉 Standardizzazione completata!" -ForegroundColor Green
Write-Host "Tutte le collezioni ora utilizzano:" -ForegroundColor White
Write-Host "  • Colore: #ddbb76" -ForegroundColor Yellow
Write-Host "  • Titoli senza emoji" -ForegroundColor Yellow
Write-Host "  • Stile uniforme come 'Abiti da Cerimonia'" -ForegroundColor Yellow