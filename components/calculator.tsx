"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Plus, Minus, Check, Trash2, ShoppingBag, Sparkles } from "lucide-react"
import {
  SERVICE_CATEGORIES,
  DISCOUNT,
  formatPrice,
  type Service,
} from "@/lib/services-data"
import { AnimatedNumber } from "./animated-number"
import { OrderModal, type SelectedItem } from "./order-modal"

type Selection = Record<string, number> // serviceId -> qty (1 = selected, or hours for hourly)

export function Calculator() {
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    wedding: true,
  })
  const [selection, setSelection] = useState<Selection>({})
  const [modalOpen, setModalOpen] = useState(false)

  const toggleCat = (id: string) =>
    setOpenCats((s) => ({ ...s, [id]: !s[id] }))

  const allServices = useMemo(
    () => SERVICE_CATEGORIES.flatMap((c) => c.services),
    [],
  )

  const toggleService = (s: Service) => {
    setSelection((sel) => {
      const next = { ...sel }
      if (next[s.id]) {
        delete next[s.id]
      } else {
        next[s.id] = s.hourly ? 1 : 1
      }
      return next
    })
  }

  const setQty = (id: string, qty: number) => {
    setSelection((sel) => {
      const next = { ...sel }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  const selectedItems: SelectedItem[] = useMemo(() => {
    return Object.entries(selection).map(([id, qty]) => {
      const svc = allServices.find((s) => s.id === id)!
      const unitDiscounted = svc.basePrice * (1 - DISCOUNT)
      return {
        id,
        title: svc.title + (svc.hourly ? ` (${qty} ч)` : ""),
        qty,
        unitDiscounted,
        totalDiscounted: unitDiscounted * qty,
      }
    })
  }, [selection, allServices])

  const totalBase = selectedItems.reduce((sum, i) => {
    const svc = allServices.find((s) => s.id === i.id)!
    return sum + svc.basePrice * i.qty
  }, 0)
  const totalDiscounted = selectedItems.reduce((s, i) => s + i.totalDiscounted, 0)
  const savings = totalBase - totalDiscounted

  return (
    <section
      id="calculator"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="text-brand-red font-semibold tracking-wider text-sm uppercase mb-3">
            Калькулятор
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Соберите свой проект — <br className="sm:hidden" />
            <span className="text-brand-red">цена пересчитается мгновенно</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Все цены уже отображаются со скидкой 15%. Базовая стоимость зачёркнута.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
          {/* Services list */}
          <div className="space-y-3">
            {SERVICE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="w-full flex items-center justify-between px-5 md:px-6 py-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Sparkles className="h-5 w-5 text-brand-red shrink-0" />
                    <h3 className="text-lg md:text-xl font-bold">{cat.title}</h3>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-white/50 transition-transform shrink-0 ${
                      openCats[cat.id] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openCats[cat.id] && (
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    {cat.services.map((s) => {
                      const isSelected = !!selection[s.id]
                      const qty = selection[s.id] ?? 1
                      const discounted = s.basePrice * (1 - DISCOUNT)

                      return (
                        <div
                          key={s.id}
                          className={`px-5 md:px-6 py-5 transition-colors ${
                            isSelected ? "bg-brand-red/5" : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => toggleService(s)}
                              aria-label="Выбрать услугу"
                              className={`mt-1 h-6 w-6 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-brand-red border-brand-red"
                                  : "border-white/20 hover:border-white/50"
                              }`}
                            >
                              {isSelected && <Check className="h-4 w-4 text-white" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <button
                                onClick={() => toggleService(s)}
                                className="text-left w-full"
                              >
                                <div className="font-semibold text-white text-balance">
                                  {s.title}
                                </div>
                                <p className="text-sm text-white/50 mt-1 leading-relaxed text-pretty">
                                  {s.description}
                                </p>
                              </button>

                              <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mt-3">
                                <span className="text-xs text-white/30 line-through">
                                  {formatPrice(s.basePrice)}
                                  {s.hourly ? "/час" : ""}
                                </span>
                                <span className="text-xl md:text-2xl font-bold text-brand-red">
                                  {formatPrice(discounted)}
                                  {s.hourly ? (
                                    <span className="text-sm font-medium text-brand-red/80">
                                      /час
                                    </span>
                                  ) : null}
                                </span>
                              </div>

                              {s.hourly && isSelected && (
                                <div className="flex items-center gap-2 mt-4">
                                  <span className="text-sm text-white/60">Часов:</span>
                                  <div className="flex items-center bg-white/5 rounded-full border border-white/10">
                                    <button
                                      onClick={() => setQty(s.id, Math.max(1, qty - 1))}
                                      className="h-9 w-9 flex items-center justify-center hover:text-brand-red"
                                      aria-label="Меньше"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center font-semibold tabular-nums">
                                      {qty}
                                    </span>
                                    <button
                                      onClick={() => setQty(s.id, qty + 1)}
                                      className="h-9 w-9 flex items-center justify-center hover:text-brand-red"
                                      aria-label="Больше"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cart */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-6 md:p-7 shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag className="h-5 w-5 text-brand-red" />
                <h3 className="text-xl font-bold">Ваш проект</h3>
                {selectedItems.length > 0 && (
                  <span className="ml-auto text-sm bg-brand-red/15 text-brand-red px-2.5 py-0.5 rounded-full font-semibold">
                    {selectedItems.length}
                  </span>
                )}
              </div>

              {selectedItems.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto h-14 w-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <ShoppingBag className="h-6 w-6 text-white/30" />
                  </div>
                  <p className="text-white/50 text-sm">
                    Выберите услуги слева — они появятся здесь со скидкой 15%.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 mb-5">
                    {selectedItems.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-start gap-3 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white/90 leading-tight text-pretty">
                            {i.title}
                          </div>
                          <div className="text-sm text-brand-red font-semibold mt-1">
                            {formatPrice(i.totalDiscounted)}
                          </div>
                        </div>
                        <button
                          onClick={() => setQty(i.id, 0)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-brand-red transition-all"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-white/60 text-sm">Без скидки</span>
                      <span className="text-white/40 line-through tabular-nums">
                        {formatPrice(totalBase)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-white/60 text-sm">Ваша экономия</span>
                      <span className="text-yellow-400 font-semibold tabular-nums">
                        − {formatPrice(savings)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-3 border-t border-white/10">
                      <span className="text-white font-bold text-base">
                        Итого со скидкой
                      </span>
                      <AnimatedNumber
                        value={totalDiscounted}
                        className="neon-glow font-black text-2xl md:text-3xl tabular-nums"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => setModalOpen(true)}
                disabled={selectedItems.length === 0}
                className="mt-6 w-full px-6 py-4 rounded-xl bg-brand-red hover:bg-red-600 font-semibold text-base shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
              >
                Оформить заказ со скидкой
              </button>
            </div>
          </div>
        </div>
      </div>

      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={selectedItems}
        total={totalDiscounted}
      />
    </section>
  )
}
