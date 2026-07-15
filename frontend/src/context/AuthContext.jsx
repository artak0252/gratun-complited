import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosInstance';

export const AuthContext = createContext();

// Token-ն այլևս localStorage-ում չենք պահում (httpOnly cookie-ի մեջ է, JS-ը
// ուղղակի մուտք չունի դրան՝ XSS-ից պաշտպանվելու համար).
// Փոխարենը page load-ի ժամանակ /api/me-ին հարցում ենք անում, որպեսզի
// սերվերն ինքն ասի՝ արդյոք cookie-ն վավեր է, և ինչ role ունի օգտատերը։
export const AuthProvider = ({ children }) => {
          const [role, setRole] = useState(null); // null | 'admin' | 'author'
          const [checked, setChecked] = useState(false); // /api/me-ի առաջին ստուգումն ավարտվա՞ծ է

          const refreshAuth = useCallback(async () => {
                    try {
                              const res = await api.get('/me');
                              setRole(res.data.role || null);
                    } catch {
                              setRole(null);
                    } finally {
                              setChecked(true);
                    }
          }, []);

          useEffect(() => {
                    refreshAuth();
          }, [refreshAuth]);

          const logout = useCallback(async () => {
                    try {
                              await api.post('/logout');
                    } catch {
                              // անգամ եթե logout հարցումը ձախողվի, տեղում role-ը մաքրում ենք
                    }
                    setRole(null);
          }, []);

          // Value-ն memoize ենք անում, որպեսզի role/checked-ը չփոխվելու դեպքում
          // Context-ից կախված բոլոր component-ները ավելորդ re-render չկրեն
          const value = useMemo(
                    () => ({
                              role,
                              isAdmin: role === 'admin',
                              isLoggedIn: !!role,
                              checked,
                              refreshAuth,
                              logout,
                    }),
                    [role, checked, refreshAuth, logout]
          );

          return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};