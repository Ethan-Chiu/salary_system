import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import { Op } from "sequelize";
import { EmployeeTrust } from "../database/entity/SALARY/employee_trust";
import { EHRService } from "./ehr_service";
import { EmployeeDataService } from "./employee_data_service";
import { TrustMoneyService } from "./trust_money_service";
import {
	createEmployeeTrustService,
	EmployeeTrustFE,
	updateEmployeeTrustService,
} from "../api/types/employee_trust";
import { EmployeeTrustMapper } from "../database/mapper/employee_trust_mapper";

@injectable()
export class EmployeeTrustService {
	/* constructor() {} */

	async createEmployeeTrust({
		emp_no,
		emp_trust_reserve_enc,
		// org_trust_reserve_enc,
		emp_special_trust_incent_enc,
		// org_special_trust_incent_enc,
		// entry_date,
		start_date,
		end_date,
	}: z.infer<typeof createEmployeeTrustService>): Promise<EmployeeTrust> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await EmployeeTrust.create({
			emp_no: emp_no,
			emp_trust_reserve_enc: emp_trust_reserve_enc,
			// org_trust_reserve_enc: org_trust_reserve_enc,
			emp_special_trust_incent_enc: emp_special_trust_incent_enc,
			// org_special_trust_incent_enc: org_special_trust_incent_enc,
			// entry_date: entry_date,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			disabled: false,
			create_by: "system",
			update_by: "system",
		});
		await this.createAndScheduleEmployeeTrust(newData.dataValues);
		return newData;
	}

	async getEmployeeTrustById(id: number): Promise<EmployeeTrust | null> {
		const employeeTrust = await EmployeeTrust.findOne({
			where: {
				id: id,
			},
			raw: true,
		});
		return employeeTrust;
	}

	async getCurrentEmployeeTrustFE(
		period_id: number
	): Promise<z.infer<typeof EmployeeTrustFE>[]> {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;

		// 获取所有的员工信任记录
		const allEmployeeTrustRecords =
			await employeeTrustService.getAllEmployeeTrust();
		if (allEmployeeTrustRecords == null) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		// 将记录按工号分组
		const groupedEmployeeTrustRecords = {} as {
			[empNo: string]: EmployeeTrust[];
		};

		allEmployeeTrustRecords.forEach((record) => {
			if (!groupedEmployeeTrustRecords[record.emp_no]) {
				groupedEmployeeTrustRecords[record.emp_no] = [];
			}
			groupedEmployeeTrustRecords[record.emp_no]!.push(record);
		});

		// 将分组后的记录转换为数组格式，并映射为前端格式
		const groupedRecordsArray = Object.values(groupedEmployeeTrustRecords);
		const allEmployeeTrustFE = await Promise.all(
			groupedRecordsArray.map(
				async (employeeTrustList) =>
					await employeeTrustMapper.getEmployeeTrustFE(
						employeeTrustList
					)
			)
		);
		const current_employee_trustFE = await Promise.all(
			allEmployeeTrustFE.map((emp_trust_list) =>
				emp_trust_list.find(
					(emp_trust) =>
						emp_trust.start_date! <= current_date_string &&
						(emp_trust.end_date == null ||
							emp_trust.end_date >= current_date_string)
				)
			)
		);
		return current_employee_trustFE;
	}

	async getCurrentEmployeeTrustFEByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<z.infer<typeof EmployeeTrustFE>> {
		const current_emp_trustFE = await this.getCurrentEmployeeTrustFE(
			period_id
		);
		return current_emp_trustFE.filter(
			(emp_trust) => emp_trust.emp_no == emp_no
		)[0]!;
	}

	async getAllEmployeeTrust(): Promise<EmployeeTrust[]> {
		const employeeTrust = await EmployeeTrust.findAll({
			where: { disabled: false },
			order: [["emp_no", "ASC"]],
			raw: true,
		});
		return employeeTrust;
	}
	async getAllEmployeeTrustFE(): Promise<
		z.infer<typeof EmployeeTrustFE>[][]
	> {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const employeeTrustMapper = container.resolve(EmployeeTrustMapper);

		// 获取所有的员工信任记录
		const allEmployeeTrustRecords =
			await employeeTrustService.getAllEmployeeTrust();
		if (allEmployeeTrustRecords == null) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		// 将记录按工号分组
		const groupedEmployeeTrustRecords = {} as {
			[empNo: string]: EmployeeTrust[];
		};

		allEmployeeTrustRecords.forEach((record) => {
			if (!groupedEmployeeTrustRecords[record.emp_no]) {
				groupedEmployeeTrustRecords[record.emp_no] = [];
			}
			groupedEmployeeTrustRecords[record.emp_no]!.push(record);
		});

		// 将分组后的记录转换为数组格式，并映射为前端格式
		const groupedRecordsArray = Object.values(groupedEmployeeTrustRecords);
		const allEmployeeTrustFE = await Promise.all(
			groupedRecordsArray.map(
				async (employeeTrustList) =>
					await employeeTrustMapper.getEmployeeTrustFE(
						employeeTrustList
					)
			)
		);
		return allEmployeeTrustFE;
	}
	async getAllEmployeeTrustByEmpNo(emp_no: string): Promise<EmployeeTrust[]> {
		const employeeTrust = await EmployeeTrust.findAll({
			where: { disabled: false, emp_no: emp_no },
			order: [["emp_no", "ASC"]],
			raw: true,
		});
		return employeeTrust;
	}

	async updateEmployeeTrust({
		id,
		emp_no,
		emp_trust_reserve_enc,
		// org_trust_reserve_enc,
		emp_special_trust_incent_enc,
		// org_special_trust_incent_enc,
		// entry_date,
		start_date,
		end_date,
	}: z.infer<typeof updateEmployeeTrustService>): Promise<void> {
		const employeeTrust = await this.getEmployeeTrustById(id);
		if (employeeTrust == null) {
			throw new BaseResponseError("Employee Trust does not exist");
		}

		await this.deleteEmployeeTrust(id);

		await this.createEmployeeTrust({
			emp_no: select_value(emp_no, employeeTrust.emp_no),
			emp_trust_reserve_enc: select_value(
				emp_trust_reserve_enc,
				employeeTrust.emp_trust_reserve_enc
			),
			// org_trust_reserve_enc: employeeTrust.org_trust_reserve_enc,
			emp_special_trust_incent_enc: select_value(
				emp_special_trust_incent_enc,
				employeeTrust.emp_special_trust_incent_enc
			),
			// org_special_trust_incent_enc: employeeTrust.org_special_trust_incent_enc,
			// entry_date: select_value(entry_date, employeeTrust.entry_date),
			start_date: select_value(start_date, employeeTrust.start_date),
			end_date: select_value(end_date, employeeTrust.end_date),
		});
	}

	async deleteEmployeeTrust(id: number): Promise<void> {
		const destroyedRows = await EmployeeTrust.update(
			{ disabled: true },
			{
				where: { id: id },
			}
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
	async rescheduleEmployeeTrust(): Promise<void> {
		const employeeTrustList = await EmployeeTrust.findAll({
			where: { disabled: false },
			order: [
				["emp_no", "ASC"],
				["start_date", "ASC"],
			],
		});
		for (let i = 0; i < employeeTrustList.length - 1; i += 1) {
			const end_date_string = get_date_string(
				new Date(employeeTrustList[i]!.end_date!)
			);
			const start_date = new Date(employeeTrustList[i + 1]!.start_date);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (
				employeeTrustList[i]!.emp_no == employeeTrustList[i + 1]!.emp_no
			) {
				if (end_date_string != new_end_date_string) {
					await this.updateEmployeeTrust({
						id: employeeTrustList[i]!.id,
						end_date: new_end_date_string,
					});
				}
			} else if (end_date_string != null) {
				await this.updateEmployeeTrust({
					id: employeeTrustList[i]!.id,
					end_date: null,
				});
			}
		}
		if (employeeTrustList[employeeTrustList.length - 1]!.end_date != null) {
			await this.updateEmployeeTrust({
				id: employeeTrustList[employeeTrustList.length - 1]!.id,
				end_date: null,
			});
		}
	}
	async createAndScheduleEmployeeTrust(
		new_emp_trust: EmployeeTrust
	): Promise<void> {
		const new_emp_trust_start_date = new Date(new_emp_trust.start_date);
		const new_emp_trust_end_date = new_emp_trust.end_date
			? new Date(new_emp_trust.end_date)
			: null;
		const allEmployeeTrust = (
			await this.getAllEmployeeTrustByEmpNo(new_emp_trust.emp_no)
		).filter((emp_trust) => emp_trust.id != new_emp_trust.id);
		//右端在裡面
		// const endOverlapList = allEmployeeTrust.filter(
		// 	(emp_trust) =>
		// 		emp_trust.start_date < new_emp_trust.start_date &&
		// 		(  (emp_trust.end_date == null && new_emp_trust.end_date == null) ||
		// 			(emp_trust.end_date! > new_emp_trust.start_date &&
		// 				emp_trust.end_date! <= new_emp_trust.end_date))

		// );
		//左端在裡面
		const startOverlapList = allEmployeeTrust.filter(
			(emp_trust) =>
				new_emp_trust.end_date !== null &&
				emp_trust.start_date <= new_emp_trust.end_date &&
				emp_trust.start_date >= new_emp_trust.start_date &&
				(emp_trust.end_date == null ||
					emp_trust.end_date > new_emp_trust.end_date)
		);
		//兩端都在裡面
		const twoEndInsideList = allEmployeeTrust.filter(
			(emp_trust) =>
				emp_trust.start_date >= new_emp_trust.start_date &&
				(new_emp_trust.end_date == null ||
					(emp_trust.end_date
						? emp_trust.end_date <= new_emp_trust.end_date
						: false))
		);
		//新資料被包在裡面
		const twoEndOutsideList = allEmployeeTrust.filter(
			(emp_trust) =>
				emp_trust.start_date < new_emp_trust.start_date &&
				new_emp_trust.end_date !== null &&
				(emp_trust.end_date
					? emp_trust.end_date > new_emp_trust.end_date
					: true)
		);
		console.log("new_emp_trust", new_emp_trust);
		// console.log("endOverlapList", endOverlapList);
		console.log("startOverlapList", startOverlapList);
		console.log("twoEndInsideList", twoEndInsideList);
		console.log("twoEndOutsideList", twoEndOutsideList);

		// endOverlapList.forEach(async (emp_trust) => {
		// 	await this.updateEmployeeTrust({
		// 		id: emp_trust.id,
		// 		end_date: get_date_string(
		// 			new Date(
		// 				new_emp_trust_start_date.setDate(
		// 					new_emp_trust_start_date.getDate() - 1
		// 				)
		// 			)
		// 		),
		// 	});
		// });
		await Promise.all(
			startOverlapList.map(async (emp_trust) => {
				await this.updateEmployeeTrust({
					id: emp_trust.id,
					start_date: get_date_string(
						new Date(
							new_emp_trust_end_date!.setDate(
								new_emp_trust_end_date!.getDate() + 1
							)
						)
					),
				});
			})
		);
		await Promise.all(
			twoEndInsideList.map(async (emp_trust) => {
				await this.deleteEmployeeTrust(emp_trust.id);
			})
		);
		await Promise.all(
			twoEndOutsideList.map(async (emp_trust) => {
				const originalEndDate = emp_trust.end_date;
				await this.createEmployeeTrust({
					emp_no: emp_trust.emp_no,
					emp_trust_reserve_enc: emp_trust.emp_trust_reserve_enc,
					emp_special_trust_incent_enc:
						emp_trust.emp_special_trust_incent_enc,
					start_date: get_date_string(
						new Date(
							new_emp_trust_end_date!.setDate(
								new_emp_trust_end_date!.getDate() + 1
							)
						)
					),
					end_date: originalEndDate,
				});
			})
		);
	}
	// async autoCalculateEmployeeTrust(
	// 	period_id: number,
	// 	emp_no_list: string[],
	// 	start_date: string
	// ): Promise<void> {
	// 	const employee_data_service = container.resolve(EmployeeDataService);
	// 	const trust_money_service = container.resolve(TrustMoneyService);
	// 	const employee_trust_mapper = container.resolve(EmployeeTrustMapper);

	// 	const promises = emp_no_list.map(async (emp_no: string) => {
	// 		const employeeTrust = await this.getCurrentEmployeeTrustByEmpNo(
	// 			emp_no,
	// 			period_id
	// 		);

	// 		if (employeeTrust == null) {
	// 			throw new BaseResponseError("Employee Trust does not exist");
	// 		}

	// 		if (employeeTrust.end_date != null) {
	// 			return;
	// 		}

	// 		const employee_data =
	// 			await employee_data_service.getEmployeeDataByEmpNo(emp_no);
	// 		if (employee_data == null) {
	// 			throw new BaseResponseError("Employee data does not exist");
	// 		}
	// 		const trust_money =
	// 			await trust_money_service.getCurrentTrustMoneyByPosition(
	// 				period_id,
	// 				employee_data.position,
	// 				employee_data.position_type
	// 			);
	// 		if (trust_money == null) {
	// 			return;
	// 		}

	// 		const employeeTrustDec =
	// 			await employee_trust_mapper.getEmployeeTrustDec(employeeTrust);

	// 		const originalEmployeeTrust =
	// 			await employee_trust_mapper.getEmployeeTrust(employeeTrustDec);

	// 		const updatedEmployeeTrust =
	// 			await employee_trust_mapper.getEmployeeTrust({
	// 				...employeeTrustDec,
	// 				// org_trust_reserve: Math.min(trust_money.org_trust_reserve_limit, employeeTrustFE.emp_trust_reserve),
	// 				// org_special_trust_incent:
	// 				// Math.min(trust_money.org_special_trust_incent_limit, employeeTrustFE.emp_special_trust_incent),
	// 			});

	// 		if (
	// 			originalEmployeeTrust.emp_trust_reserve_enc !=
	// 				updatedEmployeeTrust.emp_trust_reserve_enc ||
	// 			// originalEmployeeTrust.org_trust_reserve_enc != updatedEmployeeTrust.org_trust_reserve_enc ||
	// 			originalEmployeeTrust.emp_special_trust_incent_enc !=
	// 				updatedEmployeeTrust.emp_special_trust_incent_enc
	// 			// originalEmployeeTrust.org_special_trust_incent_enc != updatedEmployeeTrust.org_special_trust_incent_enc
	// 		) {
	// 			await this.createEmployeeTrust({
	// 				...updatedEmployeeTrust,
	// 				start_date: start_date,
	// 				end_date: null,
	// 			});
	// 		}
	// 	});

	// 	await Promise.all(promises);
	// }
	async getCurrentEmployeeTrustByEmpNoByDate(
		emp_no: string,
		date: string
	): Promise<EmployeeTrust | null> {
		const employeeTrust = await EmployeeTrust.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: date,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date }, { [Op.eq]: null }],
				},
				disabled: false,
			},
			raw: true,
		});
		return employeeTrust;
	}
}
