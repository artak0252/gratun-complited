import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import styles from './BlogShowcase.module.css';

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
                    <section className={styles.blogSection}>
                              <div className={styles.contentWrapper}>
                                        <div className={styles.sectionHeader}>
                                                  <h2 className={styles.sectionTitle}>Մեր Բլոգից</h2>
                                                  <p className={styles.sectionSubtitle}>Հոդվածներ, մտորումներ և պատմություններ</p>
                                        </div>

                                        <div className={styles.postsRow}>
                                                  {posts.map(post => (
                                                            <Link to={`/blog/${post._id}`} key={post._id} className={styles.postCard}>
                                                                      <div className={styles.imageWrapper}>
                                                                                <img
                                                                                          src={post.image.startsWith('http') ? post.image : `https://ik.imagekit.io/hmtd5pr9d/${post.image}`}
                                                                                          alt={post.title}
                                                                                          onError={(e) => { e.target.style.display = 'none'; }}
                                                                                />
                                                                      </div>
                                                                      <h3 className={styles.postTitle}>{post.title}</h3>
                                                                      <p className={styles.postExcerpt}>{post.excerpt}</p>
                                                                      <span className={styles.readMore}>Կարդալ ավելին →</span>
                                                            </Link>
                                                  ))}
                                        </div>

                                        <Link to="/blog" className={styles.allPostsBtn}>Բոլոր հոդվածները</Link>
                              </div>
                    </section>
          );
};

export default BlogShowcase;