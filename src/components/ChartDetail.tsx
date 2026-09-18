import { Detail } from "@raycast/api";
import { PROVIDERS } from "../data/providers";
import { rawTemplate, shadcnAddCommand, shadcnVariants, type ChartType, type Provider } from "../lib/catalogue";
import { thumbnailMarkdown } from "../lib/thumbnails";
import ChartActions from "./ChartActions";
import ChartMetadata from "./ChartMetadata";

interface ChartDetailProps {
  chart: ChartType;
  provider: Provider;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => Promise<boolean>;
  onUse: (id: string) => Promise<void>;
}

/**
 * One provider's part of the page: its example in a plain fence (Raycast draws
 * ```mermaid blocks itself, which would show a second picture) and its guidance.
 */
export function providerSection(chart: ChartType, provider: Provider): string {
  const parts = [`## ${PROVIDERS[provider].title}`];
  const template = rawTemplate(chart, provider);
  if (template) parts.push("```\n" + template + "\n```");
  if (provider === "mermaid" && chart.mermaid?.hint) parts.push(chart.mermaid.hint);
  if (provider === "echarts" && chart.echarts?.hint) parts.push(chart.echarts.hint);
  if (provider === "shadcn" && chart.shadcn) {
    parts.push("```\n" + shadcnAddCommand(chart.shadcn.block) + "\n```");
    const variants = shadcnVariants(chart).filter((block) => block.name !== chart.shadcn?.block);
    if (variants.length > 0) {
      parts.push(
        "### Variants",
        variants.map((block) => `- **${block.title}**: \`${shadcnAddCommand(block.name)}\``).join("\n"),
      );
    }
  }
  return parts.join("\n\n");
}

export function chartMarkdown(chart: ChartType, provider: Provider): string {
  const parts = [
    `# ${chart.name}`,
    chart.use,
    thumbnailMarkdown(chart, provider).trim(),
    providerSection(chart, provider),
  ];
  if (chart.notes) parts.push("## Notes", chart.notes);
  return parts.filter(Boolean).join("\n\n");
}

export default function ChartDetail({ chart, provider, isFavourite, onToggleFavourite, onUse }: ChartDetailProps) {
  return (
    <Detail
      navigationTitle={chart.name}
      markdown={chartMarkdown(chart, provider)}
      metadata={<ChartMetadata chart={chart} />}
      actions={
        <ChartActions
          chart={chart}
          provider={provider}
          isFavourite={isFavourite}
          onToggleFavourite={onToggleFavourite}
          onUse={onUse}
        />
      }
    />
  );
}
