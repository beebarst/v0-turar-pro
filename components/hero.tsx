"use client"

import { ArrowDown, Play } from "lucide-react"

export function Hero() {
  const scrollToCalc = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm mb-8">
          <span className="h-2 w-2 rounded-full bg-brand-red animate-pulse" />
          <span className="text-xs md:text-sm text-white/70 tracking-wide">
            Бибарыс Тұрар · Видеограф · Алматы
          </span>
        </div>

        <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          Видеопроизводство <span className="text-brand-red">полного цикла</span>.
          <br className="hidden sm:block" /> Рассчитайте стоимость проекта{" "}
          <span className="text-brand-red">за 1 минуту</span>
        </h1>

        <p className="mt-6 md:mt-8 text-pretty text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Свадьбы, мероприятия, Reels и брендовые видео. Соберите свой пакет в калькуляторе ниже —
          цена пересчитается мгновенно.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={scrollToCalc}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-red text-white font-semibold text-base md:text-lg hover:bg-red-600 transition-all duration-300 shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] hover:scale-105"
          >
            Рассчитать стоимость
            <ArrowDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 hover:border-white/30 text-white/80 hover:text-white transition-colors"
          >
            <Play className="h-4 w-4" />
            Смотреть портфолио
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { v: "150+", l: "Проектов" },
            { v: "8 лет", l: "Опыта" },
            { v: "48ч", l: "Сроки сдачи" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{s.v}</div>
              <div className="text-xs md:text-sm text-white/50 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
