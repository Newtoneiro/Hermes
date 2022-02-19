import axios from 'axios';

const publicFetch = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

export { publicFetch };