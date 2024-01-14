import { z } from "zod";

const zc = z.coerce;

export const levelRangeSchema = z.object({
  type: z.enum(["勞保", "健保", "勞災"]),
  level_start: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  level_end: zc.number(),
});