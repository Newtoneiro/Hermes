import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext/Authcontext';

const FetchContext = createContext();
const { Provider } = FetchContext;

const FetchProvider = ({ children }) => {
    const authCon = useContext(AuthContext);
    const authFetch = axios.create({
        baseURL: "http://localhost:8080",
    });

    authFetch.interceptors.request.use(
        config => {
        config.headers.Authorization = `Bearer ${authCon.authState.token}`;
        config.headers.issuer = "api-hermes";
        config.headers.audience = "api-hermes";
        return config;
        },
        error => {
        return Promise.reject(error);
        }
    );

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
