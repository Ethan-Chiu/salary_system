import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EHRService, type HolidayWithType } from "~/server/service/ehr_service";
import { HolidayFE, type HolidayFEType } from "~/server/api/types/holiday_type";
import { injectable } from "tsyringe";

@injectable()
export class HolidayMapper {
  constructor(
    private readonly ehrService: EHRService,
    private readonly employeeDataService: EmployeeDataService,
  ) {}

	async getHolidayFE(
		period_id: number,
		holiday_with_type_list: HolidayWithType[]
	): Promise<HolidayFEType[]> {
		const HolidayFE_list = await Promise.all(
			holiday_with_type_list.map(async (holiday) => {
				const employee_data =
					await this.employeeDataService.getEmployeeDataByEmpNo(
						holiday.emp_no
					);

				const work_day =
					(
						await this.ehrService.getPaysetByEmpNoList(period_id, [
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
