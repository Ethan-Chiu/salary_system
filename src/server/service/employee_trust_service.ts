import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import { Op } from "sequelize";
import {
	EmployeeTrust,
	type EmployeeTrustDecType,
	type encEmployeeTrust,
} from "../database/entity/SALARY/employee_trust";
import { EHRService } from "./ehr_service";
import {
	employeeTrustCreateService,
	type employeeTrustFE,
	type updateEmployeeTrustService,
} from "../api/types/employee_trust_type";
import { EmployeeTrustMapper } from "../database/mapper/employee_trust_mapper";
import { dateToString, stringToDate } from "../api/types/z_utils";

@injectable()
export class EmployeeTrustService {
	constructor(
		private readonly employeeTrustMapper: EmployeeTrustMapper,
		private readonly ehrService: EHRService
	) { }

	async createEmployeeTrust(
		data: z.input<typeof employeeTrustCreateService>
	): Promise<EmployeeTrust> {
		console.log("data", data);
		const d = employeeTrustCreateService.parse(data);
		console.log("d", d);
		const create_input = {
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		};
		console.log("create_input", create_input);
		const employeeTrust =
			await this.employeeTrustMapper.encodeEmployeeTrust(create_input);

		console.log("employeeTrust", employeeTrust);

		const newData = await EmployeeTrust.create(employeeTrust, {
			raw: true,
		});

		await this.createAndScheduleEmployeeTrust(newData.id, create_input);

		return newData;
	}

	async getEmployeeTrustById(
		id: number
	): Promise<EmployeeTrustDecType | null> {
		const employeeTrust = await EmployeeTrust.findOne({
			where: {
				id: id,
			},
			raw: true,
		});

		if (employeeTrust == null) {
			return null;
		}

		return await this.employeeTrustMapper.decodeEmployeeTrust(
			employeeTrust
		);
	}

	async getAllEmployeeTrust(): Promise<EmployeeTrustDecType[]> {
		const employeeTrust = await EmployeeTrust.findAll({
			where: { disabled: false },
			order: [["emp_no", "ASC"]],
			raw: true,
		});

		return await this.employeeTrustMapper.decodeEmployeeTrustList(
			employeeTrust
		);
	}

	async getAllEmployeeTrustByEmpNo(
		emp_no: string
	): Promise<EmployeeTrustDecType[]> {
		const employeeTrust = await EmployeeTrust.findAll({
			where: { disabled: false, emp_no: emp_no },
			order: [["emp_no", "ASC"]],
			raw: true,
		});

		return await this.employeeTrustMapper.decodeEmployeeTrustList(
			employeeTrust
		);
	}

	async getCurrentEmployeeTrustFE(
		period_id: number
	): Promise<z.infer<typeof employeeTrustFE>[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date = stringToDate.parse(period.end_date);

		// 获取所有的员工信任记录
		const allEmployeeTrustRecords = await this.getAllEmployeeTrust();
		if (allEmployeeTrustRecords == null) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		// 将记录按工号分组
		const groupedEmployeeTrustRecords: Record<
			string,
			EmployeeTrustDecType[]
		> = {};

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
					await this.employeeTrustMapper.getEmployeeTrustFE(
						employeeTrustList
					)
			)
		);
		const current_employee_trustFE = await Promise.all(
			allEmployeeTrustFE.map((emp_trust_list) => {
				const current_emp_trust = emp_trust_list.find((emp_trust) => {
					return (
						emp_trust.start_date! <= current_date &&
						(emp_trust.end_date == null ||
							emp_trust.end_date >= current_date)
					);
				})
				if (current_emp_trust) {
					return current_emp_trust
				}
				return null;
			})
		);
		return current_employee_trustFE.filter((emp_trust) => emp_trust != null) as z.infer<typeof employeeTrustFE>[];
	}

	async getCurrentEmployeeTrustFEByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<z.infer<typeof employeeTrustFE>> {
		const current_emp_trustFE = await this.getCurrentEmployeeTrustFE(
			period_id
		);
		return current_emp_trustFE.filter(
			(emp_trust) => emp_trust.emp_no == emp_no
		)[0]!;
	}

	async getAllEmployeeTrustFE(): Promise<
		z.infer<typeof employeeTrustFE>[][]
	> {
		// 获取所有的员工信任记录
		const allEmployeeTrustRecords = await this.getAllEmployeeTrust();
		if (allEmployeeTrustRecords == null) {
			throw new BaseResponseError("Employee trust records do not exist");
		}

		// 将记录按工号分组
		const groupedEmployeeTrustRecords: Record<
			string,
			EmployeeTrustDecType[]
		> = {};

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
					await this.employeeTrustMapper.getEmployeeTrustFE(
						employeeTrustList
					)
			)
		);
		return allEmployeeTrustFE;
	}

	async updateEmployeeTrust({
		id,
		emp_no,
		emp_trust_reserve,
		emp_special_trust_incent,
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
			emp_trust_reserve: select_value(
				emp_trust_reserve,
				employeeTrust.emp_trust_reserve
			),
			// org_trust_reserve_enc: employeeTrust.org_trust_reserve_enc,
			emp_special_trust_incent: select_value(
				emp_special_trust_incent,
				employeeTrust.emp_special_trust_incent
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
			const end_date_string = employeeTrustList[i]!.end_date? get_date_string(
				new Date(employeeTrustList[i]!.end_date!)
			):null;
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
						end_date: new Date(new_end_date_string),
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
		new_emp_id: number,
		new_emp_trust: z.input<typeof encEmployeeTrust>
	): Promise<void> {
		const new_emp_trust_start_date = new Date(new_emp_trust.start_date);
		const new_emp_trust_end_date = new_emp_trust.end_date
			? new Date(new_emp_trust.end_date)
			: null;
		const allEmployeeTrust = (
			await this.getAllEmployeeTrustByEmpNo(new_emp_trust.emp_no)
		).filter((emp_trust) => emp_trust.id != new_emp_id);
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
					start_date: new Date(
						new_emp_trust_end_date!.setDate(
							new_emp_trust_end_date!.getDate() + 1
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
				await this.createEmployeeTrust({
					emp_no: emp_trust.emp_no,
					emp_trust_reserve: emp_trust.emp_trust_reserve,
					emp_special_trust_incent:
						emp_trust.emp_special_trust_incent,
					start_date: new Date(
						new_emp_trust_end_date!.setDate(
							new_emp_trust_end_date!.getDate() + 1
						)
					),
					end_date: emp_trust.end_date,
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
		date: Date
	): Promise<EmployeeTrust | null> {
		const date_str = dateToString.parse(date);

		const employeeTrust = await EmployeeTrust.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: date_str,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date_str }, { [Op.eq]: null }],
				},
				disabled: false,
			},
			raw: true,
		});
		return employeeTrust;
	}
}
