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
  services: Service[]
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "wedding",
    title: "Свадебные истории",
    services: [
      {
        id: "wedding-day",
        title: "Съемка свадебного дня (до 12 часов)",
        description:
          "Запечатлею все ключевые моменты от сборов до торта. Работаю незаметно, ловлю искренние эмоции.",
        basePrice: 160000,
      },
      {
        id: "wedding-edit",
        title: "Монтаж свадебного фильма и клипа",
        description: "Кинематографичный фильм для семейного архива и стильный тизер для соцсетей.",
        basePrice: 80000,
      },
      {
        id: "love-story",
        title: "Love Story (Сценарий + Съемка + Монтаж)",
        description: "Ваша личная киноистория. Продумаем идею, подберем локации и снимем красивый мини-фильм.",
        basePrice: 70000,
      },
      {
        id: "video-invite",
        title: "Видео-пригласительное для гостей",
        description: "Креативный способ позвать близких на торжество. Экологично и современно.",
        basePrice: 25000,
      },
      {
        id: "reels-wedding",
        title: 'Пакет "Reels-Свадьба" (3 ролика за 48 часов)',
        description: "Готовые трендовые видео для вашего Instagram сразу после праздника.",
        basePrice: 20000,
      },
    ],
  },
  {
    id: "events",
    title: "Торжественные мероприятия",
    services: [
      {
        id: "event-shooting",
        title: "Выездная съемка (почасовая)",
        description: "Профессиональная репортажная съемка с качественным светом и стабилизацией.",
        basePrice: 20000,
        hourly: true,
      },
      {
        id: "aftermovie",
        title: "Монтаж отчетного ролика (aftermovie)",
        description: "Сочный ролик на 2-4 минуты под драйвовую музыку.",
        basePrice: 30000,
      },
      {
        id: "creative-clip",
        title: "Творческий / Пародийный клип (Сценарий + монтаж)",
        description: "Постановочное видео с режиссурой для нестандартного поздравления или сюрприза.",
        basePrice: 50000,
      },
    ],
  },
  {
    id: "social",
    title: "Соцсети и Блоги",
    services: [
      {
        id: "script",
        title: "Разработка сценария и концепта (1 ролик)",
        description: "Структура видео, которая цепляет с первой секунды.",
        basePrice: 5000,
      },
      {
        id: "reels-series",
        title: "Съемка серии Reels/TikTok (до 15 роликов)",
        description: "Выставим свет и отснимем запас контента на месяц за один выезд.",
        basePrice: 40000,
      },
      {
        id: "vertical-edit",
        title: "Монтаж вертикального видео (1 ролик)",
        description: "Динамичная склейка, саунд-дизайн, трендовые эффекты и субтитры.",
        basePrice: 8000,
      },
      {
        id: "youtube-edit",
        title: "Монтаж YouTube-выпуска (до 15 минут)",
        description: "Профессиональный эдиторинг: вырежу паузы, добавлю инфографику.",
        basePrice: 35000,
      },
    ],
  },
  {
    id: "business",
    title: "Бизнес и Бренды",
    services: [
      {
        id: "smm-package",
        title: "Комплексный SMM-видеопакет (10-12 Reels под ключ)",
        description: "От генерации идей до готовых роликов, работающих на конверсию.",
        basePrice: 120000,
      },
      {
        id: "promo",
        title: "Промо-ролик / Видеообзор под ключ (Съемка + Монтаж)",
        description: "Презентабельное видео вашего бизнеса или продукта.",
        basePrice: 60000,
      },
      {
        id: "target-creative",
        title: "Монтаж креатива для таргета",
        description: "Яркий 15-секундный ролик из ваших материалов, который пробивает баннерную слепоту.",
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
