const { z } = require("zod");

export const bonusDepartmentSchema = z.object({
  department: z.string(),
  multiplier: z.number(),
});
