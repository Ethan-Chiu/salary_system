import { z } from "zod";

const zc = z.coerce;

export const levelSchema = z.object({
  level: zc.number() 
});
