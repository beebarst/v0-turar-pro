import { defineField, defineType } from "sanity"

import { CATEGORY_OPTIONS } from "./service"

export const portfolioType = defineType({
  name: "portfolio",
  title: "Портфолио",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Категория",
      type: "string",
      options: { list: CATEGORY_OPTIONS, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Тег (напр. «Свадебный фильм»)",
      type: "string",
    }),
    defineField({
      name: "videoUrl",
      title: "Ссылка на видео",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Превью (обложка)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Порядок сортировки",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Порядок",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "tag", media: "image" },
  },
})
