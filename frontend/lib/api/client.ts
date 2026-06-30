import axios from 'axios';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST!;

export const apiClient = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});