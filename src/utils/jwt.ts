import { z } from 'zod';

const jwtPayloadSchema = z.looseObject({ exp: z.number() });

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
}

// Expiry in epoch milliseconds, or null when the token is not a JWT with a numeric `exp`.
// The signature is not checked: this only schedules a refresh, the server is the authority.
export function getJwtExpiryMs(token: string): number | null {
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const parsed = jwtPayloadSchema.safeParse(JSON.parse(decodeBase64Url(payload)));
    return parsed.success ? parsed.data.exp * 1000 : null;
  } catch {
    return null;
  }
}
