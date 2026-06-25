export type Service = {
  id: string
  title: string
  description: string
  basePrice: number
  hourly?: boolean
}

export type ServiceCategory = {
  id: string
  title: string
  icon: string
  services: Service[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "wedding",
    title: "Свадебные истории",
    icon: "heart",
    services: [
      {
        id: "wedding-day",
        title: "Съемка свадебного дня",
        description: "Ловлю искренние эмоции и масштаб события без лишней постановки",
        basePrice: 160000,
      },
      {
        id: "wedding-edit",
        title: "Монтаж фильма",
        description: "Кинематографичный фильм и стильный тизер для соцсетей",
        basePrice: 80000,
      },
      {
        id: "love-story",
        title: "Love Story",
        description: "Ваша личная киноистория с продуманной идеей и локациями",
        basePrice: 70000,
      },
      {
        id: "video-invite",
        title: "Видео-пригласительное",
        description: "Креативный способ позвать близких в современном формате",
        basePrice: 25000,
      },
      {
        id: "reels-wedding",
        title: 'Пакет "Reels-Свадьба"',
        description: "Трендовые ролики для Instagram сразу после праздника",
        basePrice: 20000,
      },
    ],
  },
  {
    id: "events",
    title: "Торжественные мероприятия",
    icon: "glass-water",
    services: [
      {
        id: "event-shooting",
        title: "Выездная съемка",
        description: "Профессиональный репортаж с идеальным светом и стабилизацией",
        basePrice: 20000,
        hourly: true,
      },
      {
        id: "aftermovie",
        title: "Монтаж aftermovie",
        description: "Сочный отчетный ролик под драйвовую музыку",
        basePrice: 30000,
      },
      {
        id: "creative-clip",
        title: "Творческий клип",
        description: "Постановочное видео с режиссурой для вау-эффекта",
        basePrice: 50000,
      },
    ],
  },
  {
    id: "social",
    title: "Соцсети и Блоги",
    icon: "smartphone",
    services: [
      {
        id: "script",
        title: "Разработка сценария",
        description: "Цепляющая структура ролика с первых секунд",
        basePrice: 5000,
      },
      {
        id: "reels-series",
        title: "Съемка серии Reels",
        description: "Запас качественного контента на месяц за один выезд",
        basePrice: 40000,
      },
      {
        id: "vertical-edit",
        title: "Монтаж вертикального видео",
        description: "Динамичная склейка со звуком и трендовыми эффектами",
        basePrice: 8000,
      },
      {
        id: "youtube-edit",
        title: "Монтаж YouTube",
        description: "Профессиональный эдиторинг с вырезанными паузами",
        basePrice: 35000,
      },
    ],
  },
  {
    id: "business",
    title: "Бизнес и Бренды",
    icon: "briefcase",
    services: [
      {
        id: "smm-package",
        title: "Комплексный SMM",
        description: "Готовые ролики под ключ для высоких конверсий",
        basePrice: 120000,
      },
      {
        id: "promo",
        title: "Промо-ролик",
        description: "Презентабельное видео вашего бизнеса и продукта",
        basePrice: 60000,
      },
      {
        id: "target-creative",
        title: "Монтаж креатива",
        description: "Яркий рекламный ролик пробивающий баннерную слепоту",
        basePrice: 15000,
      },
    ],
  },
]

export type PortfolioCategory = "wedding" | "events" | "social" | "business"

export type PortfolioItem = {
  id: string
  title: string
  category: PortfolioCategory
  tag: string
  /** Optional cover image URL (from Sanity). Falls back to gradient when absent. */
  image?: string | null
  /** Optional CSS gradient used when there's no image. */
  thumb?: string
  /** Optional link to the video. */
  videoUrl?: string | null
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: "1", title: "Айдана & Ержан", category: "wedding", tag: "Свадебный фильм", thumb: "linear-gradient(135deg,#1a0a0a,#3a1a1a)" },
  { id: "2", title: "Aftermovie · Almaty Night", category: "events", tag: "Aftermovie", thumb: "linear-gradient(135deg,#0a0a1a,#1a1a3a)" },
  { id: "3", title: "Reels Pack · Beauty", category: "social", tag: "Reels серия", thumb: "linear-gradient(135deg,#1a0a1a,#3a1a3a)" },
  { id: "4", title: "Promo · Auto Salon", category: "business", tag: "Промо-ролик", thumb: "linear-gradient(135deg,#0a1a0a,#1a3a1a)" },
  { id: "5", title: "Love Story · Kapchagai", category: "wedding", tag: "Love Story", thumb: "linear-gradient(135deg,#1a1a0a,#3a3a1a)" },
  { id: "6", title: "Корпоратив · KazTech", category: "events", tag: "Репортаж", thumb: "linear-gradient(135deg,#0a1a1a,#1a3a3a)" },
  { id: "7", title: "TikTok · Food Brand", category: "social", tag: "Вертикаль", thumb: "linear-gradient(135deg,#1a0a0a,#2a1a2a)" },
  { id: "8", title: "Бренд · Fitness Club", category: "business", tag: "SMM-пакет", thumb: "linear-gradient(135deg,#0a0a0a,#2a2a2a)" },
]

export const DISCOUNT = 0.40

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(price)) + " ₸"

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/beebars_t",
  whatsapp: "https://wa.me/77761001066?text=Здравствуйте!%20Пишу%20на%20счет%20монтажа/съемки",
  telegram: "https://t.me/+77761001066",
  phone: "+7 776 100 10 66",
  phoneRaw: "+77761001066",
}

export const TG_BOT_TOKEN = "8641390313:AAEfrd7FvzT8OfLTCERG1KYRfPD7kdUjZxY"
export const TG_CHAT_ID = "425989373"

export async function sendToTelegram(text: string) {
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  })
  if (!res.ok) throw new Error("TG send failed")
  return res.json()
}
