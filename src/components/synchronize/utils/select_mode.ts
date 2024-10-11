import { z } from "zod";

export const SyncDataSelectModeEnum = z.enum(["all_emp", "filter_emp", "filter_dep"]);
export type SyncDataSelectModeEnumType = z.infer<typeof SyncDataSelectModeEnum>;

export function syncDataSelectModeString(mode: SyncDataSelectModeEnumType): string {
   switch (mode) {
        case "all_emp":
            return "mode_all_emp";
        case "filter_emp":
            return "mode_filter_emp";
        case "filter_dep":
            return "mode_filter_dep"
    }
}
