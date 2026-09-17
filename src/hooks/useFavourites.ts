import { useLocalStorage } from "@raycast/utils";

const KEY = "charter-favourites";

export function useFavourites() {
  const { value, setValue, isLoading } = useLocalStorage<string[]>(KEY, []);
  const favourites = value ?? [];

  function isFavourite(id: string): boolean {
    return favourites.includes(id);
  }

  async function toggle(id: string): Promise<boolean> {
    const next = isFavourite(id) ? favourites.filter((item) => item !== id) : [...favourites, id];
    await setValue(next);
    return next.includes(id);
  }

  return { favourites, isFavourite, toggle, isLoading };
}
