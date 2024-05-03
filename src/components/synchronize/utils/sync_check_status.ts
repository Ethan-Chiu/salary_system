import { z } from "zod";

export const SyncCheckStatusEnum = z.enum(["initial", "checked", "ignored"]);
export type SyncCheckStatusEnumType = z.infer<typeof SyncCheckStatusEnum>;

export function statusLabel(status: SyncCheckStatusEnumType): string {
    switch (status) {
        case "initial":
            return "尚未確認";
        case "checked":
            return "確認更改";
        case "ignored":
            return "暫不修改";
    }
}