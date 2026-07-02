import { defineField, defineType } from "sanity"

export const service = defineType({
  name: "service",
  title: "Услуга",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Название", type: "string" }),
    defineField({ name: "price", title: "Цена", type: "number" }),
    defineField({ name: "description", title: "Описание", type: "text" }),
    defineField({ name: "category", title: "Категория", type: "string" }),
    defineField({ name: "hourly", title: "Цена за час", type: "number" }),
    defineField({ name: "order", title: "Порядок сортировки", type: "number" }),
  ],
})
