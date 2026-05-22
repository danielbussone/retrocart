export const CATALOG_STATUS = ["draft", "active"] as const;
export type CatalogStatus = (typeof CATALOG_STATUS)[number];

export const CATALOG_ENTRY_STATUS = ["active", "removed"] as const;
export type CatalogEntryStatus = (typeof CATALOG_ENTRY_STATUS)[number];

export const PIN_TYPE = ["pinned", "excluded"] as const;
export type PinType = (typeof PIN_TYPE)[number];

export const ADDED_BY = ["generator", "user"] as const;
export type AddedBy = (typeof ADDED_BY)[number];

export const SIGNAL_TYPE = [
  "pin",
  "exclude",
  "swap_out",
  "swap_in",
  "manual_add",
  "remove",
] as const;
export type SignalType = (typeof SIGNAL_TYPE)[number];
