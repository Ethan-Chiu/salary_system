import { format } from "date-fns";
export function formatDate(type: "day" | "hour", dateValue: Date | string) {
	if (dateValue === "" || dateValue === null) return dateValue;
	let date = new Date(dateValue);
	switch (type) {
		case "day":
			return formatDateString(type, date.toISOString());
		case "hour":
			return formatDateString(type, date.toISOString());
		default:
			throw new Error("No Implement Error");
	}
}

function formatDateString(type: string, isoString: string) {
	const date = new Date(isoString);

	const options =
		type === "hour"
			? {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
					// timeZoneName: "short",
					timeZone: "UTC",
			  }
			: type === "day"
			? {
					year: "numeric",
					month: "long",
					day: "numeric",
			  }
			: {};

	const formattedDate = date.toLocaleString("zh-Hans-TW", options as any);
	// const formattedDate = date.toLocaleString("en", options as any);
	return formattedDate;
}
