import { Color } from "@raycast/api";
import type { Provider } from "../lib/catalogue";

export interface ProviderInfo {
  id: Provider;
  title: string;
  /** Tag colour in list accessories and metadata. */
  color: Color;
  home: string;
}

export const PROVIDERS: Record<Provider, ProviderInfo> = {
  mermaid: {
    id: "mermaid",
    title: "Mermaid",
    color: Color.Magenta,
    home: "https://mermaid.js.org/",
  },
  shadcn: {
    id: "shadcn",
    title: "shadcn",
    color: Color.PrimaryText,
    home: "https://ui.shadcn.com/charts",
  },
  echarts: {
    id: "echarts",
    title: "ECharts",
    color: Color.Red,
    home: "https://echarts.apache.org/",
  },
};
