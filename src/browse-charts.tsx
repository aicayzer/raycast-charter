import { useMemo } from "react";
import ChartGrid from "./components/ChartGrid";
import ChartList from "./components/ChartList";
import { CHARTS } from "./data/charts";
import { useFavourites } from "./hooks/useFavourites";
import { useProviderFilter } from "./hooks/useProviderFilter";
import { useViewMode } from "./hooks/useViewMode";
import { matchesFilter } from "./lib/catalogue";
import { buildSections } from "./lib/sections";

export default function BrowseCharts() {
  const [filter, setFilter] = useProviderFilter();
  const { viewMode, setViewMode, showDetail, setShowDetail, columns, setColumns } = useViewMode();
  const { favourites, isFavourite, toggle, isLoading } = useFavourites();

  const sections = useMemo(() => {
    const visible = CHARTS.filter((chart) => matchesFilter(chart, filter));
    return buildSections(visible, favourites);
  }, [filter, favourites]);

  const browseProps = {
    sections,
    isLoading,
    isFavourite,
    onToggleFavourite: toggle,
    filter,
    onFilterChange: setFilter,
    viewMode,
    onViewModeChange: setViewMode,
    showDetail,
    onToggleDetail: () => setShowDetail(!showDetail),
    columns,
    onColumnsChange: setColumns,
  };

  return viewMode === "grid" ? <ChartGrid {...browseProps} /> : <ChartList {...browseProps} />;
}
