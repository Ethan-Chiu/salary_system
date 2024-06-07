import { z } from "zod";

export const SyncDataDisplayModeEnum = z.enum(["changed", "all"]);
export type SyncDataDisplayModeEnumType = z.infer<typeof SyncDataDisplayModeEnum>;

export function syncDataModeString(mode: SyncDataDisplayModeEnumType): string {
    switch (mode) {
        case "changed":
            return "mode_only_changed";
        case "all":
            return "mode_display_all";
    }
}