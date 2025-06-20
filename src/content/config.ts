import { defineCollection, z } from 'astro:content';

// Schema per le impostazioni della homepage
const homepageSettingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    mostraBannerSaldi: z.boolean(),
    testoBanner: z.string(),
    linkBanner: z.string()
  })
});

// Schema per le impostazioni dei saldi
const saldiSettingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    saldiAttivi: z.boolean(),
    messaggioGlobale: z.string(),
    coloreTema: z.string(),
    emailOrdini: z.string(),
    telefonoOrdini: z.string()
  })
});

// Schema per i post dei saldi
const saldiPostsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titolo: z.string(),
    data: z.date(),
    attivo: z.boolean(),
    evidenziato: z.boolean().optional(),
    immagine: z.string().optional(),
    descrizione: z.string().optional()
  })
});

// Schema per i prodotti in saldo
const prodottiSaldiCollection = defineCollection({
  type: 'content',
  schema: z.object({
    nome: z.string(),
    prezzo: z.number(),
    prezzoOriginale: z.number(),
    sconto: z.number(),
    categoria: z.string(),
    immagine: z.string(),
    descrizione: z.string(),
    disponibile: z.boolean(),
    taglia: z.array(z.string()).optional(),
    colore: z.array(z.string()).optional(),
    evidenziato: z.boolean().optional()
  })
});

// Schema per le categorie dei saldi
const categorieSaldiCollection = defineCollection({
  type: 'content',
  schema: z.object({
    nome: z.string(),
    sconto: z.number(),
    numeroArticoli: z.number(),
    descrizione: z.string(),
    immagine: z.string(),
    attivo: z.boolean(),
    ordine: z.number()
  })
});

// Schema per hero dei saldi
const saldiHeroCollection = defineCollection({
  type: 'content',
  schema: z.object({
    titolo: z.string(),
    sottotitolo: z.string(),
    descrizione: z.string(),
    bottone: z.string(),
    immagine: z.string(),
    attivo: z.boolean()
  })
});

// Esporta le collections
export const collections = {
  'homepage-settings': homepageSettingsCollection,
  'saldi-settings': saldiSettingsCollection,
  'saldi-posts': saldiPostsCollection,
  'prodotti-saldi': prodottiSaldiCollection,
  'categorie-saldi': categorieSaldiCollection,
  'saldi-hero': saldiHeroCollection
};
