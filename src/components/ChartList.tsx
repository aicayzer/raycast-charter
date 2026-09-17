import { Color, List } from "@raycast/api";
import { familyInfo } from "../data/families";
import { PROVIDERS } from "../data/providers";
import { mermaidTag, searchKeywords, type ChartType } from "../lib/catalogue";
import { thumbnailMarkdown } from "../lib/thumbnails";
import ChartActions from "./ChartActions";
import type { BrowseProps } from "./ChartGrid";
import ChartMetadata from "./ChartMetadata";
import ViewDropdown from "./ViewDropdown";

function accessories(chart: ChartType, compact: boolean): List.Item.Accessory[] {
  const items: List.Item.Accessory[] = [];
  const mermaid = mermaidTag(chart);
  if (mermaid)
    items.push({ tag: { value: compact ? "M" : mermaid, color: PROVIDERS.mermaid.color }, tooltip: mermaid });
  if (chart.shadcn) {
    items.push({
      tag: { value: compact ? "S" : PROVIDERS.shadcn.title, color: Color.SecondaryText },
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

function panelMarkdown(chart: ChartType): string {
  return `${thumbnailMarkdown(chart)}${chart.use}`;
}

export default function ChartList(props: BrowseProps) {
  const {
    sections,
    isLoading,
    isFavourite,
    onToggleFavourite,
    viewMode,
    onViewModeChange,
    showDetail,
    onToggleDetail,
  } = props;

  return (
    <List
      isLoading={isLoading}
      isShowingDetail={showDetail}
      searchBarPlaceholder="Search chart types, e.g. spider, sankey, org chart"
      searchBarAccessory={<ViewDropdown value={viewMode} onChange={onViewModeChange} />}
    >
      {sections.map((section) => (
        <List.Section key={section.id} title={section.title} subtitle={String(section.charts.length)}>
          {section.charts.map((chart) => (
            <List.Item
              key={`${section.id}-${chart.id}`}
              icon={familyInfo(chart.family).icon}
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
                  browse={{
                    viewMode,
                    onSwitchView: () => onViewModeChange("grid"),
                    showDetail,
                    onToggleDetail,
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
