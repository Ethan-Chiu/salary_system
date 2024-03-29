export const isNumber = (parameter: any) =>
	Object.prototype.toString.call(parameter) === "[object Number]";
export const isString = (parameter: any) =>
	Object.prototype.toString.call(parameter) === "[object String]";
export function isDateType(parameter: any): parameter is Date {
	return Object.prototype.toString.call(parameter) === "[object Date]";
}

export function isDateString(input: string): boolean {
	const date = new Date(input);
	return !isNaN(date.getTime());
}
