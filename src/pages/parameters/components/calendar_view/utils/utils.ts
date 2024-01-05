import dayjs from "dayjs";

export function getDayInMonth(mon: number | null): Array<Array<dayjs.Dayjs>> {
	let month = mon || new Date().getMonth();
	month = Number(month);
	const year = dayjs().year();
	const firstDayOfTheMonth = dayjs().year(year).month(month).date(1).day();
	let currentMonthCount = -firstDayOfTheMonth;
	const daysMatrix = Array.from({ length: 5 }, () => {
		return new Array(7).fill(null).map(() => {
			currentMonthCount++;
			return dayjs().year(year).month(month).date(currentMonthCount);
		});
	});
	return daysMatrix;
}
