export function formatDate(
	type: "day" | "hour",
	dateValue: Date | string | null
) {
	if (dateValue === "" || dateValue === null) return dateValue;
	const date = new Date(dateValue);
	switch (type) {
		case "day":
			return formatDateString(type, date.toISOString());
		case "hour":
			return formatDateString(type, date.toISOString());
		default:
			throw new Error("No Implement Error");
	}
}

function formatDateString(type: string, isoString: string):string {
	const date = new Date(isoString);

  let formattedDate: string;

	if (type === "hour") {
		formattedDate = date.toLocaleString("zh-Hans-TW", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			// timeZoneName: "short",
			timeZone: "UTC",
		});
	} else if (type === "day") {
		formattedDate = date.toLocaleString("zh-Hans-TW", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} else {
		formattedDate = date.toLocaleString("zh-Hans-TW");
	}

	// const formattedDate = date.toLocaleString("en", options as any);
	return formattedDate;
}
