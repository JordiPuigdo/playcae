export function useLastVisited(key: string) {
  const storageKey = `lastVisited_${key}`;
  const set = (id: string) => sessionStorage.setItem(storageKey, id);
  const get = (): string | null => sessionStorage.getItem(storageKey);
  const clear = () => sessionStorage.removeItem(storageKey);
  return { set, get, clear };
}
