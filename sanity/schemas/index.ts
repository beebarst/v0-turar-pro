import type { SchemaTypeDefinition } from "sanity"

import { serviceType } from "./service"
import { portfolioType } from "./portfolio"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [serviceType, portfolioType],
}
