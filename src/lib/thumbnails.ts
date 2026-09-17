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

/**
 * Markdown for the detail views: the thumbnail, or nothing when it is missing.
 * The list panel is short, so it asks for a fixed size; the chart page lets
 * Raycast fit the image to the column.
 */
export function thumbnailMarkdown(chart: ChartType, size?: { width: number; height: number }): string {
  if (!hasThumbnail(chart)) return "";
  const query = size ? `?raycast-width=${size.width}&raycast-height=${size.height}` : "";
  return `![${chart.name}](${thumbnailPath(chart)}${query})\n\n`;
}
