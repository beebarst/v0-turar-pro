import { defineField, defineType } from "sanity"

export const portfolio = defineType({
  name: "portfolio",
  title: "Портфолио",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Название", type: "string" }),
    defineField({ name: "category", title: "Категория", type: "string" }),
    defineField({ name: "imageUrl", title: "Ссылка на картинку", type: "string" }),
    defineField({ name: "videoUrl", title: "Ссылка на видео", type: "string" }),
  ],
})
