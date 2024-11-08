import { z } from "zod";

const zc = z.coerce;

export const bonusWorkTypeSchema = z.object({
	work_type: z.enum(["直接人員", "間接人員", "外籍勞工"]),
	multiplier: zc.number(),
});
