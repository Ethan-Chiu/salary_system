import { container, injectable } from "tsyringe";
import { type z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import {
	updateEmployeePaymentService,
	type updateEmployeePaymentAPI,
	type EmployeePaymentFEType,
} from "~/server/api/types/employee_payment_type";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import {
	convertDatePropertiesToISOString,
	deleteProperties,
} from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";
import {
	type EmployeePaymentCreateDecType,
	type EmployeePaymentCreateEncType,
	enc,
	dec,
	type EmployeePayment,
} from "../entity/SALARY/employee_payment";
import { type CreationAttributes } from "sequelize";

@injectable()
export class EmployeePaymentMapper {
	async encodeEmployeePayment(
		employee_payment: EmployeePaymentCreateDecType
	): Promise<CreationAttributes<EmployeePayment>> {
		const encoded = enc.parse(employee_payment);

		const dbenc = {
			...encoded,
			disabled: true,
			create_by: "sysjjhjjj",
			update_by: "syste",
		};

		return dbenc;
	}

	async decodeEmployeePayment (
		employee_payment: EmployeePaymentCreateEncType
	): Promise<EmployeePaymentCreateDecType> {

		const employeeDataService = container.resolve(EmployeeDataService);
		const employee = await employeeDataService.getEmployeeDataByEmpNo(
			employee_payment.emp_no
		);
		if (employee == null) {
			throw new BaseResponseError("Employee does not exist");
		}

		const decoded = dec.parse(employee_payment);

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

	async getEmployeePaymentNullable(
		employee_payment: z.infer<typeof updateEmployeePaymentAPI>
	): Promise<z.infer<typeof updateEmployeePaymentService>> {
		const employeePayment: z.infer<typeof updateEmployeePaymentService> =
			updateEmployeePaymentService.parse(
				convertDatePropertiesToISOString({
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
					...employee_payment,
				})
			);

		return employeePayment;
	}
}
