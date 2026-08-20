import React, { useState } from 'react';
import { FiPhoneCall, FiX } from 'react-icons/fi';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative z-[999] w-full box-border bg-[#14315C] px-10 py-2.5 flex items-center justify-center gap-6 font-[Noto_Sans_Armenian,Montserrat,sans-serif] border-b-[5px] border-white max-[640px]:px-4 max-[640px]:gap-3">
      <p className="m-0 flex flex-wrap items-center justify-center gap-2.5 text-white text-[15px] font-medium text-center max-[640px]:text-[13px]">
        Պատվիրի՛ր գրքեր, ստացի՛ր արագ առաքում: +37443736074
        <a
          href="tel:043736074"
          className="inline-flex items-center gap-1.5 text-white font-semibold no-underline border-b border-[rgba(58,50,44,0.4)] transition-opacity duration-200 hover:opacity-70"
        >
          Պատվիրի՛ր զանգ հիմա <FiPhoneCall />
        </a>
      </p>

      <button
        className="absolute right-6 bg-none border-none text-[#f5f3f2] text-lg leading-none cursor-pointer flex items-center justify-center p-1 transition-opacity duration-200 hover:opacity-70 max-[640px]:static max-[640px]:ml-1"
        onClick={() => setIsVisible(false)}
        aria-label="Փակել"
      >
        <FiX />
      </button>
    </div>
  );
};

export default AnnouncementBar;
