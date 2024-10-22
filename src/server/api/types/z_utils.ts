import { z } from "zod";

export function zStrTransEnum<T extends z.ZodEnum<any>>(zod_enum: T) {
	return z
		.string()
		.transform((value) => value.replace(/[\r\n]+$/, "")) // Trim \r\n
		.pipe(zod_enum);
}
