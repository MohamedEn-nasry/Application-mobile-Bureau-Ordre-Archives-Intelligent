import axios, { AxiosRequestConfig } from 'axios';
import { tokenStorage } from '../storage/tokenStorage';

const API_BASE_URL = 'http://localhost:5151/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(async config => {
  const token = await tokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const isFormData =
    typeof FormData !== 'undefined' && config.data instanceof FormData;

  if (isFormData) {
    // مهم: لا نضع Content-Type يدوياً مع FormData
    // المتصفح/axios سيضيف boundary تلقائياً
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

const unwrap = <T>(response: any): T => response.data as T;

export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, config);
    return unwrap<T>(response);
  },

  async post<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.post<T>(url, body, config);
    return unwrap<T>(response);
  },

  async put<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.put<T>(url, body, config);
    return unwrap<T>(response);
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config);
    return unwrap<T>(response);
  },

  async postFormData<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await axiosInstance.post<T>(url, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        Accept: 'application/json',
        // لا تضع Content-Type هنا
      },
    });

    return unwrap<T>(response);
  },
};