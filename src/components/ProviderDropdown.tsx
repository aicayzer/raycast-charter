import { Icon, List } from "@raycast/api";
import { PROVIDERS } from "../data/providers";
import { PROVIDER_ORDER, type ProviderFilter } from "../lib/catalogue";

interface ProviderDropdownProps {
  value: ProviderFilter;
  onChange: (filter: ProviderFilter) => void;
}

/** List.Dropdown and Grid.Dropdown are the same component, so one serves both views. */
export default function ProviderDropdown({ value, onChange }: ProviderDropdownProps) {
  return (
    <List.Dropdown tooltip="Provider" value={value} onChange={(next) => onChange(next as ProviderFilter)}>
      <List.Dropdown.Item title="All Providers" value="all" icon={Icon.Circle} />
      {PROVIDER_ORDER.map((provider) => (
        <List.Dropdown.Item
          key={provider}
          title={PROVIDERS[provider].title}
          value={provider}
          icon={{ source: Icon.CircleFilled, tintColor: PROVIDERS[provider].color }}
        />
      ))}
    </List.Dropdown>
  );
}
