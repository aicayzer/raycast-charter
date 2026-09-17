import {
  Action,
  ActionPanel,
  Detail,
  Icon,
  Keyboard,
  openExtensionPreferences,
  showInFinder,
  showToast,
  Toast,
} from "@raycast/api";
import { showFailureToast, usePromise } from "@raycast/utils";
import { copyFileSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { useMemo, useRef, useState } from "react";
import { renderChart, renderChartWithKroki } from "../lib/render";
import { BROWSER_NAMES } from "../lib/render/browser";
import { sourceLabel, type ChartSource } from "../lib/render/source";
import SourceForm from "./SourceForm";

interface RenderViewProps {
  source: ChartSource;
  /** The catalogue type when rendering a template, else the command name. */
  title?: string;
}

type Route = "browser" | "kroki";

/** A plain fence: Raycast draws ```mermaid blocks itself, which would show a second picture. */
function sourceBlock(source: ChartSource): string {
  return "```" + (source.kind === "echarts" ? "json" : "") + "\n" + source.text + "\n```";
}

function timestamp(): string {
  return new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
}

/** usePromise drops the result of an aborted call when the error carries this name. */
function abortError(): Error {
  const error = new Error("Render abandoned");
  error.name = "AbortError";
  return error;
}

export default function RenderView({ source, title = "Render Chart" }: RenderViewProps) {
  const [route, setRoute] = useState<Route>("browser");
  const abortable = useRef<AbortController>(undefined);
  const { data, error, isLoading, revalidate } = usePromise(
    async (source: ChartSource, route: Route) => {
      // Development mounts twice and abandons the first call at once; skipping it saves a browser launch.
      const signal = abortable.current?.signal;
      await new Promise((settle) => setTimeout(settle, 0));
      if (signal?.aborted) throw abortError();
      return route === "kroki" ? renderChartWithKroki(source) : renderChart(source);
    },
    [source, route],
    // The failure is the content of the view, so the default toast would say it twice.
    { abortable, onError: () => undefined },
  );
  const label = sourceLabel(source);

  const image = data?.status === "ok" ? data.image : undefined;
  const dataUri = useMemo(
    () => (image ? `data:image/png;base64,${readFileSync(image.path).toString("base64")}` : undefined),
    [image],
  );

  async function saveToDownloads() {
    if (!image) return;
    const target = join(homedir(), "Downloads", `charter-${source.kind}-${timestamp()}.png`);
    try {
      copyFileSync(image.path, target);
      await showToast({
        style: Toast.Style.Success,
        title: "Saved to Downloads",
        message: target.split("/").pop(),
        primaryAction: { title: "Show in Finder", onAction: () => showInFinder(target) },
      });
    } catch (saveError) {
      await showFailureToast(saveError, { title: "Could not save the image" });
    }
  }

  const sourceActions = (
    <ActionPanel.Section title="Source">
      <Action.Push
        title="Edit Source"
        icon={Icon.Pencil}
        shortcut={Keyboard.Shortcut.Common.Edit}
        target={<SourceForm initial={source.text} />}
      />
      <Action.CopyToClipboard title="Copy Source" content={source.text} shortcut={Keyboard.Shortcut.Common.Copy} />
      <Action
        title="Render Again"
        icon={Icon.ArrowClockwise}
        shortcut={Keyboard.Shortcut.Common.Refresh}
        onAction={revalidate}
      />
    </ActionPanel.Section>
  );

  if (error) {
    return (
      <Detail
        navigationTitle={title}
        markdown={`## ${label} could not be drawn\n\n\`\`\`\n${error.message}\n\`\`\`\n\n${sourceBlock(source)}`}
        actions={
          <ActionPanel>
            <Action.Push title="Edit Source" icon={Icon.Pencil} target={<SourceForm initial={source.text} />} />
            <Action.CopyToClipboard title="Copy Error" content={error.message} />
            {sourceActions}
          </ActionPanel>
        }
      />
    );
  }

  if (data?.status === "no-browser") {
    const names = BROWSER_NAMES.join(", ");
    return (
      <Detail
        navigationTitle={title}
        markdown={
          `## No browser to draw with\n\n` +
          `Charter draws charts in a Chromium-based browser installed on this Mac. None of ${names} was found in Applications.\n\n` +
          `Install one, or pick the one you use under **Browser** in the extension preferences.\n\n` +
          (source.kind === "mermaid"
            ? `Mermaid diagrams can also be drawn by Kroki, a public service, which means sending the diagram over the network.`
            : `ECharts options need a browser; Kroki cannot draw them.`)
        }
        actions={
          <ActionPanel>
            <Action title="Choose Browser" icon={Icon.Gear} onAction={openExtensionPreferences} />
            {source.kind === "mermaid" && (
              <Action title="Draw with Kroki" icon={Icon.Globe} onAction={() => setRoute("kroki")} />
            )}
            {sourceActions}
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Detail
      navigationTitle={title}
      isLoading={isLoading}
      markdown={dataUri ? `![${label}](${dataUri})` : sourceBlock(source)}
      metadata={
        image && (
          <Detail.Metadata>
            <Detail.Metadata.Label title="Source" text={label} />
            <Detail.Metadata.Label title="Size" text={`${image.width} by ${image.height}`} />
            <Detail.Metadata.Label title="Drawn With" text={route === "kroki" ? "Kroki" : "Browser"} />
          </Detail.Metadata>
        )
      }
      actions={
        <ActionPanel>
          {image && (
            <ActionPanel.Section title="Image">
              <Action.CopyToClipboard title="Copy Image" icon={Icon.Clipboard} content={{ file: image.path }} />
              <Action
                title="Save to Downloads"
                icon={Icon.Download}
                shortcut={Keyboard.Shortcut.Common.Save}
                onAction={saveToDownloads}
              />
              <Action.Open title="Open Image" icon={Icon.Eye} target={image.path} />
              <Action.ShowInFinder path={image.path} />
            </ActionPanel.Section>
          )}
          {sourceActions}
        </ActionPanel>
      }
    />
  );
}
