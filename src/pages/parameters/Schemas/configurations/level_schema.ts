import { z } from "zod";

export const levelSchema = z.object({
  level: z.number() 
});
