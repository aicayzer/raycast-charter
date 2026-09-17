export type Provider = "mermaid" | "shadcn" | "echarts";

export type Family = "flow" | "structure" | "hierarchy" | "quantity" | "time" | "framework";

export interface MermaidSupport {
  /** The first line of the diagram, e.g. `radar-beta`. */
  keyword: string;
  /** Mermaid release that added the type. Absent means long-standing. */
  since?: string;
  docs: string;
  /** A complete, valid example, short enough to read at a glance. */
  template: string;
  /** Extra guidance for a model writing this type. */
  hint?: string;
}

export interface ShadcnSupport {
  /** Registry block name, e.g. `chart-radar-default`. */
  block: string;
  docs: string;
}

export interface EchartsSupport {
  /** Series type in the ECharts option, e.g. `radar`. */
  series: string;
  docs: string;
  note?: string;
}

export interface ChartType {
  id: string;
  name: string;
  family: Family;
  synonyms: string[];
  /** One sentence: when to reach for it. */
  use: string;
  mermaid?: MermaidSupport;
  shadcn?: ShadcnSupport;
  echarts?: EchartsSupport;
  notes?: string;
}

/** The search-bar dropdown: every type, or only those one provider can draw. */
export type ProviderFilter = "all" | Provider;

export const PROVIDER_ORDER: Provider[] = ["mermaid", "shadcn", "echarts"];

export function matchesFilter(chart: ChartType, filter: ProviderFilter): boolean {
  return filter === "all" || Boolean(chart[filter]);
}

/** What the tile says under the name: the keyword for the chosen provider, else the first provider. */
export function providerLabel(chart: ChartType, filter: ProviderFilter): string | undefined {
  if (filter === "shadcn") return chart.shadcn?.block;
  if (filter === "echarts") return chart.echarts?.series;
  return mermaidTag(chart) ?? (chart.shadcn ? "shadcn" : chart.echarts ? "ECharts" : undefined);
}

export function groupByFamily(charts: ChartType[]): Map<Family, ChartType[]> {
  const groups = new Map<Family, ChartType[]>();
  for (const chart of charts) {
    const group = groups.get(chart.family) ?? [];
    group.push(chart);
    groups.set(chart.family, group);
  }
  return groups;
}

/** The docs link Enter opens: Mermaid first, then whichever provider the type has. */
export function docsUrl(chart: ChartType): string | undefined {
  return chart.mermaid?.docs ?? chart.shadcn?.docs ?? chart.echarts?.docs;
}

/** "Mermaid 11.6+" for types with a known first release, "Mermaid" for long-standing ones. */
export function mermaidTag(chart: ChartType): string | undefined {
  if (!chart.mermaid) return undefined;
  return chart.mermaid.since ? `Mermaid ${chart.mermaid.since}+` : "Mermaid";
}

/** The keyword with its first release folded in: "radar-beta, 11.6+". */
export function mermaidLabel(chart: ChartType): string | undefined {
  if (!chart.mermaid) return undefined;
  return chart.mermaid.since ? `${chart.mermaid.keyword}, ${chart.mermaid.since}+` : chart.mermaid.keyword;
}

/** Providers that cannot draw the chart, in display order. */
export function missingProviders(chart: ChartType): Provider[] {
  return PROVIDER_ORDER.filter((provider) => !chart[provider]);
}

/** The Mermaid template inside a fence, ready to paste into a chat or a Markdown note. */
export function fencedTemplate(chart: ChartType): string | undefined {
  return chart.mermaid ? "```mermaid\n" + chart.mermaid.template + "\n```" : undefined;
}

export function shadcnAddCommand(chart: ChartType): string | undefined {
  return chart.shadcn ? `npx shadcn@latest add ${chart.shadcn.block}` : undefined;
}

/** What to paste into a model conversation so it answers with this chart. */
export function promptSnippet(chart: ChartType): string {
  if (chart.mermaid) {
    const lines = [
      `Return the answer as a Mermaid ${chart.name.toLowerCase()} chart (\`${chart.mermaid.keyword}\`) inside a \`\`\`mermaid fence.`,
    ];
    if (chart.mermaid.since) {
      lines.push(`This type needs Mermaid ${chart.mermaid.since} or later.`);
    }
    if (chart.mermaid.hint) lines.push(chart.mermaid.hint);
    lines.push("Follow this syntax exactly:", "", chart.mermaid.template);
    return lines.join("\n");
  }
  if (chart.echarts) {
    const lines = [
      `Return the answer as an Apache ECharts option (JSON) using a \`${chart.echarts.series}\` series, inside a \`\`\`json fence.`,
    ];
    if (chart.echarts.note) lines.push(chart.echarts.note);
    lines.push("Keep the option self-contained: data inline, short labels, no functions.");
    return lines.join("\n");
  }
  if (chart.shadcn) {
    return `Return the answer as a shadcn/ui chart using the \`${chart.shadcn.block}\` block (Recharts), as a React component with the data inline.`;
  }
  return `Return the answer as a ${chart.name.toLowerCase()} chart.`;
}

/** Search keywords Raycast matches alongside the title. */
export function searchKeywords(chart: ChartType): string[] {
  const keywords = new Set<string>(chart.synonyms);
  keywords.add(chart.family);
  if (chart.mermaid) {
    keywords.add("mermaid");
    keywords.add(chart.mermaid.keyword);
  }
  if (chart.shadcn) {
    keywords.add("shadcn");
    keywords.add("recharts");
    keywords.add(chart.shadcn.block);
  }
  if (chart.echarts) {
    keywords.add("echarts");
    keywords.add(chart.echarts.series);
  }
  return [...keywords];
}
