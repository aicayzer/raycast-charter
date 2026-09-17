import { Detail } from "@raycast/api";
import { PROVIDERS } from "../data/providers";
import type { ChartType } from "../lib/catalogue";
import { thumbnailMarkdown } from "../lib/thumbnails";
import ChartActions from "./ChartActions";
import ChartMetadata from "./ChartMetadata";

interface ChartDetailProps {
  chart: ChartType;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => Promise<boolean>;
  onUse: (id: string) => Promise<void>;
}

export function chartMarkdown(chart: ChartType): string {
  const parts = [`# ${chart.name}`, chart.use, thumbnailMarkdown(chart).trim()];
  if (chart.mermaid) {
    parts.push(`## ${PROVIDERS.mermaid.title}`, "```mermaid\n" + chart.mermaid.template + "\n```");
    if (chart.mermaid.hint) parts.push(chart.mermaid.hint);
  }
  if (chart.echarts?.note) parts.push(`## ${PROVIDERS.echarts.title}`, chart.echarts.note);
  if (chart.notes) parts.push("## Notes", chart.notes);
  return parts.filter(Boolean).join("\n\n");
}

export default function ChartDetail({ chart, isFavourite, onToggleFavourite, onUse }: ChartDetailProps) {
  return (
    <Detail
      navigationTitle={chart.name}
      markdown={chartMarkdown(chart)}
      metadata={<ChartMetadata chart={chart} />}
      actions={
        <ChartActions chart={chart} isFavourite={isFavourite} onToggleFavourite={onToggleFavourite} onUse={onUse} />
      }
    />
  );
}
