import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';

const BLOG_COUNT = 3;

const BlogShowcase = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => (a._id < b._id ? 1 : -1));
        setPosts(sorted.slice(0, BLOG_COUNT));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Եթե դեռ բեռնվում է կամ հոդվածներ չկան, բաժինը ընդհանրապես չի ցուցադրվում
  if (loading || posts.length === 0) return null;

  return (
    <section className="w-full bg-[#E4E8F0] px-[8%] pt-[45px] pb-[50px] box-border border-b-[5px] border-white max-[480px]:px-[5%] max-[480px]:pt-[30px] max-[480px]:pb-[35px]">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-[30px]">
        <div className="text-center max-w-[620px]">
          <h2 className="font-['Playfair_Display','Noto_Serif_Armenian',Georgia,serif] text-[30px] font-bold text-[#14315C] mb-2 leading-[1.2] max-md:text-2xl max-[480px]:text-xl">
            Մեր Բլոգից
          </h2>
          <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[15px] text-[#14315C] opacity-80 m-0">
            Հոդվածներ, մտորումներ և պատմություններ
          </p>
        </div>

        <div className="grid grid-cols-[repeat(3,minmax(0,340px))] justify-center gap-[26px] w-full max-lg:grid-cols-[repeat(3,minmax(0,220px))] max-lg:gap-4 max-md:flex max-md:flex-nowrap max-md:overflow-x-auto max-md:justify-start max-md:gap-[14px] max-md:pb-2 max-md:[-webkit-overflow-scrolling:touch]">
          {posts.map(post => (
            <Link
              to={`/blog/${post._id}`}
              key={post._id}
              className="group bg-white border border-[rgba(220,213,200,0.5)] rounded-2xl p-4 flex flex-col text-left no-underline shadow-[0_6px_14px_rgba(58,50,44,0.08)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1.5 hover:shadow-[0_14px_26px_rgba(58,50,44,0.15)] max-md:flex-[0_0_240px] max-[480px]:flex-[0_0_200px] max-[480px]:p-3"
            >
              <div className="w-full aspect-[16/10] overflow-hidden rounded-[10px] mb-3.5 bg-[#E4E8F0]">
                <img
                  src={post.image.startsWith('http') ? post.image : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`}
                  alt={post.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="w-full h-full object-cover block"
                />
              </div>
              <h3 className="font-['Playfair_Display','Noto_Serif_Armenian',Georgia,serif] text-[18px] font-bold text-[#2A2A2A] mb-2 leading-[1.35] max-[480px]:text-base">
                {post.title}
              </h3>
              <p className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[13px] text-[#4A4A4A] opacity-90 leading-[1.5] mb-3 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
                {post.excerpt}
              </p>
              <span className="font-[Poppins,Noto_Sans_Armenian,sans-serif] text-[13px] font-semibold text-[#6B3245] mt-auto group-hover:text-[#8A4E63]">
                Կարդալ ավելին →
              </span>
            </Link>
          ))}
        </div>

        <Link
          to="/blog"
          className="inline-block bg-[#14315C] text-white font-[Poppins,Noto_Sans_Armenian,sans-serif] font-semibold text-[15px] px-[30px] py-3 rounded-lg no-underline transition-[background-color,color] duration-200 hover:bg-[#6B3245] hover:text-white"
        >
          Բոլոր հոդվածները
        </Link>
      </div>
    </section>
  );
};

export default BlogShowcase;
