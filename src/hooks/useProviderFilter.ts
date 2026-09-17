import { useCachedState } from "@raycast/utils";
import type { ProviderFilter } from "../lib/catalogue";

/** The search-bar filter, remembered between launches. */
export function useProviderFilter() {
  return useCachedState<ProviderFilter>("charter-provider", "all");
}
