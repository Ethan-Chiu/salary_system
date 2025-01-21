import { HolidayFE, type HolidayFEType } from "~/server/api/types/holiday_type";
import { container, injectable } from "tsyringe";
import { Holiday } from "../entity/UMEDIA/holiday";
import { HolidaysTypeService } from "~/server/service/holidays_type_service";
import { EmployeeDataDecType } from "../entity/SALARY/employee_data";
import { Payset } from "../entity/UMEDIA/payset";

@injectable()
export class HolidayMapper {
	constructor() { }

	async getHolidayFE(
		holiday_list: Holiday[],
		employee_data_list: EmployeeDataDecType[],
		payset_list: Payset[]
	): Promise<HolidayFEType[]> {
		const groupedHolidayRecords: Record<string, Holiday[]> = {};

		holiday_list.forEach((record) => {
			if (!groupedHolidayRecords[record.emp_no]) {
				groupedHolidayRecords[record.emp_no] = [];
			}
			groupedHolidayRecords[record.emp_no]!.push(record);
		});

		// 将分组后的记录转换为数组格式，并映射为前端格式
		const groupedHolidayArray = Object.values(groupedHolidayRecords);
		const holidaysTypeService = container.resolve(HolidaysTypeService);
		const holidays_type =
			await holidaysTypeService.getCurrentHolidaysType();
		const special_personal_leave_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "特別事假"
			)?.pay_id ?? -1;
		const personal_leave_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "事假"
			)?.pay_id ?? -1;
		const full_attendance_personal_leave_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "有全勤事假"
			)?.pay_id ?? -1;
		const sick_leave_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "病假"
			)?.pay_id ?? -1;
		const full_attendance_sick_leave_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "有全勤病假"
			)?.pay_id ?? -1;
		const special_leave_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "特休"
			)?.pay_id ?? -1;
		const compensatory_leave_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "補休"
			)?.pay_id ?? -1;
		const non_leave_special_id =
			holidays_type.findLast(
				(holidayType) => holidayType.holidays_name === "不休假"
			)?.pay_id ?? -1;
		// const non_leave_compensatory_1_id = holidays_type.findLast(
		// 	(holidayType) => holidayType.holidays_name === "不休假-補休1"
		// )?.pay_id ?? -1;
		// const non_leave_compensatory_2_id = holidays_type.findLast(
		// 	(holidayType) => holidayType.holidays_name === "不休假-補休2"
		// )?.pay_id ?? -1;
		// const non_leave_compensatory_3_id = holidays_type.findLast(
		// 	(holidayType) => holidayType.holidays_name === "不休假-補休3"
		// )?.pay_id ?? -1;
		// const non_leave_compensatory_4_id = holidays_type.findLast(
		// 	(holidayType) => holidayType.holidays_name === "不休假-補休4"
		// )?.pay_id ?? -1;
		// const non_leave_compensatory_5_id = holidays_type.findLast(
		// 	(holidayType) => holidayType.holidays_name === "不休假-補休5"
		// )?.pay_id ?? -1;
		const HolidayFE_list = await Promise.all(
			groupedHolidayArray.map(async (holiday_list) => {
				const employee_data = employee_data_list.find((e) => e.emp_no === holiday_list[0]!.emp_no);
				const work_day = payset_list.find((p) => p.emp_no === holiday_list[0]!.emp_no)?.work_day ?? 30;
				let special_personal_leave = 0;
				let personal_leave = 0;
				let full_attendance_personal_leave = 0;
				let sick_leave = 0;
				let full_attendance_sick_leave = 0;
				let special_leave = 0;
				let compensatory_leave = 0;
				let non_leave_special = 0;
				let non_leave_compensatory_1 = 0;
				let non_leave_compensatory_2 = 0;
				let non_leave_compensatory_3 = 0;
				let non_leave_compensatory_4 = 0;
				let non_leave_compensatory_5 = 0;

				await Promise.all(
					holiday_list.map((holiday) => {
						if (holiday.pay_order === special_personal_leave_id) {
							special_personal_leave += holiday.total_hours;
						} else if (holiday.pay_order === personal_leave_id) {
							personal_leave += holiday.total_hours;
						} else if (
							holiday.pay_order ===
							full_attendance_personal_leave_id
						) {
							full_attendance_personal_leave +=
								holiday.total_hours;
						} else if (holiday.pay_order === sick_leave_id) {
							sick_leave += holiday.total_hours;
						} else if (
							holiday.pay_order === full_attendance_sick_leave_id
						) {
							full_attendance_sick_leave += holiday.total_hours;
						} else if (holiday.pay_order === special_leave_id) {
							special_leave += holiday.total_hours;
						} else if (
							holiday.pay_order === compensatory_leave_id
						) {
							compensatory_leave += holiday.total_hours;
						} else if (holiday.pay_order === non_leave_special_id) {
							non_leave_special += holiday.annual_1 ?? 0;
							non_leave_compensatory_1 +=
								holiday.compensatory_1 ?? 0;
							non_leave_compensatory_2 +=
								holiday.compensatory_134 ?? 0;
							non_leave_compensatory_3 +=
								holiday.compensatory_167 ?? 0;
							non_leave_compensatory_4 +=
								holiday.compensatory_2 ?? 0;
							non_leave_compensatory_5 +=
								holiday.compensatory_267 ?? 0;
						}
						// } else if (
						// 	holiday.pay_order === non_leave_compensatory_1_id
						// ) {
						// 	non_leave_compensatory_1 += holiday.total_hours;
						// } else if (
						// 	holiday.pay_order === non_leave_compensatory_2_id
						// ) {
						// 	non_leave_compensatory_2 += holiday.total_hours;
						// } else if (
						// 	holiday.pay_order === non_leave_compensatory_3_id
						// ) {
						// 	non_leave_compensatory_3 += holiday.total_hours;
						// } else if (
						// 	holiday.pay_order === non_leave_compensatory_4_id
						// ) {
						// 	non_leave_compensatory_4 += holiday.total_hours;
						// } else if (
						// 	holiday.pay_order === non_leave_compensatory_5_id
						// ) {
						// 	non_leave_compensatory_5 += holiday.total_hours;
						// }
					})
				);
				return HolidayFE.parse({
					department: employee_data!.department,
					emp_no: holiday_list[0]!.emp_no,
					emp_name: employee_data!.emp_name,
					position: employee_data!.position,
					work_day: work_day,
					special_personal_leave: special_personal_leave,
					personal_leave: personal_leave,
					full_attendance_personal_leave:
						full_attendance_personal_leave,
					sick_leave: sick_leave,
					full_attendance_sick_leave: full_attendance_sick_leave,
					special_leave: special_leave,
					compensatory_leave: compensatory_leave,
					non_leave_special: non_leave_special,
					non_leave_compensatory_1: non_leave_compensatory_1,
					non_leave_compensatory_2: non_leave_compensatory_2,
					non_leave_compensatory_3: non_leave_compensatory_3,
					non_leave_compensatory_4: non_leave_compensatory_4,
					non_leave_compensatory_5: non_leave_compensatory_5,
				});
			})
		);

		return HolidayFE_list;
	}
}
