import React, { useEffect, useState } from 'react'

const slides = [
  'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
]

// [last, ...slides, first] để loop mượt
const extended = [slides[slides.length - 1], ...slides, slides[0]]

const Banner = () => {
  const [current, setCurrent] = useState(1)
  const [allowTransition, setAllowTransition] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const next = () => setCurrent((c) => c + 1)
  const prev = () => setCurrent((c) => c - 1)

  // Auto 4s, dừng khi hover
  useEffect(() => {
    if (isHovered) return
    const id = setInterval(() => next(), 4000)
    return () => clearInterval(id)
  }, [isHovered])

  // Reset khi đến clone đầu/cuối
  const handleTransitionEnd = () => {
    if (current === extended.length - 1) {
      setAllowTransition(false)
      setCurrent(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAllowTransition(true))
      })
    } else if (current === 0) {
      setAllowTransition(false)
      setCurrent(extended.length - 2)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAllowTransition(true))
      })
    }
  }

  const activeDot =
    current === 0 ? slides.length - 1
    : current === extended.length - 1 ? 0
    : current - 1

  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto">
        {/* Container duy nhất, không còn lớp phủ che ảnh */}
        <div
          className="relative h-28 md:h-36 lg:h-40 rounded-lg overflow-hidden bg-gray-200"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Track ảnh */}
          <div
            className={`h-full flex ${allowTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${current * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i}`}
                className="min-w-full w-full h-full object-cover flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>

          {/* Nút điều hướng */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow z-10"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center shadow z-10"
            aria-label="Next"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i + 1)}
                className={`h-2.5 rounded-full transition-all ${i === activeDot ? 'w-6 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner