import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "../styles/Swiper.css";

import { FreeMode, Thumbs } from "swiper/modules";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const mainSwiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="slider-wrapper">

      {/* ── Miniatures verticales à gauche ── */}
      <Swiper
        onSwiper={setThumbsSwiper}
        direction="vertical"
        spaceBetween={8}
        slidesPerView={Math.min(images.length, 4)}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Thumbs]}
        className="thumbs-swiper"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <img src={src} alt={`Miniature ${i + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Zone principale : flèche + image + flèche ── */}
      <div className="main-area">

        <button
          className="nav-btn"
          onClick={() => mainSwiperRef.current?.slidePrev()}
          aria-label="Précédent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <Swiper
          onSwiper={(s) => { mainSwiperRef.current = s; }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          loop={true}
          spaceBetween={10}
          modules={[FreeMode, Thumbs]}
          className="main-swiper"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <img src={src} alt={`Slide ${i + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="nav-btn"
          onClick={() => mainSwiperRef.current?.slideNext()}
          aria-label="Suivant"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

      </div>
    </div>
  );
}
