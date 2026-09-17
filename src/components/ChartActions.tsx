import { Action, ActionPanel, Icon, Keyboard, showToast, Toast } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import { PROVIDERS } from "../data/providers";
import { MAX_COLUMNS, MIN_COLUMNS, type ViewMode } from "../hooks/useViewMode";
import { docsUrl, fencedTemplate, promptSnippet, shadcnAddCommand, type ChartType } from "../lib/catalogue";
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
  /** Called when the type is opened or copied from, so it joins the Recent section. */
  onUse: (id: string) => Promise<void>;
  /** Present in the browse views, absent on the chart page itself. */
  browse?: {
    onClearRecent?: () => Promise<void>;
    viewMode: ViewMode;
    onSwitchView: () => void;
    showDetail: boolean;
    onToggleDetail: () => void;
    columns: number;
    onColumnsChange: (columns: number) => void;
  };
}

export default function ChartActions({ chart, isFavourite, onToggleFavourite, onUse, browse }: ChartActionsProps) {
  const docs = docsUrl(chart);
  const addCommand = shadcnAddCommand(chart);
  const fenced = fencedTemplate(chart);
  // With the list panel open the page would repeat what is already on screen, so Enter goes to the docs.
  const docsFirst = !browse || (browse.viewMode === "list" && browse.showDetail);

  // Recording a use is bookkeeping; a storage failure must not stop the copy or open it follows.
  function used() {
    onUse(chart.id).catch((error) => showFailureToast(error, { title: "Could not update recent" }));
  }

  async function clearRecent() {
    try {
      await browse?.onClearRecent?.();
      await showToast({ style: Toast.Style.Success, title: "Cleared Recent" });
    } catch (error) {
      await showFailureToast(error, { title: "Could not clear recent" });
    }
  }

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
        {docsFirst && docs && <Action.OpenInBrowser title="Open Docs" url={docs} onOpen={used} />}
        {browse && (
          <Action.Push
            title="Show Chart"
            icon={Icon.Eye}
            target={
              <ChartDetail
                chart={chart}
                isFavourite={isFavourite}
                onToggleFavourite={onToggleFavourite}
                onUse={onUse}
              />
            }
            onPush={used}
          />
        )}
        {!docsFirst && docs && <Action.OpenInBrowser title="Open Docs" url={docs} onOpen={used} />}
      </ActionPanel.Section>

      <ActionPanel.Section title="Copy">
        {docs && (
          <Action.CopyToClipboard
            title="Copy Docs Link"
            content={docs}
            shortcut={Keyboard.Shortcut.Common.Copy}
            onCopy={used}
          />
        )}
        {fenced && (
          <Action.CopyToClipboard
            title="Copy Template"
            content={fenced}
            shortcut={shortcut("t", "shift")}
            onCopy={used}
          />
        )}
        {chart.mermaid && (
          <Action.CopyToClipboard
            title="Copy Raw Template"
            content={chart.mermaid.template}
            shortcut={shortcut("r", "shift")}
            onCopy={used}
          />
        )}
        <Action.CopyToClipboard
          title="Copy Prompt Snippet"
          content={promptSnippet(chart)}
          shortcut={shortcut("p", "shift")}
          onCopy={used}
        />
        {addCommand && (
          <Action.CopyToClipboard
            title="Copy Install Command"
            content={addCommand}
            shortcut={shortcut("i", "shift")}
            onCopy={used}
          />
        )}
      </ActionPanel.Section>

      <ActionPanel.Section title="Providers">
        {chart.mermaid && (
          <Action.OpenInBrowser title={`Open ${PROVIDERS.mermaid.title} Docs`} url={chart.mermaid.docs} onOpen={used} />
        )}
        {chart.shadcn && (
          <Action.OpenInBrowser
            title={`Open ${PROVIDERS.shadcn.title} Example`}
            url={chart.shadcn.docs}
            onOpen={used}
          />
        )}
        {chart.echarts && (
          <Action.OpenInBrowser title={`Open ${PROVIDERS.echarts.title} Docs`} url={chart.echarts.docs} onOpen={used} />
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
        {browse?.onClearRecent && (
          <Action
            title="Clear Recent"
            icon={Icon.XMarkCircle}
            style={Action.Style.Destructive}
            onAction={clearRecent}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}
