export type AppRoute =
  | { kind: 'home' }
  | { kind: 'world'; worldId: string }
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'not-found' };

export function getRoute(hash = typeof window === 'undefined' ? '' : window.location.hash): AppRoute {
  const path = hash.replace(/^#/, '').replace(/\/$/, '') || '/';
  if (path === '/') return { kind: 'home' };
  const lesson = path.match(/^\/lesson\/([^/]+)$/);
  if (lesson) return { kind: 'lesson', lessonId: decodeURIComponent(lesson[1]) };
  const world = path.match(/^\/world\/([^/]+)$/);
  if (world) return { kind: 'world', worldId: decodeURIComponent(world[1]) };
  return { kind: 'not-found' };
}

export function routeTo(kind: 'home' | 'world' | 'lesson', id?: string): string {
  if (kind === 'home') return '#/';
  return `#/${kind}/${encodeURIComponent(id ?? '')}`;
}
