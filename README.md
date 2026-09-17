# Charter

A catalogue of chart and diagram types for Raycast. Browse by family, see which of Mermaid, shadcn or ECharts can draw each one, and copy the docs link, a syntax template or a prompt snippet without leaving the keyboard.

## Commands

- **Browse Charts** lists every type, grouped by family, with your favourites and the five types you last opened or copied from at the top. The dropdown in the search bar narrows the catalogue to one provider (All, Mermaid, shadcn or ECharts) and remembers the choice. `cmd+shift+l` switches between a grid of thumbnails and a list with a detail panel; `cmd+=` and `cmd+-` change the tile size. Search matches names and synonyms, so "spider" finds Radar and "flow of money" finds Sankey.

- **Render Chart** draws whatever Mermaid diagram or Apache ECharts option it finds, looking at the selected text first, then the clipboard, and offering a form when neither holds one. The picture opens in Raycast with Copy Image, Save to Downloads and Open Image; a ```mermaid fence around the source is fine. Charts are drawn on your machine by a Chromium-based browser (Google Chrome, Chromium, Brave, Arc or Microsoft Edge, or the one you choose under **Browser** in the preferences). When no browser is installed, Mermaid diagrams can be sent to Kroki instead, and the **Kroki Server** preference can point at your own instance. Other extensions and scripts can hand a chart over through a deeplink: `raycast://extensions/aic/charter/render-chart?context={"source":"..."}`.

## What each type shows

- **Mermaid**: the first-line keyword and the docs page. Types added since Mermaid 10 carry the release that added them, as `Mermaid 11.6+`, because whether a type renders in a given app depends on the Mermaid version that app bundles.
- **shadcn**: the chart block from the shadcn registry, when a recipe exists. shadcn charts are built on Recharts, so there is no separate Recharts column.
- **ECharts**: the series type in an Apache ECharts option.

## Actions

- **Open Docs** opens the Mermaid page, or the first provider's page when the type has no Mermaid syntax. It is the Enter action on the chart page and in the list when the detail panel is open; elsewhere Enter opens the chart page.
- **Copy Docs Link**, **Copy Template** and **Copy Prompt Snippet** put the link, a complete example, or a ready-to-paste instruction for a model on the clipboard. The template comes inside a ```mermaid fence so it drops straight into a chat or a Markdown note; **Copy Raw Template** gives the bare syntax.
- **Copy Install Command** copies `npx shadcn@latest add <block>` when a recipe exists.
- **Render Template** draws the type's Mermaid template, so you can see the real thing before asking for it.
- **Add to Favourites** pins a type to the top of the catalogue, and **Clear Recent** empties the Recent section.

## Development

`npm run dev` serves the extension, `npm run lint` and `npm run build` must pass before a commit. `npm run vendor` refreshes the copies of Mermaid and ECharts in `assets/vendor` from `node_modules`, and `npm run thumbnails` redraws the catalogue thumbnails in `assets/charts` with them.
