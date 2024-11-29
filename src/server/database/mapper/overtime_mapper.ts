import { OvertimeFE, OvertimeFEType } from "~/server/api/types/overtime_type";
import { Overtime } from "../entity/UMEDIA/overtime";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { container } from "tsyringe";
import { EHRService } from "~/server/service/ehr_service";

export class OvertimeMapper {
	async getOvertimeFE(
		period_id: number,
		overtime_list: Overtime[]
	): Promise<OvertimeFEType[]> {
		const employee_data_service = container.resolve(EmployeeDataService);
		const ehr_service = container.resolve(EHRService);
		const OvertimeFE_list = await Promise.all(
			overtime_list.map(async (overtime) => {
				const employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						overtime.emp_no
					);

				const work_day =
					(
						await ehr_service.getPaysetByEmpNoList(period_id, [
							overtime.emp_no,
						])
					)[0]?.work_day ?? 30;
				return OvertimeFE.parse({
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
