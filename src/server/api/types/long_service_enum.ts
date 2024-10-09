import { z } from "zod";

export const LongServiceeEnum = z.enum(["月領", "一年領", "兩年領"]);
export type LongServiceeEnumType = z.infer<typeof LongServiceeEnum>;
