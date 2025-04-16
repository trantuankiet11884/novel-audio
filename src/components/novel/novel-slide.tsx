"use client";
import { useState } from "react";

import { Novel } from "@/lib/apis/api";
import Link from "next/link";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { fallbackImage } from "@/utils/constants";

type NovelSliderProps = {
  sliderData: Novel[];
};

export const NovelSlider = ({ sliderData }: NovelSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        initialSlide={1}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 2,
          slideShadows: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="w-full relative"
      >
        {sliderData.map((novel) => (
          <SwiperSlide key={novel._id}>
            {({ isActive }) => (
              <div
                className={`transition-all duration-300 ${
                  isActive ? "scale-100" : "scale-90"
                }`}
              >
                <Link
                  href={`/novel/${novel.slug}`}
                  className="block cursor-pointer"
                >
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                    <Image
                      src={novel.cover || novel.thumb}
                      alt={novel.title || novel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                        {novel.title || novel.name}
                      </h3>
                      <p className="text-white/80 text-sm md:text-base line-clamp-2 mt-1 md:mt-2">
                        {novel.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </SwiperSlide>
        ))}

        <div className="swiper-button-prev !text-white !bg-black/30 !w-10 !h-10 !rounded-full grid place-items-center !-left-1 md:!left-4 !after:text-lg"></div>
        <div className="swiper-button-next !text-white !bg-black/30 !w-10 !h-10 !rounded-full grid place-items-center !-right-1 md:!right-4 !after:text-lg"></div>
      </Swiper>
    </div>
  );
};
