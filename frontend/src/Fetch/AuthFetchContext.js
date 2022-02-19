import React, { createContext, useEffect } from 'react';
import axios from 'axios';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
    const authFetch = axios.create({
      withCredentials: true,
      baseURL: "/api",
    });

    useEffect(() => {
      const getCsrfToken = async () => {
        const {data} = await authFetch.get('/csrf-token')
        authFetch.defaults.headers['X-CSRF-Token'] = data.csrfToken;
      }

      getCsrfToken();
    }, [authFetch])

  authFetch.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const code =
        error && error.response ? error.response.status : 0;
      if (code === 401 || code === 403) {
        console.log('error code', code);
      }
      return Promise.reject(error);
    }
  );

  return (
    <Provider
      value={{
        authFetch
      }}
    >
      {children}
    </Provider>
  );
};

export { FetchContext, FetchProvider };
