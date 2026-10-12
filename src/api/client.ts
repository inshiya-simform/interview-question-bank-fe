import axios, { isAxiosError } from 'axios';
import { queryClient } from '@/config/queryClient';
import { HTTP_STATUS, MESSAGES, NETWORK_ERROR_STATUS, ROUTES } from '@/constants';
import { API_ENDPOINTS } from './endpoints';
import { ApiError, extractErrorMessage } from './errors';
import { clearAuthToken, getAuthToken } from './token-storage';

// Credential endpoints return 401 for bad input, which must not be treated as an expired session.
const PUBLIC_PATHS: readonly string[] = [API_ENDPOINTS.AUTH.LOGIN, API_ENDPOINTS.AUTH.REGISTER];

export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error) || !error.response) {
      return Promise.reject(new ApiError(NETWORK_ERROR_STATUS, MESSAGES.ERROR_NETWORK));
    }
    const { status, data } = error.response;
    if (status === HTTP_STATUS.UNAUTHORIZED && !PUBLIC_PATHS.includes(error.config?.url ?? '')) {
      clearAuthToken();
      queryClient.clear();
      window.location.assign(ROUTES.LOGIN);
    }
    return Promise.reject(new ApiError(status, extractErrorMessage(status, data)));
  },
);
