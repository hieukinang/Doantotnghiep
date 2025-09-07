import React, { useEffect, useState } from 'react'
import left from '../assets/fill-left.svg'
import right from '../assets/fill-right.svg'

const slides = [
  'https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
]

// [last, ...slides, first] để tạo loop
const extended = [slides[slides.length - 1], ...slides, slides[0]]

const Banner = () => {
  const [current, setCurrent] = useState(1) // bắt đầu ở slide thật đầu tiên
  const [allowTransition, setAllowTransition] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const next = () => setCurrent((c) => c + 1)
  const prev = () => setCurrent((c) => c - 1)

  // Auto chạy 4s, dừng khi hover
  useEffect(() => {
    if (isHovered) return
    const id = setInterval(() => next(), 4000)
    return () => clearInterval(id)
  }, [isHovered])

  // Reset index khi tới clone đầu/cuối
  useEffect(() => {
    if (current === extended.length - 1) {
      const timer = setTimeout(() => {
        setAllowTransition(false)
        setCurrent(1)
      }, 700)
      return () => clearTimeout(timer)
    }
    if (current === 0) {
      const timer = setTimeout(() => {
        setAllowTransition(false)
        setCurrent(extended.length - 2)
      }, 700)
      return () => clearTimeout(timer)
    }
    setAllowTransition(true)
  }, [current])

  // Xác định dot active
  const activeDot =
    current === 0 ? slides.length - 1
      : current === extended.length - 1 ? 0
        : current - 1

  return (
    <section className="w-full h-[300px] md:h-[350px] lg:h-[400px]">
      <div className="max-w-7xl mx-auto h-full">
        {/* Banner wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full overflow-hidden">

          {/* Banner trượt bên trái */}
          <div
            className="relative col-span-2 rounded-lg overflow-hidden bg-gray-200 flex[0.6] h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Track ảnh */}
            <div
              className={`h-[1] flex ${allowTransition ? 'transition-transform duration-700 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {extended.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Slide ${i}`}
                  className="w-full h-full object-cover flex-shrink-0"
                  loading="lazy"
                />
              ))}
            </div>

            {/* Nút điều hướng */}
            <img
              src={left}
              alt="Previous"
              onClick={prev}
              className="absolute left-3 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow z-10 cursor-pointer"
            />
            <img
              src={right}
              alt="Next"
              onClick={next}
              className="absolute right-3 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow z-10 cursor-pointer"
            />

            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i + 1)}
                  className={`h-2 rounded-full transition-all ${i === activeDot ? 'w-5 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 2 ảnh nhỏ bên phải */}
          <div className="flex flex-col h-full gap-2">
            <div className="flex-[0.6] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=800&auto=format&fit=crop"
                alt="Small Banner 1"
                className="w-full h-full object-fill"
                loading="lazy"
              />
            </div>
            <div className="flex-[1] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=800&auto=format&fit=crop"
                alt="Small Banner 2"
                className="w-full h-[53%] object-fill"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>

    </section >

  )
}

export default Banner
