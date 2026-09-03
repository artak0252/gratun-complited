import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { AuthContext } from '../../context/AuthContext.jsx';
import { FavoritesContext } from '../../context/FavoritesContext.jsx';
import { CartContext } from '../../context/CartContext.jsx';
import logo from '../../assets/gratun-logo.png';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="relative z-[1000] w-full bg-[#E4E8F0] border-b-[5px] border-white px-10 py-2.5 box-border max-lg:px-6 max-lg:py-4 max-[480px]:px-4 max-[480px]:py-3.5">
      <div className="relative flex items-center gap-7 max-w-[1400px] mx-auto max-md:flex-wrap">
        <div>
          <Link to="/" className="flex items-center no-underline whitespace-nowrap">
            <img src={logo} alt="Գրատուն" className="h-[60px] w-auto block object-contain max-[480px]:h-[42px]" />
          </Link>
        </div>

        <div className="flex items-center flex-1 gap-5 max-md:gap-4 max-[480px]:gap-3">
          <nav
            className={`flex items-baseline justify-center flex-1 gap-5 max-lg:gap-3.5 max-md:flex-col max-md:items-start max-md:gap-0 max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:bg-[#E4E8F0] max-md:border-t max-md:border-white max-md:shadow-[0_8px_16px_rgba(58,50,44,0.08)] max-md:overflow-hidden max-md:transition-[max-height,opacity] max-md:duration-300 max-md:ease-in-out ${isOpen ? 'max-md:max-h-[500px] max-md:opacity-100 max-md:visible' : 'max-md:max-h-0 max-md:opacity-0 max-md:invisible'}`}
          >
            <Link to="/" className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base" onClick={() => setIsOpen(false)}>Գլխավոր</Link>
            <Link to="/shop" className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base" onClick={() => setIsOpen(false)}>Գրքեր</Link>
            <Link to="/blog" className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base" onClick={() => setIsOpen(false)}>Բլոգ</Link>
            <Link
              to="/quotes"
              className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base flex flex-col items-center leading-[1.15] text-center max-md:flex-row max-md:items-start max-md:text-left"
              onClick={() => setIsOpen(false)}
            >
              Մեջբերումներ
            </Link>
            <Link to="/literature" className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base" onClick={() => setIsOpen(false)}>Գրականություն</Link>
            <Link to="/thematic" className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base" onClick={() => setIsOpen(false)}>Թեմատիկ</Link>
            <Link to="/contact" className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base" onClick={() => setIsOpen(false)}>Հետադարձ կապ</Link>
            <Link to="/about" className="text-base font-medium tracking-[0.2px] text-[#3A322C] no-underline whitespace-nowrap transition-colors duration-200 hover:text-[#6B3245] max-lg:text-[13px] max-md:w-full max-md:px-6 max-md:py-3.5 max-md:border-b max-md:border-white max-md:text-base" onClick={() => setIsOpen(false)}>Մեր մասին</Link>
          </nav>

          <button
            className="hidden ml-auto bg-transparent border-none text-[28px] text-[#6B3245] cursor-pointer p-1 max-md:block max-md:order-3"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>

          <Link
            to="/favorites"
            aria-label="Հավանածներ"
            className="relative flex items-center justify-center w-10 h-10 border-[1.5px] border-[#6B3245] rounded-lg text-[#6B3245] no-underline text-[19px] transition-colors duration-200 hover:bg-[#6B3245] hover:text-white max-[480px]:w-[34px] max-[480px]:h-[34px] max-[480px]:text-base"
          >
            <FiHeart />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#14315C] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Զամբյուղ"
            className="relative flex items-center justify-center w-10 h-10 border-[1.5px] border-[#6B3245] rounded-lg text-[#6B3245] no-underline text-[19px] transition-colors duration-200 hover:bg-[#6B3245] hover:text-white max-[480px]:w-[34px] max-[480px]:h-[34px] max-[480px]:text-base"
          >
            <FiShoppingBag />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#14315C] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              aria-label="Դուրս գալ"
              className="flex items-center gap-1.5 h-10 px-3 border-[1.5px] border-[#6B3245] rounded-lg text-[#6B3245] bg-transparent no-underline text-lg leading-none cursor-pointer transition-colors duration-200 hover:bg-[#6B3245] hover:text-white max-[480px]:h-[34px] max-[480px]:px-2 max-[480px]:text-[15px] max-[480px]:gap-1 [&>svg]:block [&>svg:last-child]:text-[0.85em]"
            >
              <VscAccount />
              <IoIosLogOut />
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              aria-label="Մուտք"
              className="flex items-center gap-1.5 h-10 px-3 border-[1.5px] border-[#6B3245] rounded-lg text-[#6B3245] bg-transparent no-underline text-lg leading-none cursor-pointer transition-colors duration-200 hover:bg-[#6B3245] hover:text-white max-[480px]:h-[34px] max-[480px]:px-2 max-[480px]:text-[15px] max-[480px]:gap-1 [&>svg]:block [&>svg:last-child]:text-[0.85em]"
            >
              <VscAccount />
              <CiLogout />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;