import { injectable } from "tsyringe";
import {
	type EmployeePaymentDecType,
	encEmployeePayment,
	decEmployeePayment,
	type EmployeePayment,
} from "../entity/SALARY/employee_payment";
import { type EmployeeData } from "../entity/SALARY/employee_data";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseMapper } from "./base_mapper";

@injectable()
export class EmployeePaymentMapper extends BaseMapper<
	EmployeePayment,
	EmployeePaymentDecType
> {
	constructor(private readonly employeeDataServic: EmployeeDataService) {
		super(encEmployeePayment, decEmployeePayment, [
			"base_salary_enc",
			"supervisor_allowance_enc",
			"occupational_allowance_enc",
			"subsidy_allowance_enc",
			"food_allowance_enc",
			"long_service_allowance_enc",
			"l_r_self_enc",
			"l_i_enc",
			"h_i_enc",
			"l_r_enc",
			"occupational_injury_enc",
		]);
	}

	async includeEmployee<
		Data extends EmployeePaymentDecType | EmployeePaymentDecType[],
		K extends Partial<keyof EmployeeData>
	>(
		data: Data,
		keys: K[]
	): Promise<(EmployeePaymentDecType & Pick<EmployeeData, K>)[]> {
		const employeeDataRecord: Record<string, EmployeeData> = {};

		const dataList: EmployeePaymentDecType[] = Array.isArray(data)
			? data
			: [data];

		const uniqueEmpNos = new Set<string>();
		dataList.forEach((item) => {
			uniqueEmpNos.add(item.emp_no);
		});
		const uniqueEmpNoList = Array.from(uniqueEmpNos);

		await Promise.all(
			uniqueEmpNoList.map(async (empNo) => {
				const emp =
					await this.employeeDataServic.getEmployeeDataByEmpNo(empNo);
				if (!emp) {
					throw new Error(`Employee ${empNo} not found`);
				}
				employeeDataRecord[empNo] = emp;
			})
		);

		const resultList: (EmployeePaymentDecType & Pick<EmployeeData, K>)[] =
			dataList.map((d) => {
				const empNo = d.emp_no;
				const emp = employeeDataRecord[empNo];
				const result = { ...d } as EmployeePaymentDecType &
					Pick<EmployeeData, K>;
				if (emp) {
					keys.forEach((key) => {
						result[key] = emp[key] as any;
					});
				} else {
					throw new Error(`Employee ${empNo} not found`);
				}
				return result;
			});

		return resultList;
	}
}
