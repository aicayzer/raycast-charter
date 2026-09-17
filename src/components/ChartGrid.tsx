import { Grid } from "@raycast/api";
import type { ViewMode } from "../hooks/useViewMode";
import { providerLabel, searchKeywords, type ProviderFilter } from "../lib/catalogue";
import type { ChartSection } from "../lib/sections";
import { tileContent } from "../lib/thumbnails";
import ChartActions from "./ChartActions";
import ProviderDropdown from "./ProviderDropdown";

export interface BrowseProps {
  sections: ChartSection[];
  isLoading: boolean;
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => Promise<boolean>;
  filter: ProviderFilter;
  onFilterChange: (filter: ProviderFilter) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showDetail: boolean;
  onToggleDetail: () => void;
  columns: number;
  onColumnsChange: (columns: number) => void;
}

export default function ChartGrid(props: BrowseProps) {
  const {
    sections,
    isLoading,
    isFavourite,
    onToggleFavourite,
    filter,
    onFilterChange,
    viewMode,
    onViewModeChange,
    showDetail,
    onToggleDetail,
    columns,
    onColumnsChange,
  } = props;

  return (
    <Grid
      isLoading={isLoading}
      columns={columns}
      aspectRatio="3/2"
      fit={Grid.Fit.Contain}
      searchBarPlaceholder="Search chart types"
      searchBarAccessory={<ProviderDropdown value={filter} onChange={onFilterChange} />}
    >
      {sections.map((section) => (
        <Grid.Section key={section.id} title={section.title}>
          {section.charts.map((chart) => (
            <Grid.Item
              key={`${section.id}-${chart.id}`}
              content={tileContent(chart)}
              title={chart.name}
              subtitle={providerLabel(chart, filter)}
              keywords={searchKeywords(chart)}
              actions={
                <ChartActions
                  chart={chart}
                  isFavourite={isFavourite(chart.id)}
                  onToggleFavourite={onToggleFavourite}
                  browse={{
                    viewMode,
                    onSwitchView: () => onViewModeChange("list"),
                    showDetail,
                    onToggleDetail,
                    columns,
                    onColumnsChange,
                  }}
                />
              }
            />
          ))}
        </Grid.Section>
      ))}
    </Grid>
  );
}
