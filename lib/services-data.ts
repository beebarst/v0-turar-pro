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

export const DISCOUNT = 0.15

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
