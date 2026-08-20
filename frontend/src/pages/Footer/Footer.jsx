import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";

const headingClass = "font-[Georgia,'Noto_Serif_Armenian','Times_New_Roman',serif] text-[#3A322C] text-xl font-bold mb-[18px] relative pb-2.5 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[34px] after:h-[3px] after:rounded-sm after:bg-[#3A322C] after:opacity-70 max-[560px]:after:left-1/2 max-[560px]:after:-translate-x-1/2";
const linkClass = "text-[#3A322C] no-underline text-sm transition-[color,padding-left] duration-200 hover:pl-1";

const Footer = () => {
  return (
    <footer className="bg-[#E4E8F0] text-[#3A322C] pt-14 px-10 pb-0 font-[Noto_Sans_Armenian,Montserrat,sans-serif] box-border max-[900px]:pt-12 max-[900px]:px-6 max-[560px]:pt-10 max-[560px]:px-5">
      <div className="max-w-[1300px] mx-auto grid grid-cols-[1.4fr_1fr_1fr] gap-10 pb-10 max-[900px]:grid-cols-2 max-[900px]:gap-8 max-[560px]:grid-cols-1 max-[560px]:gap-7 max-[560px]:text-center">
        <div className="max-[900px]:col-span-full">
          <h3 className={headingClass}>Գրատուն - Հաբ</h3>
          <p className="text-[#3A322C] text-sm leading-[1.7] m-0 max-w-[320px] max-[900px]:max-w-none max-[560px]:max-w-none max-[560px]:mx-auto">
            Բացահայտիր գրքերի կախարդական աշխարհը մեզ հետ:
          </p>
        </div>

        <div>
          <h4 className={headingClass}>Հղումներ</h4>
          <ul className="list-none p-0 m-0">
            <li className="mb-2.5"><Link to="/about" className={linkClass}>Մեր մասին</Link></li>
            <li className="mb-2.5"><Link to="/contact" className={linkClass}>Կապ</Link></li>
            <li className="mb-2.5"><Link to="/blog" className={linkClass}>Բլոգ</Link></li>
            <li className="mb-2.5"><Link to="/terms" className={linkClass}>Պայմաններ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>Հետևեք մեզ</h4>
          <div className="flex gap-3 max-[560px]:justify-center">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(241,236,227,0.1)] text-[#3A322C] text-lg transition-[background-color,color,transform] duration-200 hover:bg-[#3A322C] hover:text-[#6B3245] hover:-translate-y-[3px]"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(241,236,227,0.1)] text-[#3A322C] text-lg transition-[background-color,color,transform] duration-200 hover:bg-[#3A322C] hover:text-[#6B3245] hover:-translate-y-[3px]"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-[rgba(58,50,44,0.15)] py-[18px] text-[13px] text-[rgba(58,50,44,0.6)]">
        <p className="m-0">&copy; {new Date().getFullYear()} Գրատուն. Բոլոր իրավունքները պաշտպանված են:</p>
      </div>
    </footer>
  );
};

export default Footer;
