# 🚀 Guida Integrazione TinaCMS + Ottimizzazione Automatica

## Step 1: Installazione Dipendenze

```bash
npm install sharp uuid @types/uuid
```

## Step 2: Configurazione Media Store

1. **Copia il file `lib/OptimizedMediaStore.ts`** nel tuo progetto
2. **Modifica `tina/config.ts`** per usare il media store ottimizzato:

```typescript
import { defineConfig } from 'tinacms'
import { createOptimizedMediaStore } from './media-config'

export default defineConfig({
  // ... altre configurazioni
  
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
      // Il media store ottimizzato sarà integrato automaticamente
    }
  },
  
  // ... schema collections
})
```

## Step 3: Sostituisci Componente Immagini

Sostituisci `OptimizedImage.astro` con `AutoOptimizedImage.astro`:

```astro
---
// Prima
import OptimizedImage from '../components/OptimizedImage.astro'

// Dopo  
import AutoOptimizedImage from '../components/AutoOptimizedImage.astro'
---

<AutoOptimizedImage 
  src={image}
  alt="Descrizione"
  width={800}
  height={600}
/>
```

## Step 4: Struttura Directory

Il sistema creerà automaticamente questa struttura:

```
public/
├── uploads/
│   ├── immagine-originale.jpg     # File originale
│   └── optimized/
│       ├── immagine-originale.webp # Versione WebP
│       └── immagine-originale.avif # Versione AVIF
```

## Step 5: Test del Sistema

1. **Avvia TinaCMS**: `npm run tina-dev`
2. **Carica un'immagine** tramite il Media Manager
3. **Verifica** che vengano create le versioni ottimizzate in `/uploads/optimized/`
4. **Controlla** che il componente `AutoOptimizedImage` le usi automaticamente

## Come Funziona

### 🔄 **Flusso di Upload:**
1. L'utente carica un'immagine via TinaCMS
2. Il sistema salva l'originale in `/uploads/`
3. **In background** (non bloccante), Sharp genera WebP e AVIF
4. Le versioni ottimizzate vanno in `/uploads/optimized/`

### 🖼️ **Flusso di Rendering:**
1. Il componente `AutoOptimizedImage` riceve il path dell'originale
2. Cerca automaticamente le versioni ottimizzate in `/optimized/`
3. Genera un `<picture>` con fallback progressivo:
   - AVIF (migliore compressione)
   - WebP (ottimo supporto)
   - JPEG/PNG originale (fallback)

### ⚡ **Vantaggi:**
- **Upload veloce**: L'ottimizzazione non blocca l'utente
- **Automatico**: Zero configurazione per ogni immagine
- **Compatibilità**: Fallback automatico per browser vecchi
- **Performance**: 60-80% riduzione dimensioni file
- **SEO-friendly**: Migliora Core Web Vitals

## Monitoraggio

Controlla i log per vedere l'ottimizzazione in azione:

```
✅ Optimized: IMG-3618.webp, IMG-3618.avif
✅ Optimized: giacca-2025-09-30.webp, giacca-2025-09-30.avif
```

## Troubleshooting

### Problema: "Sharp non installato"
```bash
npm install sharp --platform=linux --arch=x64  # Per Netlify
```

### Problema: "Directory ottimizzate non create"
Verifica i permessi della cartella `public/uploads/`

### Problema: "Immagini non ottimizzate"
Controlla i log del server per errori Sharp