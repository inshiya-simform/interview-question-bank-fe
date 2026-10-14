import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { currentUserSchema } from '../type/auth/current-user';
import type { CurrentUser } from '../type/auth/current-user';
import { userPermissionsSchema } from '../type/auth/permissions';
import type { UserPermissions } from '../type/auth/permissions';
import { loginSchema } from '../type/auth/login';
import type { LoginPayload } from '../type/auth/login';
import { registerSchema } from '../type/auth/register';
import type { RegisterPayload } from '../type/auth/register';
import { authResponseSchema } from '../type/auth/shared';
import type { AuthResponse } from '../type/auth/shared';

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, registerSchema.parse(payload));
  return authResponseSchema.parse(data);
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, loginSchema.parse(payload));
  return authResponseSchema.parse(data);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
  return currentUserSchema.parse(data);
}

export async function getUserPermissions(): Promise<UserPermissions> {
  const { data } = await apiClient.get(API_ENDPOINTS.AUTH.PERMISSIONS);
  return userPermissionsSchema.parse(data);
}
