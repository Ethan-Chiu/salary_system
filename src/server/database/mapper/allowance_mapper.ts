import { AllowanceFEType } from "~/server/api/types/allowance_type";
import { AllowanceWithType, EHRService } from "~/server/service/ehr_service";
import { convertDatePropertiesToISOString } from "./helper_function";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { container } from "tsyringe";

export class AllowanceMapper {
	async getAllowanceFE(
		allowance_with_type: AllowanceWithType
	): Promise<AllowanceFEType> {
		const employee_data_service = container.resolve(EmployeeDataService);
		const ehrService = container.resolve(EHRService);
		const employee_data =
			await employee_data_service.getEmployeeDataByEmpNo(
				allowance_with_type.emp_no!
			);
		const payset = (
			await ehrService.getPaysetByEmpNoList(
				allowance_with_type.period_id!,
				[allowance_with_type.emp_no!]
			)
		)[0];
		const allowanceFE: AllowanceFEType = {
			name: employee_data!.emp_name,
			department: employee_data!.department,
			position: employee_data!.position,
			work_day: payset ? payset.work_day! : 30,
			// note: allowance_with_type.note,
			...convertDatePropertiesToISOString(allowance_with_type),
		};
		return allowanceFE;
	}
}
