import { FAMILIES } from "../data/families";
import { groupByFamily, type ChartType } from "./catalogue";

export interface ChartSection {
  id: string;
  title: string;
  charts: ChartType[];
}

export const FAVOURITES_SECTION = "favourites";
export const RECENT_SECTION = "recent";

/** Favourites, then recent in the order they were used, then one section per family in catalogue order. */
export function buildSections(charts: ChartType[], favourites: string[], recent: string[]): ChartSection[] {
  const sections: ChartSection[] = [];
  const favourite = charts.filter((chart) => favourites.includes(chart.id));
  if (favourite.length > 0) {
    sections.push({ id: FAVOURITES_SECTION, title: "Favourites", charts: favourite });
  }
  const recentCharts = recent.flatMap((id) => charts.filter((chart) => chart.id === id));
  if (recentCharts.length > 0) {
    sections.push({ id: RECENT_SECTION, title: "Recent", charts: recentCharts });
  }
  const byFamily = groupByFamily(charts);
  for (const family of FAMILIES) {
    const members = byFamily.get(family.id);
    if (members?.length) sections.push({ id: family.id, title: family.title, charts: members });
  }
  return sections;
}
