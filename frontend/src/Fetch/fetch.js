import axios from 'axios';

const publicFetch = axios.create({
    baseURL: "/api"
});

export { publicFetch };