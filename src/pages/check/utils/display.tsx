import { formatDate } from "~/lib/utils/format_date";

export function isValidDateString(input: string): string | undefined {
	// Check if the string matches the yyyy/mm/dd format
	const yyyy_mm_ddRegex = /^\d{4}\/\d{2}\/\d{2}$/;

	// Check if the string matches the yyyy-mm-ddThh:mm:ss.xxxZ format
	const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

	if (yyyy_mm_ddRegex.test(input)) return "day";
	if (isoDateTimeRegex.test(input)) return "hour";
	return undefined;
}

export const displayData = (data: string | number | Date) => {
	if (typeof data === "boolean") return data ? "True" : "False";
	if (typeof data === "number") return data;

	if (typeof data === "string") {
		let dateCheck = isValidDateString(data);
		if (dateCheck) return formatDate(dateCheck as "day" | "hour", data);
		return data;
	}
};