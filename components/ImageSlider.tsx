
'use client';

import { useState, useEffect, useRef } from 'react';
import { SlideImage } from '../lib/supabase';

interface ImageSliderProps {
  slides: SlideImage[];
}

export default function ImageSlider({ slides }: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length, isClient]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    
    const diffX = startXRef.current - currentXRef.current;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // 왼쪽으로 스와이프 - 다음 슬라이드
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        // 오른쪽으로 스와이프 - 이전 슬라이드
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }

    isDraggingRef.current = false;
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = e.clientX;
  };

  const handleMouseEnd = () => {
    if (!isDraggingRef.current) return;
    
    const diffX = startXRef.current - currentXRef.current;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }

    isDraggingRef.current = false;
  };

  if (!isClient || slides.length === 0) {
    return (
      <div className="w-full h-64 rounded-xl bg-gray-200 mb-8 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">이미지 로딩 중...</div>
      </div>
    );
  }

  return (
    <div 
      ref={sliderRef}
      className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-8 cursor-grab active:cursor-grabbing select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseStart}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseEnd}
      onMouseLeave={handleMouseEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
            <div className="text-white">
              <h3 className="text-lg font-bold mb-2 whitespace-nowrap">{slide.title}</h3>
              <p className="text-sm opacity-90">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      {/* 인디케이터 */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
