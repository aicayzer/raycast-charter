import { useCachedState } from "@raycast/utils";

export type ViewMode = "grid" | "list";

/**
 * The view choice is shared by the search-bar dropdown and the switch action,
 * so it lives in cached state rather than the dropdown's own storeValue.
 */
export function useViewMode() {
  const [viewMode, setViewMode] = useCachedState<ViewMode>("charter-view", "grid");
  const [showDetail, setShowDetail] = useCachedState<boolean>("charter-list-detail", true);
  return { viewMode, setViewMode, showDetail, setShowDetail };
}
