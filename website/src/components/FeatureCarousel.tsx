import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export interface FeatureSlide {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface FeatureCarouselProps {
  slides: FeatureSlide[];
}

export const FeatureCarousel: React.FC<FeatureCarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div data-testid="feature-carousel" className="relative w-full max-w-7xl mx-auto px-4 sm:px-12 py-12">
      <div className="flex flex-col gap-12 items-center">
        {/* Text */}
        <div className="text-center space-y-4 max-w-2xl px-4">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 transition-all duration-300">
            {slides[currentIndex].title}
          </h3>
          <p className="text-lg text-gray-500 leading-relaxed transition-all duration-300">
            {slides[currentIndex].description}
          </p>
        </div>

        {/* Visual + Outside Controls */}
        <div className="relative w-full flex items-center gap-2 sm:gap-8">
          {/* Previous Button (Outside) */}
          <button 
            onClick={prevSlide}
            aria-label="Previous feature"
            className="flex-shrink-0 p-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-full shadow-lg border border-gray-100 transition-all hover:scale-110 active:scale-95 hidden md:flex"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Visual Container */}
          <div className="relative flex-1 aspect-video bg-gray-50 rounded-3xl border border-gray-200 shadow-2xl overflow-hidden bg-white">
            <div className="w-full h-full flex items-center justify-center demo-no-max-width">
              {slides[currentIndex].content}
            </div>
          </div>

          {/* Next Button (Outside) */}
          <button 
            onClick={nextSlide}
            aria-label="Next feature"
            className="flex-shrink-0 p-3 bg-white hover:bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-full shadow-lg border border-gray-100 transition-all hover:scale-110 active:scale-95 hidden md:flex"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Mobile / Tablet Controls (shown below on small screens) */}
        <div className="flex md:hidden gap-8">
          <button 
            onClick={prevSlide}
            aria-label="Previous feature"
            className="p-3 bg-white text-gray-800 rounded-full shadow-md border border-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Next feature"
            className="p-3 bg-white text-gray-800 rounded-full shadow-md border border-gray-100"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={clsx(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === idx ? "bg-indigo-600 w-6" : "bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};