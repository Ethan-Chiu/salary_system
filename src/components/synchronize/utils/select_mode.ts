import { z } from "zod";

export const SyncDataSelectModeEnum = z.enum(["all_emp", "filter_emp", "filter_dep"]);
export type SyncDataSelectModeEnumType = z.infer<typeof SyncDataSelectModeEnum>;

export function syncDataSelectModeString(mode: SyncDataSelectModeEnumType): string {
   switch (mode) {
        case "all_emp":
            return "show_all";
        case "filter_emp":
            return "select_employee";
        case "filter_dep":
            return "select_department";
    }
}
