import { useCachedState } from "@raycast/utils";
import type { Lens } from "../lib/catalogue";

/** The search-bar lens, remembered between launches. */
export function useLens() {
  return useCachedState<Lens>("charter-lens", "all");
}
