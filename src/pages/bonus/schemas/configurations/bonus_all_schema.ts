import { z } from "zod";

const zc = z.coerce;

export const bonusAllSchema = z.object({
    multiplier: zc.number(),
});
