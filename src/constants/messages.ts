import { PASSWORD_MIN_LENGTH } from './validation';

export const MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Enter a valid email address',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_LONG: 'Name is too long',
} as const;

export const COMMON_COPY = {
  LOADING: 'Loading',
} as const;

export const AUTH_COPY = {
  APP_NAME: 'Interview Question Bank',
  LOGIN_TITLE: 'Welcome back',
  LOGIN_SUBTITLE: 'Log in to find and share interview questions.',
  LOGIN_SUBMIT: 'Log in',
  LOGIN_SWITCH_PROMPT: 'New here?',
  LOGIN_SWITCH_LINK: 'Create an account',
  REGISTER_TITLE: 'Create your account',
  REGISTER_SUBTITLE: 'Join to browse and contribute questions.',
  REGISTER_SUBMIT: 'Create account',
  REGISTER_SWITCH_PROMPT: 'Already have an account?',
  REGISTER_SWITCH_LINK: 'Log in',
  FIELD_EMAIL: 'Email',
  FIELD_PASSWORD: 'Password',
  FIELD_NAME: 'Name',
  PASSWORD_HINT: `At least ${PASSWORD_MIN_LENGTH} characters`,
  SHOW_PASSWORD: 'Show password',
  HIDE_PASSWORD: 'Hide password',
} as const;
