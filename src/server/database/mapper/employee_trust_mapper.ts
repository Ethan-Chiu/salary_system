import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import {
	EmployeeTrust,
	EmployeeTrustDec,
	EmployeeTrustFE,
	updateEmployeeTrustAPI,
	updateEmployeeTrustService,
} from "~/server/api/types/employee_trust";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import {
	convertDatePropertiesToISOString,
	deleteProperties,
} from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";
import { TrustMoney } from "../entity/SALARY/trust_money";
import { TrustMoneyService } from "~/server/service/trust_money_service";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";

@injectable()
export class EmployeeTrustMapper {
	async getEmployeeTrust(
		employee_trust: z.infer<typeof EmployeeTrustDec>
	): Promise<z.infer<typeof EmployeeTrust>> {
		const employeeTrust: z.infer<typeof EmployeeTrust> =
			EmployeeTrust.parse(
				convertDatePropertiesToISOString({
					emp_trust_reserve_enc: CryptoHelper.encrypt(
						employee_trust.emp_trust_reserve.toString()
					),
					// org_trust_reserve_enc: CryptoHelper.encrypt(employee_trust.org_trust_reserve.toString()),
					emp_special_trust_incent_enc: CryptoHelper.encrypt(
						employee_trust.emp_special_trust_incent.toString()
					),
					// org_special_trust_incent_enc: CryptoHelper.encrypt(employee_trust.org_special_trust_incent.toString()),
					...employee_trust,
				})
			);

		return employeeTrust;
	}
	async getEmployeeTrustDec(
		employee_trust: z.infer<typeof EmployeeTrust>
		// trust_money: TrustMoney
	): Promise<z.infer<typeof EmployeeTrustDec>> {
		const employeeDataService = container.resolve(EmployeeDataService);
		const employee = await employeeDataService.getEmployeeDataByEmpNo(
			employee_trust!.emp_no
		);
		if (employee == null) {
			throw new BaseResponseError("Employee does not exist");
		}

		const employeeTrustDec: z.infer<typeof EmployeeTrustDec> =
			convertDatePropertiesToISOString({
				emp_no: employee.emp_no,
				emp_trust_reserve: Number(
					CryptoHelper.decrypt(employee_trust.emp_trust_reserve_enc)
				),
				emp_special_trust_incent: Number(
					CryptoHelper.decrypt(
						employee_trust.emp_special_trust_incent_enc
					)
				),
				start_date: employee_trust.start_date
					? new Date(employee_trust.start_date)
					: null,
				end_date: employee_trust.end_date
					? new Date(employee_trust.end_date)
					: null,
			});

		return deleteProperties(employeeTrustDec, [
			"emp_trust_reserve_enc",
			"emp_special_trust_incent_enc",
		]);
	}
	async getEmployeeTrustFE(
		employee_trust_list: z.infer<typeof EmployeeTrust>[]
		// trust_money: TrustMoney
	): Promise<z.infer<typeof EmployeeTrustFE>[]> {
		const employeeDataService = container.resolve(EmployeeDataService);
		const trustMoneyService = container.resolve(TrustMoneyService);
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const employee = await employeeDataService.getEmployeeDataByEmpNo(
			employee_trust_list[0]!.emp_no
		);
		if (employee == null) {
			throw new BaseResponseError("Employee does not exist");
		}
		const trust_money_list = await trustMoneyService.getAllTrustMoney();
		let start_dates = employee_trust_list
			.map((emp_trust) => emp_trust.start_date)
			.sort();
		trust_money_list.forEach((trust_money) => {
			if (
				trust_money.start_date > start_dates[0]! &&
				!start_dates.includes(trust_money.start_date)
			) {
				start_dates.push(trust_money.start_date);
			}
		});
		const promises = start_dates.sort().map(async (start_date, idx) => {
			const employee_trust =
				await employeeTrustService.getCurrentEmployeeTrustByEmpNoByDate(
					employee_trust_list[0]!.emp_no,
					start_date!
				);
			const trust_money =
				await trustMoneyService.getCurrentTrustMoneyByPositionByDate(
					employee.position,
					employee.position_type,
					start_date!
				);
			const org_trust_reserve = Math.min(
				trust_money!.org_trust_reserve_limit,
				Number(
					CryptoHelper.decrypt(employee_trust!.emp_trust_reserve_enc)
				)
			);
			const org_special_trust_incent = Math.min(
				trust_money!.org_special_trust_incent_limit,
				Number(
					CryptoHelper.decrypt(
						employee_trust!.emp_special_trust_incent_enc
					)
				)
			);
			const employeeTrustFE: z.infer<typeof EmployeeTrustFE> =
				convertDatePropertiesToISOString({
					emp_no: employee.emp_no,
					emp_name: employee.emp_name,
					position: employee.position,
					position_type: employee.position_type,
					department: employee.department,
					emp_trust_reserve: Number(
						CryptoHelper.decrypt(
							employee_trust!.emp_trust_reserve_enc
						)
					),
					org_trust_reserve: org_trust_reserve,
					emp_special_trust_incent: Number(
						CryptoHelper.decrypt(
							employee_trust!.emp_special_trust_incent_enc
						)
					),
					org_special_trust_incent: org_special_trust_incent,
					...employee_trust,
					start_date: new Date(start_date!),
					end_date: start_dates[idx + 1]
						? new Date (new Date(start_dates[idx + 1]!).setDate(
								new Date(start_dates[idx + 1]!).getDate() - 1
						))
						: null,
				});

			return deleteProperties(employeeTrustFE, [
				"emp_trust_reserve_enc",
				"emp_special_trust_incent_enc",
			]);
			// return new_emp_trust
		});
		await Promise.all(promises);
		const employee_trust_FE_list = await Promise.all(promises);
		return employee_trust_FE_list;
	}

	async getEmployeeTrustNullable(
		employee_trust: z.infer<typeof updateEmployeeTrustAPI>
	): Promise<z.infer<typeof updateEmployeeTrustService>> {
		const employeeTrust: z.infer<typeof updateEmployeeTrustService> =
			updateEmployeeTrustService.parse(
				convertDatePropertiesToISOString({
					emp_trust_reserve_enc:
						employee_trust.emp_trust_reserve != undefined
							? CryptoHelper.encrypt(
									employee_trust.emp_trust_reserve.toString()
							  )
							: undefined,
					// org_trust_reserve_enc:
					// 	employee_trust.org_trust_reserve != undefined
					// 		? CryptoHelper.encrypt(
					// 				employee_trust.org_trust_reserve.toString()
					// 		  )
					// 		: undefined,
					emp_special_trust_incent_enc:
						employee_trust.emp_special_trust_incent != undefined
							? CryptoHelper.encrypt(
									employee_trust.emp_special_trust_incent.toString()
							  )
							: undefined,
					// org_special_trust_incent_enc:
					// 	employee_trust.org_special_trust_incent != undefined
					// 		? CryptoHelper.encrypt(
					// 				employee_trust.org_special_trust_incent.toString()
					// 		  )
					// 		: undefined,
					...employee_trust,
				})
			);

		return employeeTrust;
	}
}
