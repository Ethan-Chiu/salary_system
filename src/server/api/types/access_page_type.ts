import { z } from "zod";

export const accessiblePages = z.object({
	actions: z.boolean().default(false),
	settings: z.boolean().default(false),
	roles: z.boolean().default(false),
	report: z.boolean().default(false),
});

export type AccessiblePagesType = z.infer<typeof accessiblePages>;
