import React, { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
          const [favorites, setFavorites] = useState(() => {
                    const localData = localStorage.getItem('favorites');
                    return localData ? JSON.parse(localData) : [];
          });

          useEffect(() => {
                    localStorage.setItem('favorites', JSON.stringify(favorites));
          }, [favorites]);

          const isFavorite = (bookId) => favorites.some((item) => item._id === bookId);

          const toggleFavorite = (book) => {
                    setFavorites((prevItems) => {
                              const exists = prevItems.find((item) => item._id === book._id);
                              if (exists) {
                                        return prevItems.filter((item) => item._id !== book._id);
                              }
                              return [...prevItems, book];
                    });
          };

          const removeFavorite = (bookId) => {
                    setFavorites((prevItems) => prevItems.filter((item) => item._id !== bookId));
          };

          return (
                    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
                              {children}
                    </FavoritesContext.Provider>
          );
};