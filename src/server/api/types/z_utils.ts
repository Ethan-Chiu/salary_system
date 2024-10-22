import { z } from "zod";

export function zStrTransEnum(zod_enum: z.ZodEnum<any>) {
	return z
		.string()
		.transform((value) => value.replace(/[\r\n]+$/, "")) // Trim \r\n
		.pipe(zod_enum);
}
