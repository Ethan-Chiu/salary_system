import { EmployeeDataService } from "~/server/service/employee_data_service";
import { container } from "tsyringe";
import { EHRService, HolidayWithType } from "~/server/service/ehr_service";
import { Holiday } from "../entity/UMEDIA/holiday";
import { HolidayFE, HolidayFEType } from "~/server/api/types/holiday_type";

export class HolidayMapper {
	async getHolidayFE(
		period_id: number,
		holiday_with_type_list: HolidayWithType[]
	): Promise<HolidayFEType[]> {
		const employee_data_service = container.resolve(EmployeeDataService);
		const ehr_service = container.resolve(EHRService);
		const HolidayFE_list = await Promise.all(
			holiday_with_type_list.map(async (holiday) => {
				const employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						holiday.emp_no
					);

				const work_day =
					(
						await ehr_service.getPaysetByEmpNoList(period_id, [
							holiday.emp_no,
						])
					)[0]?.work_day ?? 30;
				return HolidayFE.parse({
                    ...holiday,
					department: employee_data!.department,
					emp_no: holiday.emp_no,
					emp_name: employee_data!.emp_name,
					position: employee_data!.position,
					work_day: work_day,
				});
			})
		);

        return HolidayFE_list;
	}
}
