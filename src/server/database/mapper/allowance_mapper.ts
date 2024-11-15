import {
	NewAllowanceFEType,
	type AllowanceFEType,
} from "~/server/api/types/allowance_type";
import {
	type AllowanceWithType,
	EHRService,
} from "~/server/service/ehr_service";
import { convertDatePropertiesToISOString } from "./helper_function";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { container } from "tsyringe";
import { EmployeePayment, EmployeePaymentDecType } from "../entity/SALARY/employee_payment";

export class AllowanceMapper {
	async getAllowanceFE(
		allowance_with_type: AllowanceWithType
	): Promise<AllowanceFEType> {
		const employee_data_service = container.resolve(EmployeeDataService);
		const ehrService = container.resolve(EHRService);
		const employee_data =
			await employee_data_service.getEmployeeDataByEmpNo(
				allowance_with_type.emp_no
			);
		const payset = (
			await ehrService.getPaysetByEmpNoList(
				allowance_with_type.period_id,
				[allowance_with_type.emp_no]
			)
		)[0];
		const allowanceFE: AllowanceFEType = {
			...convertDatePropertiesToISOString(allowance_with_type),
			name: employee_data!.emp_name,
			department: employee_data!.department,
			position: employee_data!.position,
			work_day: payset ? payset.work_day! : 30,
			// note: allowance_with_type.note,
		};
		return allowanceFE;
	}
	async getNewAllowanceFE(
		period_id: number,
		allowanceFE_list: AllowanceFEType[],
		employee_payment_list: EmployeePaymentDecType[]
	): Promise<NewAllowanceFEType[]> {
		const ehrService = container.resolve(EHRService);
		const employee_data_service = container.resolve(EmployeeDataService);
		const new_allowanceFE_list: NewAllowanceFEType[] = await Promise.all(
			employee_payment_list.map(async (employee_payment) => {
				const employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						employee_payment.emp_no
					);
				const payset = (
					await ehrService.getPaysetByEmpNoList(
						period_id,
						[employee_payment.emp_no]
					)
				)[0];
				return {
					...employee_payment,
					emp_no: employee_payment.emp_no,
					name: employee_data!.emp_name,
					department: employee_data!.department,
					position: employee_data!.position,
					work_day: payset!.work_day,
					shift_allowance: allowanceFE_list.findLast(
						(allowanceFE) => allowanceFE.emp_no === employee_payment.emp_no && allowanceFE.allowance_type_name === "輪班津貼"
					)?.amount ?? 0,
					certificate_allowance: allowanceFE_list.findLast(
						(allowanceFE) => allowanceFE.emp_no === employee_payment.emp_no && allowanceFE.allowance_type_name === "證照津貼"
					)?.amount ?? 0,
				};
			})
		);
		return new_allowanceFE_list;
	}
}
