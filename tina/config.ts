import { defineConfig } from "tinacms";

// Check if we're in local mode
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.NETLIFY_BRANCH ||
  process.env.HEAD ||
  "master";

export default defineConfig({
  branch,

  // Get this from tina.io - For local development, these can be undefined
  clientId: isLocal ? undefined : process.env.PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io - For local development, these can be undefined
  token: isLocal ? undefined : process.env.TINA_TOKEN,

  search: {
    tina: {
      indexerToken: isLocal ? undefined : process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ['ita']
    }
  },

  build: {
    outputFolder: "admin",
    publicFolder: "public",
    basePath: "",
  },
  
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },
  
  schema: {
    collections: [
      // Impostazioni Homepage
      {
        name: "homepageSettings",
        label: "🏠 Impostazioni Homepage",
        path: "src/content/homepage-settings",
        format: "md",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "boolean",
            name: "mostraBannerSaldi",
            label: "Mostra Banner Saldi",
            description: "Attiva/disattiva il banner saldi in homepage",
          },
          {
            type: "string",
            name: "testoBanner",
            label: "Testo Banner",
            description: "Testo da mostrare nel banner",
          },
          {
            type: "string",
            name: "linkBanner",
            label: "Link Banner",
            description: "URL di destinazione del banner",
          },
        ],
      },

      // Impostazioni Saldi
      {
        name: "saldiSettings",
        label: "🏷️ Impostazioni Saldi",
        path: "src/content/saldi-settings",
        format: "md",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "boolean",
            name: "saldiAttivi",
            label: "Saldi Attivi",
            description: "Attiva/disattiva la sezione saldi",
          },
          {
            type: "string",
            name: "messaggioGlobale",
            label: "Messaggio Globale",
            description: "Messaggio da mostrare nella pagina saldi",
          },
          {
            type: "string",
            name: "coloreTema",
            label: "Colore Tema",
            description: "Colore principale per la sezione saldi",
          },
          {
            type: "string",
            name: "emailOrdini",
            label: "Email Ordini",
            description: "Email per ricevere gli ordini",
          },
          {
            type: "string",
            name: "telefonoOrdini",
            label: "Telefono Ordini",
            description: "Numero di telefono per gli ordini",
          },
        ],
      },

      // Hero Saldi
      {
        name: "saldiHero",
        label: "🎯 Hero Saldi",
        path: "src/content/saldi-hero",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "sottotitolo",
            label: "Sottotitolo",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questo hero nella pagina saldi",
          },
          {
            type: "image",
            name: "immagineBackground",
            label: "Immagine Background",
            description: "Immagine di sfondo per l'hero",
          },
        ],
      },

      // Categorie Saldi
      {
        name: "categorieSaldi",
        label: "📂 Categorie Saldi",
        path: "src/content/categorie-saldi",
        format: "md",
        fields: [
          {
            type: "string",
            name: "nome",
            label: "Nome Categoria",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "emoji",
            label: "Emoji",
            description: "Emoji rappresentativa della categoria",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: ["Donna", "Uomo", "Unisex"],
            ui: {
              component: "select",
            },
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "sconto",
            label: "Sconto",
            description: "Es: -50%, Fino al 70%, etc.",
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine Categoria",
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Categoria Attiva",
            description: "Mostra questa categoria nella pagina saldi",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le categorie (1, 2, 3...)",
          },
        ],
      },

      // Prodotti Saldi
      {
        name: "prodottiSaldi",
        label: "🛍️ Prodotti Saldi",
        path: "src/content/prodotti-saldi",
        format: "md",
        fields: [
          {
            type: "string",
            name: "nome",
            label: "Nome Prodotto",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Deve corrispondere al nome di una categoria esistente",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: ["Donna", "Uomo", "Unisex"],
            required: true,
            ui: {
              component: "select",
            },
          },
          {
            type: "number",
            name: "prezzoOriginale",
            label: "Prezzo Originale (€)",
            required: true,
          },
          {
            type: "number",
            name: "prezzoScontato",
            label: "Prezzo Scontato (€)",
            required: true,
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine Prodotto",
          },
          {
            type: "string",
            name: "taglie",
            label: "Taglie Disponibili",
            list: true,
            description: "Aggiungi le taglie disponibili (XS, S, M, L, XL, etc.)",
          },
          {
            type: "boolean",
            name: "disponibile",
            label: "Disponibile",
            description: "Il prodotto è disponibile per l'acquisto",
          },
          {
            type: "boolean",
            name: "nuovo",
            label: "Nuovo Arrivo",
            description: "Mostra badge 'Nuovo'",
          },
          {
            type: "boolean",
            name: "limitedTime",
            label: "Offerta Limitata",
            description: "Mostra badge 'Offerta Limitata'",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare i prodotti (1, 2, 3...)",
          },
        ],
      },

      // Post Saldi (contenuti editoriali)
      {
        name: "saldiPosts",
        label: "📝 Post Saldi",
        path: "src/content/saldi-posts",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "sottotitolo",
            label: "Sottotitolo",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Post Attivo",
            description: "Mostra questo post nella sezione saldi",
          },
          {
            type: "datetime",
            name: "dataInizio",
            label: "Data Inizio",
            description: "Data di inizio validità del post",
          },
          {
            type: "datetime",
            name: "dataFine",
            label: "Data Fine",
            description: "Data di fine validità del post",
          },

          {
            type: "number",
            name: "ordinamento",
            label: "Ordinamento",
            description: "Numero per ordinare i post (1, 2, 3...)",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Contenuto",
            isBody: true,
          },
        ],
      },
      
      // Galleria Sportswear
      {
        name: "galleria_sportswear",
        label: "Galleria Sportswear",
        path: "src/content/galleria-sportswear",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            required: true,
            description: "Nome dell'immagine che apparirà nella galleria",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            description: "Descrizione che apparirà nell'overlay dell'immagine",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine",
            required: true,
            description: "Immagine da mostrare nella galleria (verrà automaticamente ottimizzata in WebP e AVIF per migliorare le prestazioni)",
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Categoria specifica (es. Fitness, Running, Casual)",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: [
              {
                value: "Donna",
                label: "Donna",
              },
              {
                value: "Uomo",
                label: "Uomo",
              },
              {
                value: "Unisex",
                label: "Unisex",
              },
            ],
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questa immagine nella galleria",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le immagini (1, 2, 3...)",
          },
        ],
      },
      
      // Galleria Abiti da Cerimonia
      {
        name: "galleria_abiti_cerimonia",
        label: "Galleria Abiti da Cerimonia",
        path: "src/content/galleria-abiti-cerimonia",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            required: true,
            description: "Nome dell'abito che apparirà nella galleria",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            description: "Descrizione che apparirà nell'overlay dell'immagine",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine",
            required: true,
            description: "Immagine da mostrare nella galleria (verrà automaticamente ottimizzata in WebP e AVIF per migliorare le prestazioni)",
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Categoria specifica (es. Elegante, Matrimonio, Cocktail)",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: [
              {
                value: "Donna",
                label: "Donna",
              },
              {
                value: "Uomo",
                label: "Uomo",
              },
              {
                value: "Unisex",
                label: "Unisex",
              },
            ],
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questa immagine nella galleria",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le immagini (1, 2, 3...)",
          },
        ],
      },

      // Galleria Jeans
      {
        name: "galleria_jeans",
        label: "Galleria Jeans",
        path: "src/content/galleria-jeans",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            required: true,
            description: "Nome del jeans che apparirà nella galleria",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            description: "Descrizione che apparirà nell'overlay dell'immagine",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine",
            required: true,
            description: "Immagine da mostrare nella galleria (verrà automaticamente ottimizzata in WebP e AVIF per migliorare le prestazioni)",
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Categoria specifica (es. Slim, Regular, Skinny, Boyfriend)",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: [
              {
                value: "Donna",
                label: "Donna",
              },
              {
                value: "Uomo",
                label: "Uomo",
              },
              {
                value: "Unisex",
                label: "Unisex",
              },
            ],
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questa immagine nella galleria",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le immagini (1, 2, 3...)",
          },
        ],
      },

      // Galleria Maglie
      {
        name: "galleria_maglie",
        label: "Galleria Maglie",
        path: "src/content/galleria-maglie",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            required: true,
            description: "Nome della maglia che apparirà nella galleria",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            description: "Descrizione che apparirà nell'overlay dell'immagine",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine",
            required: true,
            description: "Immagine da mostrare nella galleria (verrà automaticamente ottimizzata in WebP e AVIF per migliorare le prestazioni)",
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Categoria specifica (es. T-shirt, Polo, Maglia a maniche lunghe)",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: [
              {
                value: "Donna",
                label: "Donna",
              },
              {
                value: "Uomo",
                label: "Uomo",
              },
              {
                value: "Unisex",
                label: "Unisex",
              },
            ],
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questa immagine nella galleria",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le immagini (1, 2, 3...)",
          },
        ],
      },

      // Galleria Camicie
      {
        name: "galleria_camicie",
        label: "Galleria Camicie",
        path: "src/content/galleria-camicie",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            required: true,
            description: "Nome della camicia che apparirà nella galleria",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            description: "Descrizione che apparirà nell'overlay dell'immagine",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine",
            required: true,
            description: "Immagine da mostrare nella galleria (verrà automaticamente ottimizzata in WebP e AVIF per migliorare le prestazioni)",
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Categoria specifica (es. Elegante, Casual, Business)",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: [
              {
                value: "Donna",
                label: "Donna",
              },
              {
                value: "Uomo",
                label: "Uomo",
              },
              {
                value: "Unisex",
                label: "Unisex",
              },
            ],
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questa immagine nella galleria",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le immagini (1, 2, 3...)",
          },
        ],
      },

      // Galleria Pantaloni
      {
        name: "galleria_pantaloni",
        label: "Galleria Pantaloni",
        path: "src/content/galleria-pantaloni",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            required: true,
            description: "Nome del pantalone che apparirà nella galleria",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            description: "Descrizione che apparirà nell'overlay dell'immagine",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine",
            required: true,
            description: "Immagine da mostrare nella galleria (verrà automaticamente ottimizzata in WebP e AVIF per migliorare le prestazioni)",
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Categoria specifica (es. Elegante, Casual, Chino)",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: [
              {
                value: "Donna",
                label: "Donna",
              },
              {
                value: "Uomo",
                label: "Uomo",
              },
              {
                value: "Unisex",
                label: "Unisex",
              },
            ],
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questa immagine nella galleria",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le immagini (1, 2, 3...)",
          },
        ],
      },

      // Galleria Felpe
      {
        name: "galleria_felpe",
        label: "Galleria Felpe",
        path: "src/content/galleria-felpe",
        format: "md",
        fields: [
          {
            type: "string",
            name: "titolo",
            label: "Titolo",
            required: true,
            description: "Nome della felpa che apparirà nella galleria",
          },
          {
            type: "string",
            name: "descrizione",
            label: "Descrizione",
            description: "Descrizione che apparirà nell'overlay dell'immagine",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "immagine",
            label: "Immagine",
            required: true,
            description: "Immagine da mostrare nella galleria (verrà automaticamente ottimizzata in WebP e AVIF per migliorare le prestazioni)",
          },
          {
            type: "string",
            name: "categoria",
            label: "Categoria",
            description: "Categoria specifica (es. Hoodie, Girocollo, Zip)",
          },
          {
            type: "string",
            name: "genere",
            label: "Genere",
            options: [
              {
                value: "Donna",
                label: "Donna",
              },
              {
                value: "Uomo",
                label: "Uomo",
              },
              {
                value: "Unisex",
                label: "Unisex",
              },
            ],
          },
          {
            type: "boolean",
            name: "attivo",
            label: "Attivo",
            description: "Mostra questa immagine nella galleria",
          },
          {
            type: "number",
            name: "ordine",
            label: "Ordine",
            description: "Numero per ordinare le immagini (1, 2, 3...)",
          },
        ],
      },
    ],
  },
});
