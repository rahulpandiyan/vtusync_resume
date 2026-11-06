/**
 * Resolve a user avatar from the various places auth providers place it.
 * Returns '' when none exists — callers fall back to initials.
 */
interface AuthUserLike {
  user_metadata?: {
    avatar_url?: string;
    picture?: string;
    avatar?: string;
    [key: string]: unknown;
  };
}

export function getAvatarSrc(user: AuthUserLike | null | undefined): string {
  const meta = user?.user_metadata;
  if (!meta) return '';
  return (
    (typeof meta.avatar_url === 'string' ? meta.avatar_url : '') ||
    (typeof meta.picture === 'string' ? meta.picture : '') ||
    (typeof meta.avatar === 'string' ? meta.avatar : '')
  );
}
