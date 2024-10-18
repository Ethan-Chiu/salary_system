import { z } from "zod";

export const SyncCheckStatusEnum = z.enum(["initial", "checked"]);
export type SyncCheckStatusEnumType = z.infer<typeof SyncCheckStatusEnum>;

export function statusLabel(status: SyncCheckStatusEnumType): string {
    switch (status) {
        case "initial":
            return "sync_state.initial";
        case "checked":
            return "sync_state.checked";
    }
}
