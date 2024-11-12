import { injectable } from "tsyringe";
import { type z } from "zod";
import {
	updateEmployeePaymentService,
	type updateEmployeePaymentAPI,
} from "~/server/api/types/employee_payment_type";
import {
	convertDatePropertiesToISOString,
	deleteProperties,
} from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";
import {
	type EmployeePaymentDecType,
	type EmployeePaymentCreateEncType,
	encEmployeePayment,
	decEmployeePayment,
	type EmployeePayment,
} from "../entity/SALARY/employee_payment";
import { type CreationAttributes } from "sequelize";
import { type EmployeeData } from "../entity/SALARY/employee_data";
import { EmployeeDataService } from "~/server/service/employee_data_service";

@injectable()
export class EmployeePaymentMapper {
	constructor(private readonly employeeDataServic: EmployeeDataService) {}

	async encodeEmployeePayment(
		employee_payment: EmployeePaymentDecType
	): Promise<CreationAttributes<EmployeePayment>> {
		const encoded = encEmployeePayment.parse(employee_payment);

		return encoded;
	}

	async decodeEmployeePayment(
		employee_payment: EmployeePaymentCreateEncType
	): Promise<EmployeePaymentDecType> {
		const decoded = decEmployeePayment.parse(employee_payment);

		return deleteProperties(decoded, [
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
  
  async decodeEmployeePaymentList(
    employee_payment: EmployeePaymentCreateEncType[]
  ): Promise<EmployeePaymentDecType[]> {
    const decoded = await Promise.all(
      employee_payment.map(async (e) => this.decodeEmployeePayment(e))
    );
    return decoded;
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

	async getEmployeePaymentNullable(
		employee_payment: z.infer<typeof updateEmployeePaymentAPI>
	): Promise<z.infer<typeof updateEmployeePaymentService>> {
		const employeePayment: z.infer<typeof updateEmployeePaymentService> =
			updateEmployeePaymentService.parse(
				convertDatePropertiesToISOString({
					...employee_payment,
					base_salary_enc:
						employee_payment.base_salary != undefined
							? CryptoHelper.encrypt(
									employee_payment.base_salary.toString()
							  )
							: undefined,
					food_allowance_enc:
						employee_payment.food_allowance != undefined
							? CryptoHelper.encrypt(
									employee_payment.food_allowance.toString()
							  )
							: undefined,
					supervisor_allowance_enc:
						employee_payment.supervisor_allowance != undefined
							? CryptoHelper.encrypt(
									employee_payment.supervisor_allowance.toString()
							  )
							: undefined,
					occupational_allowance_enc:
						employee_payment.occupational_allowance != undefined
							? CryptoHelper.encrypt(
									employee_payment.occupational_allowance.toString()
							  )
							: undefined,
					subsidy_allowance_enc:
						employee_payment.subsidy_allowance != undefined
							? CryptoHelper.encrypt(
									employee_payment.subsidy_allowance.toString()
							  )
							: undefined,
					long_service_allowance_enc:
						employee_payment.long_service_allowance != undefined
							? CryptoHelper.encrypt(
									employee_payment.long_service_allowance.toString()
							  )
							: undefined,
					l_r_self_enc:
						employee_payment.l_r_self != undefined
							? CryptoHelper.encrypt(
									employee_payment.l_r_self.toString()
							  )
							: undefined,
					l_i_enc:
						employee_payment.l_i != undefined
							? CryptoHelper.encrypt(
									employee_payment.l_i.toString()
							  )
							: undefined,
					h_i_enc:
						employee_payment.h_i != undefined
							? CryptoHelper.encrypt(
									employee_payment.h_i.toString()
							  )
							: undefined,
					l_r_enc:
						employee_payment.l_r != undefined
							? CryptoHelper.encrypt(
									employee_payment.l_r.toString()
							  )
							: undefined,
					occupational_injury_enc:
						employee_payment.occupational_injury != undefined
							? CryptoHelper.encrypt(
									employee_payment.occupational_injury.toString()
							  )
							: undefined,
					
				})
			);

		return employeePayment;
	}
}
