import { BaseResponseError } from "../api/error/BaseResponseError";

export function check_date(
	start_date: Date | null,
	end_date: Date | null,
	now: Date
) {
	if (end_date != null && end_date < (start_date ?? now)) {
		throw new BaseResponseError("End date is earlier than start date");
	}
}

export function get_date_string(date: Date): string {
	return date.toISOString().split("T")[0]!;
}

export function select_value(newData: any, oldData: any) {
	return newData !== undefined ? newData : oldData;
}
