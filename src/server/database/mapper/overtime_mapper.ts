import { overtimeFE, type OvertimeFEType } from "~/server/api/types/overtime_type";
import { type Overtime } from "../entity/UMEDIA/overtime";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EHRService } from "~/server/service/ehr_service";
import { injectable } from "tsyringe";

@injectable()
export class OvertimeMapper {
  constructor(
    private readonly employeeDataService: EmployeeDataService,
    private readonly ehrService: EHRService,
  ) {}

	async getOvertimeFE(
		period_id: number,
		overtime_list: Overtime[]
	): Promise<OvertimeFEType[]> {
		const OvertimeFE_list = await Promise.all(
			overtime_list.map(async (overtime) => {
				const employee_data =
					await this.employeeDataService.getEmployeeDataByEmpNo(
						overtime.emp_no
					);

				const work_day =
					(
						await this.ehrService.getPaysetByEmpNoList(period_id, [
							overtime.emp_no,
						])
					)[0]?.work_day ?? 30;

				return overtimeFE.parse({
					...overtime,
					department: employee_data!.department,
					emp_no: overtime.emp_no,
					emp_name: employee_data!.emp_name,
					position: employee_data!.position,
					work_day: work_day,
				});
			})
		);

		return OvertimeFE_list;
	}
}
