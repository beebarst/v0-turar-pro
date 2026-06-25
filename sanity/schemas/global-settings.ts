import { defineField, defineType } from "sanity"

/**
 * Singleton document holding global, site-wide settings that are managed
 * from Sanity (discount percentage + contact links).
 *
 * It is a singleton: only one document of this type should ever exist, and it
 * is fetched with a fixed `_id` of "globalSettings" (see lib/sanity/queries.ts).
 */
export const globalSettings = defineType({
  name: "globalSettings",
  title: "Глобальные настройки",
  type: "document",
  // Hide the "create new" / "duplicate" actions in Studio for a true singleton.
  // (Enforced via the structure/document-actions config when the Studio is wired up.)
  fields: [
    defineField({
      name: "discount",
      title: "Скидка (%)",
      description: "Процент скидки, который применяется в калькуляторе. Например: 40",
      type: "number",
      initialValue: 40,
      validation: (rule) => rule.required().min(0).max(100),
    }),
    defineField({
      name: "contactPhone",
      title: "Контактный телефон",
      description: "Отображаемый номер телефона. Например: +7 776 100 10 66",
      type: "string",
    }),
    defineField({
      name: "telegramLink",
      title: "Ссылка Telegram",
      type: "string",
    }),
    defineField({
      name: "whatsappLink",
      title: "Ссылка WhatsApp",
      type: "string",
    }),
    defineField({
      name: "instagramLink",
      title: "Ссылка Instagram",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Глобальные настройки" }
    },
  },
})
