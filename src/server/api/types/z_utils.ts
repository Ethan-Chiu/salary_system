import { z } from "zod";
import { CryptoHelper } from "~/lib/utils/crypto";

export const stringToEnum = z
	.string()
	.transform((value) => value.replace(/[\r\n]+$/, "")); // Trim \r\n

// Directly return ISO string
export const dateToISOString = z
	.date()
	.transform((value) => value.toISOString());

// Adjust for the timezone, return YYYY-MM-DD
function get_date_string(date: Date): string {
	const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
	const localISOTime = new Date(date.getTime() - tzoffset)
		.toISOString()
		.slice(0, -1);
	return localISOTime.split("T")[0]!;
}

export const dateToString = z
	.date()
	.transform((value) => get_date_string(value));

export const dateToStringNullable = z
	.date()
	.nullable()
	.transform((value) => (value ? get_date_string(value) : null));

export const encodeString = z
	.string()
	.transform((value) => CryptoHelper.encrypt(value));

export const decodeString = z
	.string()
	.transform((value) => CryptoHelper.decrypt(value));

export const optionalNumDefaultZero = z
	.number()
	.optional()
	.default(0)
