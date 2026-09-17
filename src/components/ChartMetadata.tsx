import { Color, Detail } from "@raycast/api";
import { familyInfo } from "../data/families";
import { PROVIDERS } from "../data/providers";
import type { ChartType } from "../lib/catalogue";

const NOT_AVAILABLE = "Not available";

/**
 * The structured half of a chart: family, one block per provider, synonyms.
 * Detail.Metadata and List.Item.Detail.Metadata are the same component, so
 * one tree serves the chart page and the list's detail panel.
 */
export default function ChartMetadata({ chart }: { chart: ChartType }) {
  const { mermaid, shadcn, echarts } = chart;
  return (
    <Detail.Metadata>
      <Detail.Metadata.Label title="Family" text={familyInfo(chart.family).title} />
      <Detail.Metadata.Separator />

      {mermaid ? (
        <>
          <Detail.Metadata.TagList title={PROVIDERS.mermaid.title}>
            <Detail.Metadata.TagList.Item text={mermaid.keyword} color={PROVIDERS.mermaid.color} />
            {mermaid.since && (
              <Detail.Metadata.TagList.Item text={`since ${mermaid.since}`} color={Color.SecondaryText} />
            )}
            {mermaid.beta && <Detail.Metadata.TagList.Item text="beta" color={Color.Orange} />}
          </Detail.Metadata.TagList>
          <Detail.Metadata.Link title="" target={mermaid.docs} text="Mermaid docs" />
        </>
      ) : (
        <Detail.Metadata.Label title={PROVIDERS.mermaid.title} text={NOT_AVAILABLE} />
      )}

      {shadcn ? (
        <>
          <Detail.Metadata.TagList title={PROVIDERS.shadcn.title}>
            <Detail.Metadata.TagList.Item text={shadcn.block} color={PROVIDERS.shadcn.color} />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Link title="" target={shadcn.docs} text="shadcn example" />
        </>
      ) : (
        <Detail.Metadata.Label title={PROVIDERS.shadcn.title} text={NOT_AVAILABLE} />
      )}

      {echarts ? (
        <>
          <Detail.Metadata.TagList title={PROVIDERS.echarts.title}>
            <Detail.Metadata.TagList.Item text={echarts.series} color={PROVIDERS.echarts.color} />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Link title="" target={echarts.docs} text="ECharts docs" />
        </>
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
