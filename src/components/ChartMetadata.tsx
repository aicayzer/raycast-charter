import { Color, Detail } from "@raycast/api";
import { familyInfo } from "../data/families";
import { PROVIDERS } from "../data/providers";
import type { ChartType } from "../lib/catalogue";

const NOT_AVAILABLE = "Not available";

/**
 * The structured half of a chart: family, one row per provider, synonyms.
 * Each provider row is a link to its docs with the keyword as the text, so
 * the panel stays five rows tall. Detail.Metadata and List.Item.Detail.Metadata
 * are the same component, so one tree serves the chart page and the list panel.
 */
export default function ChartMetadata({ chart }: { chart: ChartType }) {
  const { mermaid, shadcn, echarts } = chart;
  const mermaidText = mermaid
    ? [mermaid.keyword, mermaid.since && `since ${mermaid.since}`, mermaid.beta && "beta"].filter(Boolean).join(", ")
    : undefined;

  return (
    <Detail.Metadata>
      <Detail.Metadata.Label title="Family" text={familyInfo(chart.family).title} />
      {mermaid && mermaidText ? (
        <Detail.Metadata.Link title={PROVIDERS.mermaid.title} target={mermaid.docs} text={mermaidText} />
      ) : (
        <Detail.Metadata.Label title={PROVIDERS.mermaid.title} text={NOT_AVAILABLE} />
      )}
      {shadcn ? (
        <Detail.Metadata.Link title={PROVIDERS.shadcn.title} target={shadcn.docs} text={shadcn.block} />
      ) : (
        <Detail.Metadata.Label title={PROVIDERS.shadcn.title} text={NOT_AVAILABLE} />
      )}
      {echarts ? (
        <Detail.Metadata.Link title={PROVIDERS.echarts.title} target={echarts.docs} text={echarts.series} />
      ) : (
        <Detail.Metadata.Label title={PROVIDERS.echarts.title} text={NOT_AVAILABLE} />
      )}
      <Detail.Metadata.Separator />
      <Detail.Metadata.TagList title="Also known as">
        {chart.synonyms.map((synonym) => (
          <Detail.Metadata.TagList.Item key={synonym} text={synonym} color={Color.SecondaryText} />
        ))}
      </Detail.Metadata.TagList>
    </Detail.Metadata>
  );
}
