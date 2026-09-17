import { Action, ActionPanel, Icon, Keyboard, showToast, Toast } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { PROVIDERS } from "../data/providers";
import { MAX_COLUMNS, MIN_COLUMNS, type ViewMode } from "../hooks/useViewMode";
import { docsUrl, promptSnippet, shadcnAddCommand, type ChartType } from "../lib/catalogue";
import ChartDetail from "./ChartDetail";

/** One shortcut for both platforms: cmd on macOS, ctrl on Windows, same extra modifiers and key. */
function shortcut(key: Keyboard.KeyEquivalent, ...extra: Keyboard.KeyModifier[]): Keyboard.Shortcut {
  return {
    macOS: { modifiers: ["cmd", ...extra], key },
    Windows: { modifiers: ["ctrl", ...extra], key },
  };
}

export interface ChartActionsProps {
  chart: ChartType;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => Promise<boolean>;
  /** Present in the browse views, absent on the chart page itself. */
  browse?: {
    viewMode: ViewMode;
    onSwitchView: () => void;
    showDetail: boolean;
    onToggleDetail: () => void;
    columns: number;
    onColumnsChange: (columns: number) => void;
  };
}

export default function ChartActions({ chart, isFavourite, onToggleFavourite, browse }: ChartActionsProps) {
  const docs = docsUrl(chart);
  const addCommand = shadcnAddCommand(chart);

  async function toggleFavourite() {
    try {
      const nowFavourite = await onToggleFavourite(chart.id);
      await showToast({
        style: Toast.Style.Success,
        title: nowFavourite ? "Added to Favourites" : "Removed from Favourites",
      });
    } catch (error) {
      await showFailureToast(error, { title: "Could not update favourites" });
    }
  }

  return (
    <ActionPanel title={chart.name}>
      <ActionPanel.Section>
        {browse && (
          <Action.Push
            title="Show Chart"
            icon={Icon.Eye}
            target={<ChartDetail chart={chart} isFavourite={isFavourite} onToggleFavourite={onToggleFavourite} />}
          />
        )}
        {docs && <Action.OpenInBrowser title="Open Docs" url={docs} />}
      </ActionPanel.Section>

      <ActionPanel.Section title="Copy">
        {docs && (
          <Action.CopyToClipboard title="Copy Docs Link" content={docs} shortcut={Keyboard.Shortcut.Common.Copy} />
        )}
        {chart.mermaid && (
          <Action.CopyToClipboard
            title="Copy Template"
            content={chart.mermaid.template}
            shortcut={shortcut("t", "shift")}
          />
        )}
        <Action.CopyToClipboard
          title="Copy Prompt Snippet"
          content={promptSnippet(chart)}
          shortcut={shortcut("p", "shift")}
        />
        {addCommand && (
          <Action.CopyToClipboard title="Copy Install Command" content={addCommand} shortcut={shortcut("i", "shift")} />
        )}
      </ActionPanel.Section>

      <ActionPanel.Section title="Providers">
        {chart.mermaid && (
          <Action.OpenInBrowser title={`Open ${PROVIDERS.mermaid.title} Docs`} url={chart.mermaid.docs} />
        )}
        {chart.shadcn && (
          <Action.OpenInBrowser title={`Open ${PROVIDERS.shadcn.title} Example`} url={chart.shadcn.docs} />
        )}
        {chart.echarts && (
          <Action.OpenInBrowser title={`Open ${PROVIDERS.echarts.title} Docs`} url={chart.echarts.docs} />
        )}
      </ActionPanel.Section>

      <ActionPanel.Section title="Catalogue">
        <Action
          title={isFavourite ? "Remove from Favourites" : "Add to Favourites"}
          icon={isFavourite ? Icon.StarDisabled : Icon.Star}
          shortcut={Keyboard.Shortcut.Common.Pin}
          onAction={toggleFavourite}
        />
        {browse && (
          <Action
            title={browse.viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
            icon={browse.viewMode === "grid" ? Icon.List : Icon.AppWindowGrid3x3}
            shortcut={shortcut("l", "shift")}
            onAction={browse.onSwitchView}
          />
        )}
        {browse && browse.viewMode === "list" && (
          <Action
            title={browse.showDetail ? "Hide Details" : "Show Details"}
            icon={Icon.Sidebar}
            shortcut={shortcut("d")}
            onAction={browse.onToggleDetail}
          />
        )}
        {browse && browse.viewMode === "grid" && browse.columns > MIN_COLUMNS && (
          <Action
            title="Larger Tiles"
            icon={Icon.Maximize}
            shortcut={shortcut("=")}
            onAction={() => browse.onColumnsChange(browse.columns - 1)}
          />
        )}
        {browse && browse.viewMode === "grid" && browse.columns < MAX_COLUMNS && (
          <Action
            title="Smaller Tiles"
            icon={Icon.Minimize}
            shortcut={shortcut("-")}
            onAction={() => browse.onColumnsChange(browse.columns + 1)}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}
