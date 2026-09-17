import { Color } from "@raycast/api";
import type { Provider } from "../lib/catalogue";

export interface ProviderInfo {
  id: Provider;
  title: string;
  /** Tag colour in list accessories and metadata. */
  color: Color;
}

export const PROVIDERS: Record<Provider, ProviderInfo> = {
  mermaid: {
    id: "mermaid",
    title: "Mermaid",
    color: Color.Magenta,
  },
  shadcn: {
    id: "shadcn",
    title: "shadcn",
    color: Color.SecondaryText,
  },
  echarts: {
    id: "echarts",
    title: "ECharts",
    color: Color.Red,
  },
};
