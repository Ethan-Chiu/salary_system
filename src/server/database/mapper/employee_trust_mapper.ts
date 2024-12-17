import { delay, inject, injectable } from "tsyringe";
import { type z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import {
	type updateEmployeeTrustAPI,
	updateEmployeeTrustService,
	type employeeTrustFE,
} from "~/server/api/types/employee_trust_type";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { deleteProperties } from "./helper_function";
import { CryptoHelper } from "~/lib/utils/crypto";
import { TrustMoneyService } from "~/server/service/trust_money_service";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import {
	type EmployeeTrust,
	type EmployeeTrustDecType,
	decEmployeeTrust,
	encEmployeeTrust,
} from "../entity/SALARY/employee_trust";
import { BaseMapper } from "./base_mapper";

type EmployeeTrustServiceType = EmployeeTrustService;

@injectable()
export class EmployeeTrustMapper extends BaseMapper<
	EmployeeTrust,
	EmployeeTrustDecType
> {
	constructor(
		private readonly employeeDataService: EmployeeDataService,
		private readonly trustMoneyService: TrustMoneyService,
		@inject(delay(() => EmployeeTrustService))
		private readonly employeeTrustService: EmployeeTrustServiceType
	) {
		super(encEmployeeTrust, decEmployeeTrust);
	}

	async getEmployeeTrustFE(
		employee_trust_list: EmployeeTrustDecType[],
	): Promise<z.infer<typeof employeeTrustFE>[]> {
		const emp_first = employee_trust_list[0];
		if (!emp_first) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		const employee = await this.employeeDataService.getLatestEmployeeDataByEmpNo(
			emp_first.emp_no
		);

		if (employee == null) {
			throw new Error(`Employee does not exist, emp_no: ${emp_first.emp_no}`);
		}

		const trust_money_list =
			await this.trustMoneyService.getAllTrustMoney();

		const start_dates = employee_trust_list
			.map((emp_trust) => emp_trust.start_date)
			.sort((a, b) => a.getTime() - b.getTime());

		trust_money_list.forEach((trust_money) => {
			const trust_money_start_date = trust_money.start_date;
			if (
				trust_money_start_date.getTime() > start_dates[0]!.getTime() &&
				!start_dates
					.map((d) => d.getTime())
					.includes(trust_money_start_date.getTime())
			) {
				start_dates.push(trust_money_start_date);
			}
		});
		const promises = start_dates
			.sort((a, b) => a.getTime() - b.getTime())
			.map(async (start_date, idx) => {
				const employee_trust =
					await this.employeeTrustService.getCurrentEmployeeTrustByEmpNoByDate(
						employee_trust_list[0]!.emp_no,
						start_date
					);

				

				const trust_money =
					await this.trustMoneyService.getCurrentTrustMoneyByPositionByDate(
						employee.position,
						employee.position_type,
						start_date
					);
				
				const org_trust_reserve = Math.min(
					trust_money!.org_trust_reserve_limit,
					Number(
						CryptoHelper.decrypt(
							employee_trust.emp_trust_reserve_enc
						)
					)
				);
				const org_special_trust_incent = Math.min(
					trust_money!.org_special_trust_incent_limit,
					Number(
						CryptoHelper.decrypt(
							employee_trust.emp_special_trust_incent_enc
						)
					)
				);

				const employeeTrust: z.infer<typeof employeeTrustFE> = {
					...employee_trust,
					id: idx,
					emp_no: employee.emp_no,
					emp_name: employee.emp_name,
					position: employee.position,
					position_type: employee.position_type,
					department: employee.department,
					emp_trust_reserve: Number(
						CryptoHelper.decrypt(
							employee_trust.emp_trust_reserve_enc
						)
					),
					org_trust_reserve: org_trust_reserve,
					emp_special_trust_incent: Number(
						CryptoHelper.decrypt(
							employee_trust.emp_special_trust_incent_enc
						)
					),
					org_special_trust_incent: org_special_trust_incent,
					start_date: start_date,
					end_date: start_dates[idx + 1]
						? new Date(
								new Date(start_dates[idx + 1]!).setDate(
									new Date(start_dates[idx + 1]!).getDate() -
										1
								)
						  )
						: null,
					creatable: true,
					updatable: false,
					deletable: false,
				};

				return deleteProperties(employeeTrust, [
					"emp_trust_reserve_enc",
					"emp_special_trust_incent_enc",
				]);
				// return new_emp_trust
			});
		await Promise.all(promises);
		const employee_trust_FE_list = await Promise.all(promises);
		const reduced: z.infer<typeof employeeTrustFE>[] = [];
		const merged_employee_trust_FE_list = employee_trust_FE_list.reduce(
			(acc, cur) => {
				if (acc.length == 0) {
					acc.push(cur);
					return acc;
				}
				if (
					acc[acc.length - 1]!.emp_no == cur.emp_no &&
					acc[acc.length - 1]!.emp_trust_reserve ==
						cur.emp_trust_reserve &&
					acc[acc.length - 1]!.emp_special_trust_incent ==
						cur.emp_special_trust_incent &&
					acc[acc.length - 1]!.org_trust_reserve ==
						cur.org_trust_reserve &&
					acc[acc.length - 1]!.org_special_trust_incent ==
						cur.org_special_trust_incent
				) {
					acc[acc.length - 1]!.end_date = cur.end_date;
					return acc;
				} else {
					acc.push(cur);
					return acc;
				}
			},
			reduced
		);
		return merged_employee_trust_FE_list;
		// return employee_trust_FE_list
	}

	async getEmployeeTrustNullable(
		employee_trust: z.infer<typeof updateEmployeeTrustAPI>
	): Promise<z.infer<typeof updateEmployeeTrustService>> {
		const employeeTrust: z.infer<typeof updateEmployeeTrustService> =
			updateEmployeeTrustService.parse(
				// convertDatePropertiesToISOString(
				{
					emp_trust_reserve_enc:
						employee_trust.emp_trust_reserve != undefined
							? CryptoHelper.encrypt(
									employee_trust.emp_trust_reserve.toString()
							  )
							: undefined,
					emp_special_trust_incent_enc:
						employee_trust.emp_special_trust_incent != undefined
							? CryptoHelper.encrypt(
									employee_trust.emp_special_trust_incent.toString()
							  )
							: undefined,
					...employee_trust,
				}
				// )
			);

		return employeeTrust;
	}
}
