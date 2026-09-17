import { Grid } from "@raycast/api";
import type { ViewMode } from "../hooks/useViewMode";
import { mermaidTag, searchKeywords, type ChartType } from "../lib/catalogue";
import type { ChartSection } from "../lib/sections";
import { tileContent } from "../lib/thumbnails";
import ChartActions from "./ChartActions";
import ViewDropdown from "./ViewDropdown";

export interface BrowseProps {
  sections: ChartSection[];
  isLoading: boolean;
  isFavourite: (id: string) => boolean;
  onToggleFavourite: (id: string) => Promise<boolean>;
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
    viewMode,
    onViewModeChange,
    showDetail,
    onToggleDetail,
    columns,
    onColumnsChange,
  } = props;

  function subtitle(chart: ChartType): string | undefined {
    return mermaidTag(chart) ?? (chart.shadcn ? "shadcn" : chart.echarts ? "ECharts" : undefined);
  }

  return (
    <Grid
      isLoading={isLoading}
      columns={columns}
      aspectRatio="3/2"
      fit={Grid.Fit.Contain}
      searchBarPlaceholder="Search chart types"
      searchBarAccessory={<ViewDropdown value={viewMode} onChange={onViewModeChange} />}
    >
      {sections.map((section) => (
        <Grid.Section key={section.id} title={section.title} subtitle={String(section.charts.length)}>
          {section.charts.map((chart) => (
            <Grid.Item
              key={`${section.id}-${chart.id}`}
              content={tileContent(chart)}
              title={chart.name}
              subtitle={subtitle(chart)}
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
