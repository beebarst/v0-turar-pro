import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { schemaTypes } from "./sanity/schemas"
import { GLOBAL_SETTINGS_ID } from "./lib/sanity/queries"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ""
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

/**
 * Sanity Studio configuration.
 *
 * "globalSettings" is treated as a singleton: instead of a document list, the
 * structure links straight to the single document with the fixed id, and the
 * default create/delete/duplicate actions are removed for it.
 */
export default defineConfig({
  name: "default",
  title: "TURAR.PRO",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  document: {
    // Remove "create / duplicate / delete" actions for the singleton.
    actions: (prev, { schemaType }) =>
      schemaType === "globalSettings"
        ? prev.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : prev,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Контент")
          .items([
            S.listItem()
              .title("Глобальные настройки")
              .id("globalSettings")
              .child(
                S.document()
                  .schemaType("globalSettings")
                  .documentId(GLOBAL_SETTINGS_ID),
              ),
          ]),
    }),
  ],
})
