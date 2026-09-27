import React from "react";
import { cn } from "@/lib/cn";

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center", className)}>
      {/* Desktop View: Official Ge[earth]Trivia X Logo */}
      <div
        dir="ltr"
        className="hidden sm:flex items-center select-none font-sans font-extrabold text-[#3898ec] tracking-tight leading-none"
      >
        <span className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-[#3898ec]">
          Ge
        </span>

        <img
          src="/images/logo_icon.webp"
          alt="o"
          width={18}
          height={18}
          className="h-[15px] w-[15px] sm:h-[16.5px] sm:w-[16.5px] mx-0.5 object-contain shrink-0 transform translate-y-[1.5px] sm:translate-y-[1.5px]"
          draggable={false}
        />

        <span className="text-xl sm:text-2xl font-bold tracking-tight leading-none text-[#3898ec]">
          Trivia
        </span>

        <div className="ml-1 shrink-0 self-center flex items-center">
          <svg
            viewBox="250 240 520 540"
            className="w-5 h-5 sm:w-6 sm:h-6 text-[#3898ec]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
              fill="currentColor"
              stroke="none"
            >
              <path d="M2967 7550 c-44 -13 -98 -59 -113 -96 -18 -43 -18 -127 0 -163 8 -15 108 -160 222 -322 114 -162 241 -343 284 -404 66 -95 263 -376 539 -767 42 -59 116 -165 166 -235 49 -71 129 -183 177 -251 48 -68 88 -128 88 -133 0 -5 -100 -144 -222 -308 -123 -164 -302 -405 -398 -536 -184 -249 -449 -605 -796 -1070 -115 -154 -215 -291 -223 -305 -22 -39 -31 -101 -20 -143 13 -51 72 -114 117 -127 52 -14 1254 -13 1306 1 76 21 -4 -87 1395 1878 335 470 372 526 363 546 -24 51 -642 1051 -852 1375 -169 263 -408 634 -534 830 -96 150 -119 179 -161 205 l-48 30 -631 2 c-347 1 -644 -2 -659 -7z" />
              <path d="M5997 7546 c-51 -19 -101 -59 -128 -103 -13 -21 -135 -212 -271 -425 -136 -214 -248 -393 -248 -398 0 -13 -5 -6 381 -595 173 -264 328 -501 344 -527 17 -26 32 -47 36 -48 5 0 75 98 274 385 61 88 197 282 301 430 419 594 491 696 588 833 141 198 146 208 146 270 0 69 -28 124 -82 159 l-42 28 -630 2 c-510 2 -638 0 -669 -11z" />
              <path d="M6119 4772 c-50 -74 -611 -855 -695 -969 -30 -40 -54 -74 -54 -77 0 -4 638 -898 687 -963 14 -18 48 -43 76 -58 l51 -25 632 0 c423 0 642 4 661 11 34 13 80 55 99 91 16 31 19 115 4 153 -5 14 -141 203 -302 418 -455 611 -625 839 -753 1012 -65 88 -162 219 -215 290 -53 72 -105 142 -114 158 -10 15 -21 27 -25 27 -3 -1 -27 -31 -52 -68z" />
            </g>
          </svg>
        </div>
      </div>

      {/* Mobile View: Only 1 Earth Icon of the app */}
      <img
        src="/images/logo_icon.webp"
        alt="GeoTrivia X"
        width={32}
        height={32}
        className="size-8 object-contain rounded-lg block sm:hidden"
        draggable={false}
      />
    </div>
  );
};
