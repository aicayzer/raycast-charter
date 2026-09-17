import { Icon, List } from "@raycast/api";
import type { ViewMode } from "../hooks/useViewMode";

interface ViewDropdownProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/** List.Dropdown and Grid.Dropdown are the same component, so one serves both views. */
export default function ViewDropdown({ value, onChange }: ViewDropdownProps) {
  return (
    <List.Dropdown tooltip="View" value={value} onChange={(next) => onChange(next as ViewMode)}>
      <List.Dropdown.Item title="Grid" value="grid" icon={Icon.AppWindowGrid3x3} />
      <List.Dropdown.Item title="List" value="list" icon={Icon.List} />
    </List.Dropdown>
  );
}
