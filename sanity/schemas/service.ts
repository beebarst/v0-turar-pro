import { defineField, defineType } from "sanity"

// Category options must match the keys used in the calculator UI so each
// service is grouped under the right heading/icon.
export const CATEGORY_OPTIONS = [
  { title: "Свадебные истории", value: "wedding" },
  { title: "Торжественные мероприятия", value: "events" },
  { title: "Соцсети и Блоги", value: "social" },
  { title: "Бизнес и Бренды", value: "business" },
]

export const serviceType = defineType({
  name: "service",
  title: "Услуга",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Название",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "basePrice",
      title: "Базовая цена (₸, без скидки)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "category",
      title: "Категория",
      type: "string",
      options: { list: CATEGORY_OPTIONS, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hourly",
      title: "Почасовая оплата",
      type: "boolean",
      initialValue: false,
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
    select: { title: "title", subtitle: "category", price: "basePrice" },
    prepare({ title, subtitle, price }) {
      return {
        title,
        subtitle: `${subtitle ?? ""} · ${price ?? 0} ₸`,
      }
    },
  },
})
