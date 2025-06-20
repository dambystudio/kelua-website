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

// Schema per le categorie dei saldi
const categorieSaldiCollection = defineCollection({
  type: 'content',
  schema: z.object({
    nome: z.string(),
    genere: z.enum(['Uomo', 'Donna', 'Unisex']),
    sconto: z.string(),
    descrizione: z.string(),
    immagine: z.string().optional(),
    numeroArticoli: z.number(),
    attivo: z.boolean(),
    ordine: z.number()
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
    categoria: z.enum(['Abiti da Cerimonia', 'Sportswear', 'Accessori']),
    genere: z.enum(['Uomo', 'Donna', 'Unisex']),
    prezzoOriginale: z.number(),
    prezzoScontato: z.number(),
    descrizione: z.string(),
    immagine: z.string().optional(),
    taglie: z.array(z.string()),
    disponibile: z.boolean(),
    nuovo: z.boolean().optional(),
    limitedTime: z.boolean().optional(),
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
