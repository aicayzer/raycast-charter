import { List } from "@raycast/api";
import { PROVIDERS } from "../data/providers";
import { mermaidTag, searchKeywords, type ChartType } from "../lib/catalogue";
import { thumbnailMarkdown } from "../lib/thumbnails";
import ChartActions from "./ChartActions";
import type { BrowseProps } from "./ChartGrid";
import ChartMetadata from "./ChartMetadata";
import ProviderDropdown from "./ProviderDropdown";

function accessories(chart: ChartType, compact: boolean): List.Item.Accessory[] {
  const items: List.Item.Accessory[] = [];
  const mermaid = mermaidTag(chart);
  if (mermaid)
    items.push({ tag: { value: compact ? "M" : mermaid, color: PROVIDERS.mermaid.color }, tooltip: mermaid });
  if (chart.shadcn) {
    items.push({
      tag: { value: compact ? "S" : PROVIDERS.shadcn.title, color: PROVIDERS.shadcn.color },
      tooltip: "shadcn",
    });
  }
  if (chart.echarts) {
    items.push({
      tag: { value: compact ? "E" : PROVIDERS.echarts.title, color: PROVIDERS.echarts.color },
      tooltip: "ECharts",
    });
  }
  return items;
}

/** The panel is short, so the thumbnail is fixed at a size that leaves room for the metadata. */
const PANEL_THUMBNAIL = { width: 240, height: 160 };

function panelMarkdown(chart: ChartType): string {
  return `${thumbnailMarkdown(chart, PANEL_THUMBNAIL)}${chart.use}`;
}

export default function ChartList(props: BrowseProps) {
  const {
    sections,
    isLoading,
    isFavourite,
    onToggleFavourite,
    onUse,
    onClearRecent,
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
    <List
      isLoading={isLoading}
      isShowingDetail={showDetail}
      searchBarPlaceholder="Search chart types"
      searchBarAccessory={<ProviderDropdown value={filter} onChange={onFilterChange} />}
    >
      {sections.map((section) => (
        <List.Section key={section.id} title={section.title}>
          {section.charts.map((chart) => (
            <List.Item
              key={`${section.id}-${chart.id}`}
              title={chart.name}
              subtitle={showDetail ? undefined : chart.use}
              keywords={searchKeywords(chart)}
              accessories={accessories(chart, showDetail)}
              detail={<List.Item.Detail markdown={panelMarkdown(chart)} metadata={<ChartMetadata chart={chart} />} />}
              actions={
                <ChartActions
                  chart={chart}
                  isFavourite={isFavourite(chart.id)}
                  onToggleFavourite={onToggleFavourite}
                  onUse={onUse}
                  browse={{
                    onClearRecent,
                    viewMode,
                    onSwitchView: () => onViewModeChange("grid"),
                    showDetail,
                    onToggleDetail,
                    columns,
                    onColumnsChange,
                  }}
                />
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
