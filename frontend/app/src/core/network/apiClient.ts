import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { tokenStorage } from '../storage/tokenStorage';
import { API_BASE_URL } from './api';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// ─── Request interceptor: attach access token ─────────────────────────────
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

// ─── Response interceptor: auto-refresh on 401 ────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401 once per request (avoid infinite loop)
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if this IS the refresh/logout request
    const url = originalRequest.url ?? '';
    if (url.includes('/auth/refresh') || url.includes('/auth/logout')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue requests that arrived while refresh is in progress
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const email = await tokenStorage.getEmail();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!email || !refreshToken) {
        throw new Error('No refresh credentials available');
      }

      // Call refresh endpoint directly (bypass interceptor loop)
      const { data } = await axiosInstance.post('/auth/refresh', {
        email,
        refreshToken,
      });

      const newAccessToken: string = data.accessToken;
      const newRefreshToken: string = data.refreshToken;

      // Persist rotated tokens
      await tokenStorage.setToken(newAccessToken);
      await tokenStorage.setRefreshToken(newRefreshToken);

      processQueue(null, newAccessToken);

      // Retry original request with new token
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      // Clear all tokens so the app navigates back to Login
      await tokenStorage.clearAll();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

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