import { Color, Image } from "@raycast/api";
import { THUMBNAILS } from "../data/thumbnails";
import { familyInfo } from "../data/families";
import type { ChartType } from "./catalogue";

const available = new Set(THUMBNAILS);

export function hasThumbnail(chart: ChartType): boolean {
  return available.has(chart.id);
}

/** Asset path Raycast resolves against the assets folder, with an @dark variant picked up automatically. */
export function thumbnailPath(chart: ChartType): string {
  return `charts/${chart.id}.png`;
}

/** Grid tile: the thumbnail when it exists, otherwise the family icon. */
export function tileContent(chart: ChartType): Image.ImageLike {
  if (hasThumbnail(chart)) return { source: thumbnailPath(chart) };
  return { source: familyInfo(chart.family).icon, tintColor: Color.SecondaryText };
}

/** Markdown for the detail views: the thumbnail, or nothing when it is missing. */
export function thumbnailMarkdown(chart: ChartType): string {
  return hasThumbnail(chart) ? `![${chart.name}](${thumbnailPath(chart)})\n\n` : "";
}
