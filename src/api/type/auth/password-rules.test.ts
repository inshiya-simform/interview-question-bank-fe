import { describe, expect, it } from 'vitest';
import { MESSAGES } from '@/constants';
import { changePasswordSchema } from './change-password';
import { registerFormSchema } from './register';
import { resetPasswordFormSchema } from './reset-password';

const messages = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues.map((issue) => issue.message) ?? [];

describe('new password rules', () => {
  const blank = '        ';

  it('rejects a password with whitespace on reset', () => {
    const result = resetPasswordFormSchema.safeParse({ password: blank, confirmPassword: blank });
    expect(messages(result)).toContain(MESSAGES.PASSWORD_HAS_WHITESPACE);
  });

  it('rejects it on register', () => {
    const result = registerFormSchema.safeParse({
      name: 'A',
      email: 'a@b.co',
      password: blank,
      confirmPassword: blank,
    });
    expect(messages(result)).toContain(MESSAGES.PASSWORD_HAS_WHITESPACE);
  });

  it('rejects it on change, but accepts a whitespace current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: blank,
      password: blank,
      confirmPassword: blank,
    });
    expect(messages(result)).toEqual([MESSAGES.PASSWORD_HAS_WHITESPACE]);
  });

  it('still reports a mismatch alongside valid passwords', () => {
    const result = resetPasswordFormSchema.safeParse({
      password: 'longenough1',
      confirmPassword: 'different1',
    });
    expect(messages(result)).toEqual([MESSAGES.PASSWORDS_DO_NOT_MATCH]);
  });
});
