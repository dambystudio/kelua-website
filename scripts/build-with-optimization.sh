#!/usr/bin/env bash

# 🚀 Script di Build Automatico con Ottimizzazione Immagini
# Integra l'ottimizzazione delle immagini nel processo di build Netlify

echo "🚀 Avvio build con ottimizzazione automatica immagini..."

# 1. Installa le dipendenze
echo "📦 Installazione dipendenze..."
npm ci

# 2. Ottimizza tutte le immagini esistenti
echo "🖼️ Ottimizzazione immagini..."
npm run optimize:images

# 3. Build TinaCMS
echo "🔧 Build TinaCMS..."
npm run tina:build

# 4. Build Astro
echo "⚡ Build Astro..."
npm run build

echo "✅ Build completata con successo!"