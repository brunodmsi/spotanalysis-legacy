import axios from 'axios';
import 'dotenv/config';

console.log(process.env)

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

export default api;
