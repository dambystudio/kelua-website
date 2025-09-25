import { defineCollection, z } from 'astro:content';

// Schema per le impostazioni saldi
const saldiSettingsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    saldiAttivi: z.boolean(),
    messaggioGlobale: z.string().optional(),
    coloreTema: z.string().optional(),
    emailOrdini: z.string().optional(),
    telefonoOrdini: z.string().optional(),
  }),
});

// Schema per le impostazioni homepage
const homepageSettingsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    mostraBannerSaldi: z.boolean(),
    testoBanner: z.string().optional(),
    linkBanner: z.string().optional(),
  }),
});

// Schema per le categorie saldi
const categorieSaldiCollection = defineCollection({
  type: 'content',
  schema: z.object({
    nome: z.string(),
    emoji: z.string().optional(),
    genere: z.enum(['Donna', 'Uomo', 'Unisex']).optional(),
    descrizione: z.string().optional(),
    sconto: z.string().optional(),
    immagine: z.string().optional(),
    attivo: z.boolean(),
    ordine: z.number().optional(),
  }),
});

// Schema per i prodotti saldi
const prodottiSaldiCollection = defineCollection({
  type: 'content',
  schema: z.object({
    nome: z.string(),
    categoria: z.string(),
    genere: z.enum(['Donna', 'Uomo', 'Unisex']),
    prezzoOriginale: z.number(),
    prezzoScontato: z.number(),
    descrizione: z.string().optional(),
    immagine: z.string().optional(),
    taglie: z.array(z.string()).optional(),
    disponibile: z.boolean(),
    nuovo: z.boolean().optional(),
    limitedTime: z.boolean().optional(),
    ordine: z.number().optional(),
  }),
});

// Schema per i post saldi (per contenuti editoriali)
const saldiPostsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titolo: z.string(),
    sottotitolo: z.string().optional(),
    descrizione: z.string().optional(),
    attivo: z.boolean(),
    dataInizio: z.string().optional(),
    dataFine: z.string().optional(),

    ordinamento: z.number().optional(),
  }),
});

// Schema per hero saldi
const saldiHeroCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titolo: z.string(),
    sottotitolo: z.string().optional(),
    descrizione: z.string().optional(),
    attivo: z.boolean(),
    immagineBackground: z.string().optional(),
  }),
});

// Schema per le immagini della galleria sportswear
const galleriaSporstwearCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titolo: z.string(),
    descrizione: z.string().optional(),
    immagine: z.string(),
    categoria: z.string().optional(),
    genere: z.enum(['Donna', 'Uomo', 'Unisex']).optional(),
    attivo: z.boolean(),
    ordine: z.number().optional(),
  }),
});

// Schema per le immagini della galleria abiti da cerimonia
const galleriaAbitiCerimonia = defineCollection({
  type: 'content',
  schema: z.object({
    titolo: z.string(),
    descrizione: z.string().optional(),
    immagine: z.string(),
    categoria: z.string().optional(),
    genere: z.enum(['Donna', 'Uomo', 'Unisex']).optional(),
    attivo: z.boolean(),
    ordine: z.number().optional(),
    prezzo: z.number().optional(),
  }),
});

// Schema per le collezioni di abbigliamento
const galleriaSchema = z.object({
  titolo: z.string(),
  nome: z.string().optional(),
  descrizione: z.string().optional(),
  prezzo: z.number().optional(),
  immagine: z.string().optional(),
  categoria: z.string().optional(),
  genere: z.enum(['Donna', 'Uomo', 'Unisex']).optional(),
  attivo: z.boolean(),
  ordine: z.number().optional(),
});

// Collezioni di abbigliamento
const galleriaJeans = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaMaglie = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaCamicie = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaFelpe = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaPantaloni = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaGiubbotti = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaAccessori = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaGiacche = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

const galleriaMaglieria = defineCollection({
  type: 'content',
  schema: galleriaSchema,
});

// Esporta le collezioni
export const collections = {
  'saldi-settings': saldiSettingsCollection,
  'homepage-settings': homepageSettingsCollection,
  'categorie-saldi': categorieSaldiCollection,
  'prodotti-saldi': prodottiSaldiCollection,
  'saldi-posts': saldiPostsCollection,
  'saldi-hero': saldiHeroCollection,
  'galleria-sportswear': galleriaSporstwearCollection,
  'galleria-abiti-cerimonia': galleriaAbitiCerimonia,
  'galleria-jeans': galleriaJeans,
  'galleria-maglie': galleriaMaglie,
  'galleria-camicie': galleriaCamicie,
  'galleria-felpe': galleriaFelpe,
  'galleria-pantaloni': galleriaPantaloni,
  'galleria-giubbotti': galleriaGiubbotti,
  'galleria_giubbotti': galleriaGiubbotti,
  'galleria_accessori': galleriaAccessori,
  'galleria-accessori': galleriaAccessori,
  'galleria-giacche': galleriaGiacche,
  'galleria-maglieria': galleriaMaglieria,
};
