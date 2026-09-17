import { FAMILIES } from "../data/families";
import { groupByFamily, type ChartType } from "./catalogue";

export interface ChartSection {
  id: string;
  title: string;
  charts: ChartType[];
}

export const FAVOURITES_SECTION = "favourites";

/** Favourites first, then one section per family in catalogue order. */
export function buildSections(charts: ChartType[], favourites: string[]): ChartSection[] {
  const sections: ChartSection[] = [];
  const favourite = charts.filter((chart) => favourites.includes(chart.id));
  if (favourite.length > 0) {
    sections.push({ id: FAVOURITES_SECTION, title: "Favourites", charts: favourite });
  }
  const byFamily = groupByFamily(charts);
  for (const family of FAMILIES) {
    const members = byFamily.get(family.id);
    if (members?.length) sections.push({ id: family.id, title: family.title, charts: members });
  }
  return sections;
}
