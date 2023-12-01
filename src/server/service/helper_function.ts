import { BaseResponseError } from "../api/error/BaseResponseError";

export function check_date(
	start_date: string | null,
	end_date: string | null,
	current_date_string: string
) {
	if (end_date != null && end_date < (start_date ?? current_date_string)) {
		throw new BaseResponseError("End date is earlier than start date");
	}
}

export function get_date_string(date: Date): string {
	return date.toISOString().split("T")[0]!;
}

export function select_value(newData: any, oldData: any) {
	return newData !== undefined ? newData : oldData;
}
