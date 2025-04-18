"use client";
import { Novel } from "@/lib/apis/api";
import { fallbackImage } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
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

type NovelSliderProps = {
  sliderData: Novel[];
  priorityImage?: boolean;
};

const NovelSlider = memo(function NovelSlider({
  sliderData,
  priorityImage = false,
}: NovelSliderProps) {
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef(null);

  // Chỉ load swiper ở client side để tránh hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Hiển thị placeholder ở server-side
    return (
      <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="w-3/4 h-full bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
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
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 10,
            effect: "slide",
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
            effect: "coverflow",
          },
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="w-full relative"
        ref={swiperRef}
      >
        {sliderData.slice(0, 5).map((novel, index) => (
          <SwiperSlide key={novel._id} className="w-full sm:w-auto">
            {({ isActive }) => (
              <div
                className={`transition-all duration-300 ${
                  isActive ? "scale-100" : "scale-95 opacity-80"
                }`}
              >
                <Link
                  href={`/novel/${novel.slug}`}
                  className="block cursor-pointer"
                >
                  <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={novel.cover || novel.thumb || fallbackImage}
                      alt={novel.title || novel.name}
                      width={800}
                      height={500}
                      priority={index === 1 && priorityImage}
                      loading={index === 1 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3 sm:p-4 md:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white line-clamp-2">
                        {novel.title || novel.name}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm md:text-base line-clamp-2 mt-1 md:mt-2">
                        {novel.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </SwiperSlide>
        ))}

        <div className="swiper-button-prev !hidden sm:!flex !text-white !bg-black/30 !w-8 !h-8 sm:!w-10 sm:!h-10 !rounded-full grid place-items-center !-left-1 md:!left-4 !after:text-xs sm:!after:text-lg"></div>
        <div className="swiper-button-next !hidden sm:!flex !text-white !bg-black/30 !w-8 !h-8 sm:!w-10 sm:!h-10 !rounded-full grid place-items-center !-right-1 md:!right-4 !after:text-xs sm:!after:text-lg"></div>
      </Swiper>
    </div>
  );
});

export default NovelSlider;
