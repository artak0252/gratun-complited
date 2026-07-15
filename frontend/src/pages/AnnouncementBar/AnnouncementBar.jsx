import React, { useState } from 'react';
import { FiPhoneCall, FiX } from 'react-icons/fi';
import styles from './AnnouncementBar.module.css';

const AnnouncementBar = () => {
          const [isVisible, setIsVisible] = useState(true);

          if (!isVisible) return null;

          return (
                    <div className={styles.announcementBar}>
                              <p className={styles.announcementText}>
                                        Պատվիրի՛ր գրքեր, ստացի՛ր արագ առաքում: +37441736074
                                        <a href="tel:041736074" className={styles.callLink}>
                                                  Պատվիրի՛ր զանգ հիմա <FiPhoneCall />
                                        </a>
                              </p>

                              <button
                                        className={styles.closeBtn}
                                        onClick={() => setIsVisible(false)}
                                        aria-label="Փակել"
                              >
                                        <FiX />
                              </button>
                    </div>
          );
};

export default AnnouncementBar;