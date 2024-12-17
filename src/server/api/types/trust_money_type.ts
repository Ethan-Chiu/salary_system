import { z } from "zod";
import { dateAll, dateCreate, func, Id } from "./common_type";
const TrustMoneyBase = z.object({
	position: z.number(),
	position_type: z.string(),
	org_trust_reserve_limit: z.number(),
	org_special_trust_incent_limit: z.number()
});
export const createTrustMoneyAPI = TrustMoneyBase
	.merge(dateCreate)
	.omit({ end_date: true });

export const createTrustMoneyService = TrustMoneyBase
	.merge(dateCreate);

export const updateTrustMoneyAPI = TrustMoneyBase
	.merge(dateAll)
	.partial()
	.merge(Id);

export const updateTrustMoneyService = TrustMoneyBase
	.merge(dateAll)
	.partial()
	.merge(Id);
// Frontend Types
export const TrustMoneyFE = z
	.object({
		id: z.number(),
	})
	.merge(TrustMoneyBase)
	.merge(dateAll)
	.merge(func);

export type TrustMoneyFEType = z.infer<typeof TrustMoneyFE>;