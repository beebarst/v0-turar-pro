import { groq } from "next-sanity"

/**
 * Fixed id for the GlobalSettings singleton document.
 * The Studio should always edit the document with this id.
 */
export const GLOBAL_SETTINGS_ID = "globalSettings"

/**
 * Fetch the single GlobalSettings document. We match either the fixed
 * singleton id or, as a fallback, the first document of this type — so it
 * works whether the editor created it with the canonical id or not.
 */
export const globalSettingsQuery = groq`
  *[_type == "globalSettings" && (_id == $id || _id == "drafts." + $id)] | order(_updatedAt desc)[0]{
    discount,
    contactPhone,
    telegramLink,
    whatsappLink,
    instagramLink
  }
`

/** Looser fallback query in case the document was created with a generated id. */
export const globalSettingsFallbackQuery = groq`
  *[_type == "globalSettings"] | order(_updatedAt desc)[0]{
    discount,
    contactPhone,
    telegramLink,
    whatsappLink,
    instagramLink
  }
`
