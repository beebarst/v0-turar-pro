import { groq } from "next-sanity"

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc, _createdAt asc) {
    "id": _id,
    title,
    description,
    basePrice,
    category,
    hourly
  }
`

export const portfolioQuery = groq`
  *[_type == "portfolio"] | order(order asc, _createdAt asc) {
    "id": _id,
    title,
    category,
    tag,
    videoUrl,
    image
  }
`
