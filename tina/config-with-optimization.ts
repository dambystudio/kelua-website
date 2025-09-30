import { defineConfig } from 'tinacms'
import OptimizedMediaStore from '../lib/OptimizedMediaStore'
import path from 'path'

// Configurazione del Media Store ottimizzato
const optimizedMediaStore = new OptimizedMediaStore({
  baseDirectory: path.join(process.cwd(), 'public'),
  publicPath: ''
})

export default defineConfig({
  // Configurazione esistente...
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  
  // Media Store personalizzato
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
      // Usa il nostro media store ottimizzato
      store: optimizedMediaStore
    }
  },

  // Schema esistente (mantieni quello che hai già)
  schema: {
    collections: [
      // Le tue collection esistenti...
      {
        name: 'galleria_giacche',
        label: 'Galleria Giacche',
        path: 'src/content/galleria_giacche',
        format: 'md',
        
        // UI per filename automatico
        ui: {
          filename: {
            readonly: true,
            slugify: (values) => {
              const now = new Date()
              const timestamp = now.toISOString().slice(0, 19).replace(/[T:]/g, '-')
              const brand = values?.brand ? `-${values.brand.toLowerCase().replace(/\s+/g, '-')}` : ''
              return `giacca-${timestamp}${brand}`
            }
          }
        },
        
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titolo',
            required: true
          },
          {
            type: 'image',
            name: 'image',
            label: 'Immagine Principale',
            required: true,
            // Le immagini saranno automaticamente ottimizzate dal nostro store
          },
          {
            type: 'image',
            name: 'gallery',
            label: 'Galleria Immagini',
            list: true,
            // Anche le gallery saranno ottimizzate
          },
          {
            type: 'number',
            name: 'prezzo',
            label: 'Prezzo (€)',
            required: false
          },
          {
            type: 'string',
            name: 'brand',
            label: 'Brand'
          },
          {
            type: 'string',
            name: 'descrizione',
            label: 'Descrizione',
            ui: {
              component: 'textarea'
            }
          }
        ]
      }
      // Aggiungi altre collection...
    ]
  }
})