import { z } from "zod";

const zc = z.coerce;

export const bonusAllSchema = z.object({
    id: zc.number(),
    multiplier: zc.number(),
});
