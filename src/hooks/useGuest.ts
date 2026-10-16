import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { readGuestToken, sanitizeGuestName } from '../utils/guest';

export interface Guest {
  /** Sanitized display name — greeting only, never used for authorization */
  name: string | null;
  /** Opaque token, format-checked only; validated server-side */
  token: string | null;
}

export function useGuest(): Guest {
  const [params] = useSearchParams();
  return useMemo(
    () => ({ name: sanitizeGuestName(params.get('name')), token: readGuestToken(params.get('token')) }),
    [params]
  );
}