import { container, injectable } from "tsyringe";
import { type z } from "zod";
import { EmployeeBonus } from "../database/entity/SALARY/employee_bonus";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { Round, select_value } from "./helper_function";
import { type BonusTypeEnumType } from "../api/types/bonus_type_enum";
import { BonusWorkTypeService } from "./bonus_work_type_service";
import { BonusPositionService } from "./bonus_position_service";
import { BonusSeniorityService } from "./bonus_seniority_service";
import { BonusDepartmentService } from "./bonus_department_service";
import { EmployeeDataService } from "./employee_data_service";
import { EHRService } from "./ehr_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { EmployeeBonusMapper } from "../database/mapper/employee_bonus_mapper";
import {
	createEmployeeBonusService,
	type updateEmployeeBonusService,
} from "../api/types/employee_bonus_type";
import { BonusAllService } from "./bonus_all_service";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { Op } from "sequelize";

@injectable()
export class EmployeeBonusService {
	constructor(
		private readonly ehrService: EHRService,
		private readonly employeeBonusMapper: EmployeeBonusMapper
	) {}

	async createEmployeeBonus(
		data: z.input<typeof createEmployeeBonusService>
	): Promise<EmployeeBonus> {
		const d = createEmployeeBonusService.parse(data);

		const employeeBonus = await this.employeeBonusMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await EmployeeBonus.create(employeeBonus, {
			raw: true,
		});

		return newData;
	}

	async createEmployeeBonusByEmpNoList(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		emp_no_list: string[]
	) {
		const employeeBonus = await this.getAllEmployeeBonus(
			period_id,
			bonus_type
		);

		const promises = emp_no_list.map(async (emp_no) => {
			if (employeeBonus.find((e) => e.emp_no === emp_no)) {
				return;
			}
			await this.createEmployeeBonus({
				period_id: period_id,
				bonus_type: bonus_type,
				emp_no: emp_no,
				special_multiplier: 0,
				multiplier: 0,
				fixed_amount: 0,
				bud_effective_salary: 0,
				bud_amount: 0,
				sup_performance_level: null,
				sup_effective_salary: null,
				sup_amount: null,
				app_performance_level: null,
				app_effective_salary: null,
				app_amount: null,
				start_date: null,
				end_date: null,
			});
		});

		await Promise.all(promises);
	}

	async getEmployeeBonusById(id: number) {
		const result = await EmployeeBonus.findByPk(id);
		return await this.employeeBonusMapper.decode(result);
	}

	async getEmployeeBonusByEmpNoByType(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		emp_no: string
	) {
		const result = await EmployeeBonus.findOne({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				emp_no: emp_no,
				disabled: false,
			},
			raw: true
		});
		if (result === null) {
			return null
		}
		return await this.employeeBonusMapper.decode(result);
	}

	async getEmployeeBonusByEmpNo(period_id: number, emp_no: string) {
		const empList = await EmployeeBonus.findAll({
			where: {
				period_id: period_id,
				emp_no: emp_no,
				disabled: false,
			},
		});

		return await this.employeeBonusMapper.decodeList(empList);
	}

	async getAllEmployeeBonus(
		period_id: number,
		bonus_type: BonusTypeEnumType
	) {
		const result = await EmployeeBonus.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
		});
		return await this.employeeBonusMapper.decodeList(result);
	}

	async getEmployeeBonus(period_id: number, bonus_type: BonusTypeEnumType) {
		const result = await EmployeeBonus.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				// special_multiplier: {
				// 	[Op.gt]: 0,
				// },
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
		});
		return await this.employeeBonusMapper.decodeList(result);
	}

	async getAccumulatedBonus(period_id: number, emp_no: string) {
		const period_name = await this.ehrService
			.getPeriodById(period_id)
			.then((period) => period.period_name);
		let start_period_id = 0;
		if (period_name.split("-")[0] === "DEC") {
			start_period_id = (
				await this.ehrService.getPeriodByName(period_name)
			).period_id;
		} else {
			const year = String(parseInt(period_name.split("-")[1]!) - 1);
			start_period_id = (
				await this.ehrService.getPeriodByName("DEC-" + year)
			).period_id;
		}
		const end_period_id = period_id;
		const result = await EmployeeBonus.findAll({
			where: {
				period_id: {
					[Op.between]: [start_period_id, end_period_id - 1],
				},
				emp_no: emp_no,
				// special_multiplier: {
				// 	[Op.gt]: 0,
				// },
				disabled: false,
			},
			order: [["emp_no", "ASC"]],
		});
    const empBonusList = await this.employeeBonusMapper.decodeList(result);

		let sum = 0;
		const promises = empBonusList.map(async (e) => {
			const amount = (
				await this.employeeBonusMapper.getEmployeeBonusFE(e)
			).app_amount!;
			sum += amount;
		});
		await Promise.all(promises);

		return sum;
	}

	async initCandidateEmployeeBonus(
		period_id: number,
		bonus_type: BonusTypeEnumType
	) {
		const all_emp_bonus_list = await this.getAllEmployeeBonus(
			period_id,
			bonus_type
		);
		const bonus_all_service = container.resolve(BonusAllService);
		const bonus_work_type_service = container.resolve(BonusWorkTypeService);
		const bonus_position_service = container.resolve(BonusPositionService);
		// const bonus_position_type_service = container.resolve(
		// 	BonusPositionTypeService
		// );
		const bonus_seniority_service = container.resolve(
			BonusSeniorityService
		);
		const bonus_department_service = container.resolve(
			BonusDepartmentService
		);
		const ehr_service = container.resolve(EHRService);
		const employee_data_service = container.resolve(EmployeeDataService);
		const issue_date = (await ehr_service.getPeriodById(period_id))
			.issue_date;

		const promises = all_emp_bonus_list.map(async (emp) => {
			const employee_data =
				await employee_data_service.getEmployeeDataByEmpNo(emp.emp_no);
			if (!employee_data) {
				return;
			}
			const special_multiplier =
				(await bonus_all_service.getMultiplier(period_id, bonus_type)) *
				(await bonus_work_type_service.getMultiplier(
					period_id,
					bonus_type,
					employee_data.work_type
				)) *
				(await bonus_position_service.getMultiplier(
					period_id,
					bonus_type,
					employee_data.position,
					employee_data.position_type
				)) *
				(await bonus_seniority_service.getMultiplier(
					period_id,
					bonus_type,
					Math.floor(
						(new Date(issue_date).getTime() -
							new Date(
								employee_data.registration_date
							).getTime()) /
							(1000 * 60 * 60 * 24 * 365)
					)
				)) *
				(await bonus_department_service.getMultiplier(
					period_id,
					bonus_type,
					employee_data.department
				));
			if (special_multiplier != emp.special_multiplier) {
				await this.updateEmployeeBonus({
					id: emp.id,
					special_multiplier: special_multiplier,
				});
			}
		});

		await Promise.all(promises);
	}

	async deleteEmployeeBonus(id: number) {
		const result = await EmployeeBonus.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		return result;
	}

	async updateEmployeeBonus({
		id,
		period_id,
		bonus_type,
		emp_no,
		special_multiplier,
		multiplier,
		fixed_amount,
		bud_effective_salary,
		bud_amount,
		sup_performance_level,
		sup_effective_salary,
		sup_amount,
		app_performance_level,
		app_effective_salary,
		app_amount,
	}: z.infer<typeof updateEmployeeBonusService>) {
		const employeeBonus = await this.getEmployeeBonusById(id);
		if (employeeBonus == null) {
			throw new BaseResponseError("Employee account does not exist");
		}

		await this.deleteEmployeeBonus(id);

		await this.createEmployeeBonus({
			emp_no: select_value(emp_no, employeeBonus.emp_no),
			period_id: select_value(period_id, employeeBonus.period_id),
			bonus_type: select_value(bonus_type, employeeBonus.bonus_type),
			special_multiplier: select_value(
				special_multiplier,
				employeeBonus.special_multiplier
			),
			multiplier: select_value(multiplier, employeeBonus.multiplier),
			fixed_amount: select_value(
				fixed_amount,
				employeeBonus.fixed_amount
			),
			bud_effective_salary: select_value(
				bud_effective_salary,
				employeeBonus.bud_effective_salary
			),
			bud_amount: select_value(bud_amount, employeeBonus.bud_amount),
			sup_performance_level: select_value(
				sup_performance_level,
				employeeBonus.sup_performance_level
			),
			sup_effective_salary: select_value(
				sup_effective_salary,
				employeeBonus.sup_effective_salary
			),
			sup_amount: select_value(sup_amount, employeeBonus.sup_amount),
			app_performance_level: select_value(
				app_performance_level,
				employeeBonus.app_performance_level
			),
			app_effective_salary: select_value(
				app_effective_salary,
				employeeBonus.app_effective_salary
			),
			app_amount: select_value(app_amount, employeeBonus.app_amount),
			start_date: null,
			end_date: null,
		});
	}

	async updateMultipleBonusByEmpNoList(
		emp_no_list: string[],
		period_id: number,
		bonus_type: BonusTypeEnumType,
		multiplier: number,
		fixed_amount: number
	): Promise<void> {
		await Promise.all(
			emp_no_list.map(async (emp_no) => {
				const emp_bonus = await this.getEmployeeBonusByEmpNoByType(
					period_id,
					bonus_type,
					emp_no
				);
				if (!emp_bonus) {
					throw new BaseResponseError(
						"Employee bonus does not exist"
					);
				}
				await this.updateEmployeeBonus({
					id: emp_bonus.id,
					multiplier: multiplier,
					fixed_amount: fixed_amount,
				});
			})
		);
	}

	async updateFromExcel(
		force: boolean,
		{
			period_id,
			bonus_type,
			emp_no,
			sup_performance_level,
			sup_effective_salary,
			sup_amount,
			app_performance_level,
			app_effective_salary,
			app_amount,
		}: z.infer<typeof updateEmployeeBonusService>
	) {
		let error = false;
		const employeeBonus = await this.getEmployeeBonusByEmpNoByType(
			period_id!,
			bonus_type!,
			emp_no!
		);
		if (!employeeBonus) {
			throw new BaseResponseError("Employee bonus does not exist");
		}
		const employee_bonus_mapper = container.resolve(EmployeeBonusMapper);
		const employee_bonus_fe =
			await employee_bonus_mapper.getEmployeeBonusFE({
				...employeeBonus,
				sup_performance_level: sup_performance_level!,
				sup_effective_salary: sup_effective_salary!,
				sup_amount: sup_amount!,
				app_performance_level: app_performance_level!,
				app_effective_salary: app_effective_salary!,
				app_amount: app_amount!,
			});
		if (
			employee_bonus_fe.sup_performance_level ??
			employee_bonus_fe.sup_effective_salary ??
			employee_bonus_fe.sup_amount ??
			employee_bonus_fe.app_performance_level ??
			employee_bonus_fe.app_effective_salary ??
			employee_bonus_fe.app_amount
		) {
			error = true;
		}
		if (force || !error) {
			await this.updateEmployeeBonus({
				id: employeeBonus.id,
				sup_performance_level: select_value(
					sup_performance_level,
					employeeBonus.sup_performance_level
				),
				sup_effective_salary:
					select_value(
						sup_effective_salary,
						employeeBonus.sup_effective_salary
					) ?? undefined,
				sup_amount:
					select_value(sup_amount, employeeBonus.sup_amount) ??
					undefined,
				app_performance_level: select_value(
					app_performance_level,
					employeeBonus.app_performance_level
				),
				app_effective_salary:
					select_value(
						app_effective_salary,
						employeeBonus.app_effective_salary
					) ?? undefined,
				app_amount:
					select_value(app_amount, employeeBonus.app_amount) ??
					undefined,
			});
		}
		return error ? emp_no : null;
	}

	async autoCalculateEmployeeBonus(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		total_budgets: number
	) {
		const budget_amount_list: {
			emp_no: string;
			bud_effective_salary: number;
			budget_amount: number;
		}[] = [];
		const emp_no_list = (
			await this.getAllEmployeeBonus(period_id, bonus_type)
		).map((e) => e.emp_no);
		const promises = emp_no_list.map(async (emp_no) => {
			const employee_payment_service = container.resolve(
				EmployeePaymentService
			);

			const employee_payment =
				await employee_payment_service.getCurrentEmployeePaymentByEmpNo(
					emp_no,
					period_id
				);
			if (!employee_payment) {
				return;
			}

			const employee_bonus = await this.getEmployeeBonusByEmpNoByType(
				period_id,
				bonus_type,
				emp_no
			);
			if (!employee_bonus) {
				return;
			}

			const employee_payment_fe = employee_payment;

			const employee_bonus_fe =
				await this.employeeBonusMapper.getEmployeeBonusFE(
					employee_bonus
				);

			const budget_amount =
				(employee_payment_fe.base_salary +
					employee_payment_fe.food_allowance +
					employee_payment_fe.supervisor_allowance +
					employee_payment_fe.occupational_allowance +
					employee_payment_fe.subsidy_allowance +
					(employee_payment_fe.long_service_allowance_type ==
					LongServiceEnum.enum.month_allowance
						? employee_payment_fe.long_service_allowance
						: 0)) *
					employee_bonus_fe.special_multiplier *
					employee_bonus_fe.multiplier +
				employee_bonus_fe.fixed_amount;

			budget_amount_list.push({
				emp_no: emp_no,
				bud_effective_salary: Round(
					budget_amount /
						(employee_payment_fe.base_salary +
							employee_payment_fe.food_allowance +
							employee_payment_fe.supervisor_allowance +
							employee_payment_fe.occupational_allowance +
							employee_payment_fe.subsidy_allowance),
					3
				),
				budget_amount: budget_amount,
			});
		});

		await Promise.all(promises);

		const total_budget_amount = budget_amount_list
			.map((e) => e.budget_amount)
			.reduce((a, b) => a + b, 0);
		const ratio = total_budgets / total_budget_amount;
		budget_amount_list.forEach((e) => {
			e.budget_amount = Round(e.budget_amount * ratio, 1);
			e.bud_effective_salary = Round(
				e.bud_effective_salary * ratio,
				2
			);
		});

		const promises2 = budget_amount_list.map(async (e) => {
			const employee_bonus = await this.getEmployeeBonusByEmpNoByType(
				period_id,
				bonus_type,
				e.emp_no
			);
			if (!employee_bonus) {
				return;
			}

			await this.updateEmployeeBonus({
				id: employee_bonus.id,
				bud_effective_salary: e.bud_effective_salary,
				bud_amount: e.budget_amount,
			});
		});

		await Promise.all(promises2);
	}
}
