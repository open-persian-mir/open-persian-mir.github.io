import { defineCollection, z } from 'astro:content';

const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    order: z.number().optional(),
  }),
});

const datasetCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    authors: z.string(),
    year: z.number(),
    modality: z.string(),
    focus: z.string(),
    license: z.string(),
    url: z.string().url(),
  }),
});

const paperCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    year: z.number(),
    venue: z.string(),
    category: z.string(),
    url: z.string().url(),
    summary: z.string(),
  }),
});

export const collections = {
  theory: articleCollection,
  history: articleCollection,
  datasets: datasetCollection,
  papers: paperCollection,
};
