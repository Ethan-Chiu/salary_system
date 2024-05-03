import { z } from "zod";

export const SyncDataDisplayModeEnum = z.enum(["changed", "all"]);
export type SyncDataDisplayModeEnumType = z.infer<typeof SyncDataDisplayModeEnum>;

export function syncDataModeString(mode: SyncDataDisplayModeEnumType): string {
    switch (mode) {
        case "changed":
            return "Only Changed";
        case "all":
            return "Display All";
    }
}