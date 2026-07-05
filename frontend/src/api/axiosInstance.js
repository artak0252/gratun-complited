import axios from 'axios';

// Մեկ, ընդհանուր axios instance ամբողջ հավելվածի համար.
// - withCredentials: true → cookie-ն (JWT-ն) ինքնաշխատ ուղարկվում/ընդունվում է
//   ամեն հարցումով, մենք այլևս ձեռքով Authorization header չենք ավելացնում։
// - X-Requested-With header-ը state-փոփոխող հարցումների վրա անհրաժեշտ է backend-ի
//   CSRF-պաշտպանության համար (տես server.js-ի middleware-ը)։
const api = axios.create({
          baseURL: '/api',
          withCredentials: true,
});

api.interceptors.request.use((config) => {
          const method = (config.method || 'get').toLowerCase();
          if (['post', 'put', 'delete', 'patch'].includes(method)) {
                    config.headers = config.headers || {};
                    config.headers['X-Requested-With'] = 'XMLHttpRequest';
          }
          return config;
});

export default api;