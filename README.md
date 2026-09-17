# Charter

A catalogue of chart and diagram types for Raycast. Browse by family, see which of Mermaid, shadcn or ECharts can draw each one, and copy the docs link, a syntax template or a prompt snippet without leaving the keyboard.

## Commands

- **Browse Charts** lists every type, grouped by family, with your favourites first. Switch between a grid of thumbnails and a list with a detail panel from the dropdown in the search bar or with `cmd+shift+l`. Search matches names and synonyms, so "spider" finds Radar and "flow of money" finds Sankey.

## What each type shows

- **Mermaid**: the first-line keyword, the release that added the type, and the docs page. Types added since Mermaid 10 carry a version tag such as `Mermaid 11.6`, because whether a type renders in a given app depends on the Mermaid version that app bundles. Beta keywords are labelled.
- **shadcn**: the chart block from the shadcn registry, when a recipe exists. shadcn charts are built on Recharts, so there is no separate Recharts column.
- **ECharts**: the series type in an Apache ECharts option.

## Actions

- **Open Docs** opens the Mermaid page, or the first provider's page when the type has no Mermaid syntax.
- **Copy Docs Link**, **Copy Template** and **Copy Prompt Snippet** put the link, a complete example, or a ready-to-paste instruction for a model on the clipboard.
- **Copy Install Command** copies `npx shadcn@latest add <block>` when a recipe exists.
- **Add to Favourites** pins a type to the top of the catalogue.

## Preferences

Tick the providers you care about under **Chart Providers**. A type is listed when at least one ticked provider can draw it. Untick everything and the catalogue tells you so rather than showing nothing.
