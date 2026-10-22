import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { currentUserSchema } from '../type/auth/current-user';
import type { CurrentUser } from '../type/auth/current-user';
import { userPermissionsSchema } from '../type/auth/permissions';
import type { UserPermissions } from '../type/auth/permissions';
import { forgotPasswordSchema, messageResponseSchema } from '../type/auth/forgot-password';
import type { ForgotPasswordPayload, MessageResponse } from '../type/auth/forgot-password';
import {
  resetPasswordSchema,
  verifyResetTokenResponseSchema,
  verifyResetTokenSchema,
} from '../type/auth/reset-password';
import type { ResetPasswordPayload, VerifyResetTokenResponse } from '../type/auth/reset-password';
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

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    forgotPasswordSchema.parse(payload),
  );
  return messageResponseSchema.parse(data);
}

export async function verifyResetToken(token: string): Promise<VerifyResetTokenResponse> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN,
    verifyResetTokenSchema.parse({ token }),
  );
  return verifyResetTokenResponseSchema.parse(data);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
  const { data } = await apiClient.post(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    resetPasswordSchema.parse(payload),
  );
  return messageResponseSchema.parse(data);
}
