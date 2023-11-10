import { z } from "zod";

export const accessiblePages = z.object({
	actions: z.boolean(),
    settings: z.boolean(),
    roles: z.boolean(),
    report: z.boolean(),
});

export type AccessiblePagesType = z.infer<typeof accessiblePages>;