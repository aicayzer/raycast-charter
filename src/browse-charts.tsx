import { Action, ActionPanel, getPreferenceValues, Icon, List, openExtensionPreferences } from "@raycast/api";
import { useMemo } from "react";
import ChartGrid from "./components/ChartGrid";
import ChartList from "./components/ChartList";
import { CHARTS } from "./data/charts";
import { useFavourites } from "./hooks/useFavourites";
import { useViewMode } from "./hooks/useViewMode";
import { enabledProviders, isVisible } from "./lib/catalogue";
import { buildSections } from "./lib/sections";

export default function BrowseCharts() {
  const prefs = getPreferenceValues<Preferences>();
  const { viewMode, setViewMode, showDetail, setShowDetail } = useViewMode();
  const { favourites, isFavourite, toggle, isLoading } = useFavourites();

  const sections = useMemo(() => {
    const visible = CHARTS.filter((chart) => isVisible(chart, prefs));
    return buildSections(visible, favourites);
  }, [prefs, favourites]);

  if (enabledProviders(prefs).length === 0) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.BarChart}
          title="No chart providers selected"
          description="Tick Mermaid, shadcn or ECharts in the extension preferences to see the catalogue."
          actions={
            <ActionPanel>
              <Action title="Open Extension Preferences" icon={Icon.Gear} onAction={openExtensionPreferences} />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  const browseProps = {
    sections,
    isLoading,
    isFavourite,
    onToggleFavourite: toggle,
    viewMode,
    onViewModeChange: setViewMode,
    showDetail,
    onToggleDetail: () => setShowDetail(!showDetail),
  };

  return viewMode === "grid" ? <ChartGrid {...browseProps} /> : <ChartList {...browseProps} />;
}
