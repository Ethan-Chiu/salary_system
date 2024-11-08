import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import {
	EmployeePayment,
	EmployeePaymentFEType,
	type EmployeePaymentDecType,
} from "../database/entity/SALARY/employee_payment";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { LevelRangeService } from "./level_range_service";
import { LevelService } from "./level_service";
import {
	employeePaymentCreateService,
	type updateEmployeePaymentService,
} from "../api/types/employee_payment_type";
import { EmployeePaymentMapper } from "../database/mapper/employee_payment_mapper";
import { EmployeeDataService } from "./employee_data_service";

@injectable()
export class EmployeePaymentService {
	async createEmployeePayment(
		data: z.input<typeof employeePaymentCreateService>
	): Promise<EmployeePayment> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);

		const {
			emp_no,
			base_salary,
			food_allowance,
			supervisor_allowance,
			occupational_allowance,
			subsidy_allowance,
			long_service_allowance,
			long_service_allowance_type,
			l_r_self,
			l_i,
			h_i,
			l_r,
			occupational_injury,
			start_date,
			end_date,
		} = employeePaymentCreateService.parse(data);

		const employeePayment =
			await employeePaymentMapper.encodeEmployeePayment({
				emp_no: emp_no,
				base_salary: base_salary,
				food_allowance: food_allowance,
				supervisor_allowance,
				occupational_allowance,
				subsidy_allowance,
				long_service_allowance,
				long_service_allowance_type,
				l_r_self,
				l_i,
				h_i,
				l_r,
				occupational_injury: occupational_injury,
				start_date: start_date ?? new Date(),
				end_date: end_date,
				disabled: false,
				create_by: "system",
				update_by: "system",
			});

		const newData = await EmployeePayment.create(employeePayment, {
			raw: true,
		});

		return newData;
	}

	async getEmployeePaymentById(
		id: number
	): Promise<EmployeePaymentDecType | null> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);

		const employeePayment = await EmployeePayment.findOne({
			where: {
				id: id,
			},
		});

		if (employeePayment == null) {
			return null;
		}

		return await employeePaymentMapper.decodeEmployeePayment(
			employeePayment
		);
	}

	async getEmployeePaymentByEmpNo(
		emp_no: string
	): Promise<EmployeePaymentDecType | null> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);

		const employeePayment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				disabled: false,
			},
		});

		if (employeePayment == null) {
			return null;
		}

		return await employeePaymentMapper.decodeEmployeePayment(
			employeePayment
		);
	}

	async getCurrentEmployeePayment(
		period_id: number
	): Promise<EmployeePaymentDecType[]> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
			raw: true,
		});

		const employeePaymentList = await Promise.all(
			employeePayment.map(
				async (e) =>
					await employeePaymentMapper.decodeEmployeePayment(e)
			)
		);

		return employeePaymentList;
	}

	async getCurrentEmployeePaymentById(
		id: number,
		period_id: number
	): Promise<EmployeePaymentDecType[]> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findAll({
			where: {
				id: id,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
		});

		const employeePaymentList = await Promise.all(
			employeePayment.map(
				async (e) =>
					await employeePaymentMapper.decodeEmployeePayment(e)
			)
		);

		return employeePaymentList;
	}

	async getCurrentEmployeePaymentByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<EmployeePaymentDecType | null> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
				disabled: false,
			},
		});

		if (employeePayment == null) {
			return null;
		}

		return await employeePaymentMapper.decodeEmployeePayment(
			employeePayment
		);
	}

	async getCurrentEmployeePaymentByEmpNoByDate(
		emp_no: string,
		date: Date
	): Promise<EmployeePaymentDecType | null> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		const employeePayment = await EmployeePayment.findOne({
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

		if (employeePayment == null) {
			return null;
		}

		return await employeePaymentMapper.decodeEmployeePayment(
			employeePayment
		);
	}

	async getAllEmployeePayment(): Promise<EmployeePaymentFEType[][]> {
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		const employeeDataService = container.resolve(EmployeeDataService);
		const allEmployeePayment = await EmployeePayment.findAll({
			where: {
				disabled: false,
			},
			order: [
				["emp_no", "ASC"],
				["start_date", "DESC"],
			],
			raw: true,
		});
		// 将记录按工号分组
		const groupedEmployeePaymenttRecords = {} as {
			[empNo: string]: EmployeePayment[];
		};

		allEmployeePayment.forEach((record) => {
			if (!groupedEmployeePaymenttRecords[record.emp_no]) {
				groupedEmployeePaymenttRecords[record.emp_no] = [];
			}
			groupedEmployeePaymenttRecords[record.emp_no]!.push(record);
		});

		// 将分组后的记录转换为数组格式，并映射为前端格式
		const groupedRecordsArray = Object.values(
			groupedEmployeePaymenttRecords
		);
		const employeePaymentList = await Promise.all(
			groupedRecordsArray.map(async (emp) => {
				const employee =
					await employeeDataService.getEmployeeDataByEmpNo(
						emp[0]!.emp_no
					);
				if (employee == null) {
					throw new BaseResponseError("Employee does not exist");
				}
				return Promise.all(
					emp.map((e) => {
						return {
							...e,
							department: employee.department,
							emp_name: employee.emp_name,
							position: employee.position,
							position_type: employee.position_type,
						};
					})
				);
			})
		);
		return employeePaymentList;
	}

	async updateEmployeePayment({
		id,
		emp_no,
		base_salary,
		food_allowance,
		supervisor_allowance,
		occupational_allowance,
		subsidy_allowance,
		long_service_allowance,
		long_service_allowance_type,
		l_r_self,
		l_i,
		h_i,
		l_r,
		occupational_injury,
		start_date,
		end_date,
	}: z.input<typeof updateEmployeePaymentService>): Promise<void> {
		const employeePayment = await this.getEmployeePaymentById(id);

		if (employeePayment == null) {
			throw new BaseResponseError("Employee Payment does not exist");
		}

		await this.deleteEmployeePayment(id);

		await this.createEmployeePayment({
			emp_no: select_value(emp_no, employeePayment.emp_no),
			base_salary: select_value(base_salary, employeePayment.base_salary),
			food_allowance: select_value(
				food_allowance,
				employeePayment.food_allowance
			),
			supervisor_allowance: select_value(
				supervisor_allowance,
				employeePayment.supervisor_allowance
			),
			occupational_allowance: select_value(
				occupational_allowance,
				employeePayment.occupational_allowance
			),
			subsidy_allowance: select_value(
				subsidy_allowance,
				employeePayment.subsidy_allowance
			),
			long_service_allowance: select_value(
				long_service_allowance,
				employeePayment.long_service_allowance
			),
			long_service_allowance_type: select_value(
				long_service_allowance_type,
				employeePayment.long_service_allowance_type
			),
			l_r_self: select_value(l_r_self, employeePayment.l_r_self),
			l_i: select_value(l_i, employeePayment.l_i),
			h_i: select_value(h_i, employeePayment.h_i),
			l_r: select_value(l_r, employeePayment.l_r),
			occupational_injury: select_value(
				occupational_injury,
				employeePayment.occupational_injury
			),
			start_date: select_value(start_date, employeePayment.start_date),
			end_date: select_value(end_date, employeePayment.end_date),
		});
	}

	async deleteEmployeePayment(id: number): Promise<void> {
		const destroyedRows = await EmployeePayment.update(
			{
				disabled: true,
			},
			{
				where: { id: id },
			}
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async autoCalculateEmployeePayment(
		emp_no_list: string[],
		start_date: Date
	): Promise<void> {
		const promises = emp_no_list.map(async (emp_no: string) => {
			const employeePayment =
				await this.getCurrentEmployeePaymentByEmpNoByDate(
					emp_no,
					start_date
				);

			if (employeePayment == null) {
				throw new BaseResponseError("Employee Payment does not exist");
			}

			if (employeePayment.end_date != null) {
				return;
			}

			const updatedEmployeePayment =
				await this._getUpdatedEmployeePayment(
					employeePayment,
					start_date
				);

			if (
				employeePayment.l_i != updatedEmployeePayment.l_i ||
				employeePayment.h_i != updatedEmployeePayment.h_i ||
				employeePayment.l_r != updatedEmployeePayment.l_r ||
				employeePayment.occupational_injury !=
					updatedEmployeePayment.occupational_injury
			) {
				await this.createEmployeePayment({
					...updatedEmployeePayment,
					start_date: start_date,
					end_date: null,
				});
			}
		});

		await Promise.all(promises);
	}

	async getEmployeePaymentAfterSelectValue({
		id,
		emp_no,
		base_salary,
		food_allowance,
		supervisor_allowance,
		occupational_allowance,
		subsidy_allowance,
		long_service_allowance,
		long_service_allowance_type,
		l_r_self,
		l_i,
		h_i,
		l_r,
		occupational_injury,
		start_date,
		end_date,
	}: z.infer<typeof updateEmployeePaymentService>): Promise<
		z.infer<typeof employeePaymentCreateService>
	> {
		const employeePayment = await this.getEmployeePaymentById(id);
		if (employeePayment == null) {
			throw new BaseResponseError("Employee Payment does not exist");
		}

		return {
			emp_no: select_value(emp_no, employeePayment.emp_no),
			base_salary: select_value(base_salary, employeePayment.base_salary),
			food_allowance: select_value(
				food_allowance,
				employeePayment.food_allowance
			),
			supervisor_allowance: select_value(
				supervisor_allowance,
				employeePayment.supervisor_allowance
			),
			occupational_allowance: select_value(
				occupational_allowance,
				employeePayment.occupational_allowance
			),
			subsidy_allowance: select_value(
				subsidy_allowance,
				employeePayment.subsidy_allowance
			),
			long_service_allowance: select_value(
				long_service_allowance,
				employeePayment.long_service_allowance
			),
			long_service_allowance_type: select_value(
				long_service_allowance_type,
				employeePayment.long_service_allowance_type
			),
			l_r_self: select_value(l_r_self, employeePayment.l_r_self),
			l_i: select_value(l_i, employeePayment.l_i),
			h_i: select_value(h_i, employeePayment.h_i),
			l_r: select_value(l_r, employeePayment.l_r),
			occupational_injury: select_value(
				occupational_injury,
				employeePayment.occupational_injury
			),
			start_date: select_value(start_date, employeePayment.start_date),
			end_date: select_value(end_date, employeePayment.end_date),
		};
	}

	async _getUpdatedEmployeePayment(
		employeePayment: EmployeePaymentDecType,
		date: Date
	): Promise<EmployeePaymentDecType> {
		const levelRangeService = container.resolve(LevelRangeService);
		const levelService = container.resolve(LevelService);
		const employeeDataService = container.resolve(EmployeeDataService);

		const salary =
			employeePayment.base_salary +
			employeePayment.food_allowance +
			employeePayment.supervisor_allowance +
			employeePayment.occupational_allowance +
			employeePayment.subsidy_allowance;

		const result = [];
		const levelRangeList =
			await levelRangeService.getCurrentLevelRangeByDate(date);
		for (const levelRange of levelRangeList) {
			const level = await levelService.getCurrentLevelBySalaryByDate(
				date,
				salary,
				levelRange.level_start_id,
				levelRange.level_end_id
			);
			result.push({
				type: levelRange.type,
				level: level.level,
			});
		}

		const employeeData = await employeeDataService.getEmployeeDataByEmpNo(
			employeePayment.emp_no
		);
		if (employeeData == null) {
			throw new BaseResponseError("Employee Data does not exist");
		}

		const updatedEmployeePayment = {
			...employeePayment,
			l_i: result.find((r) => r.type === "勞保")?.level ?? 0,
			h_i: result.find((r) => r.type === "健保")?.level ?? 0,
			l_r:
				employeeData.work_type != "外籍勞工"
					? result.find((r) => r.type === "勞退")?.level ?? 0
					: 0,
			occupational_injury:
				result.find((r) => r.type === "職災")?.level ?? 0,
		};

		return updatedEmployeePayment;
	}

	async rescheduleEmployeePayment(): Promise<void> {
		const employeePaymentList = await EmployeePayment.findAll({
			where: { disabled: false },
			order: [
				["emp_no", "ASC"],
				["start_date", "ASC"],
			],
		});

		for (let i = 0; i < employeePaymentList.length - 1; i += 1) {
			const end_date_string = get_date_string(
				new Date(employeePaymentList[i]!.end_date!)
			);
			const start_date = new Date(employeePaymentList[i + 1]!.start_date);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (
				employeePaymentList[i]!.emp_no ==
				employeePaymentList[i + 1]!.emp_no
			) {
				if (end_date_string != new_end_date_string) {
					await this.updateEmployeePayment({
						id: employeePaymentList[i]!.id,
						end_date: new Date(new_end_date_string),
					});
				}
			} else {
				if (end_date_string != null) {
					await this.updateEmployeePayment({
						id: employeePaymentList[i]!.id,
						end_date: null,
					});
				}
			}
		}
		if (
			employeePaymentList[employeePaymentList.length - 1]!.end_date !=
			null
		) {
			await this.updateEmployeePayment({
				id: employeePaymentList[employeePaymentList.length - 1]!.id,
				end_date: null,
			});
		}
	}
}
