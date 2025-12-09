'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { SlideImage } from '../lib/supabase';
import { Box, Button, Text } from '@mantine/core';

import Image from 'next/image';

interface ImageSliderProps {
  slides: SlideImage[];
}

export default function ImageSlider({ slides }: ImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (slides.length === 0) {
    return (
      <div className="w-full h-[600px] bg-gray-100 animate-pulse flex items-center justify-center">
        <Text c="dimmed">이미지를 불러오는 중입니다...</Text>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Carousel Viewport */}
      <div className="overflow-hidden rounded-xl shadow-2xl" ref={emblaRef}>
        <div className="flex backface-hidden touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex-[0_0_100%] min-w-0 relative h-[500px] sm:h-[600px]"
            >
              <Image
                src={slide.image_url}
                alt={slide.title}
                fill
                priority={index === 0}
                className="select-none object-cover object-center"
                sizes="(max-width: 768px) 100vw, 1200px"
              />

              {/* Overlay with Content - Improved Gradient for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-12">
                <div className="transform transition-all duration-500 translate-y-0 opacity-100 max-w-4xl mx-auto w-full text-center sm:text-left">
                  <h2 className="text-2xl sm:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight drop-shadow-lg font-[family-name:var(--font-geist-sans)] leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-xl text-gray-200 max-w-2xl font-normal leading-relaxed drop-shadow-md opacity-95 mx-auto sm:mx-0">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Visible on Hover/Interaction) */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label="이전 슬라이드"
      >
        <i className="ri-arrow-left-s-line text-2xl"></i>
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label="다음 슬라이드"
      >
        <i className="ri-arrow-right-s-line text-2xl"></i>
      </button>
    </div>
  );
}
