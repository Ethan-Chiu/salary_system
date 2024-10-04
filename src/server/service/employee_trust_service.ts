import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import { Op } from "sequelize";
import { EmployeeTrust } from "../database/entity/SALARY/employee_trust";
import { EHRService } from "./ehr_service";
import { EmployeeDataService } from "./employee_data_service";
import { TrustMoneyService } from "./trust_money_service";
import { createEmployeeTrustService, updateEmployeeTrustService } from "../api/types/employee_trust";
import { EmployeeTrustMapper } from "../database/mapper/employee_trust_mapper";

@injectable()
export class EmployeeTrustService {
	/* constructor() {} */

	async createEmployeeTrust({
		emp_no,
		emp_trust_reserve_enc,
		org_trust_reserve_enc,
		emp_special_trust_incent_enc,
		org_special_trust_incent_enc,
		entry_date,
		start_date,
		end_date,
	}: z.infer<typeof createEmployeeTrustService>): Promise<EmployeeTrust> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await EmployeeTrust.create({
			emp_no: emp_no,
			emp_trust_reserve_enc: emp_trust_reserve_enc,
			org_trust_reserve_enc: org_trust_reserve_enc,
			emp_special_trust_incent_enc: emp_special_trust_incent_enc,
			org_special_trust_incent_enc: org_special_trust_incent_enc,
			entry_date: entry_date,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		}, { raw: true });
		return newData;
	}

	async getEmployeeTrustById(id: number): Promise<EmployeeTrust | null> {
		const employeeTrust = await EmployeeTrust.findOne({
			where: {
				id: id,
			},
		});
		return employeeTrust;
	}

	async getCurrentEmployeeTrust(period_id: number): Promise<EmployeeTrust[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeeTrust = await EmployeeTrust.findAll({
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
			},
			order: [
				['emp_no', 'ASC']
			],
			raw: true
		});
		return employeeTrust;
	}

	async getCurrentEmployeeTrustById(
		id: number
	): Promise<EmployeeTrust | null> {
		const current_date_string = get_date_string(new Date());
		const employeeTrust = await EmployeeTrust.findOne({
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
			}
		});
		return employeeTrust;
	}

	async getCurrentEmployeeTrustByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<EmployeeTrust | null> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeeTrust = await EmployeeTrust.findOne({
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
			},
		});
		return employeeTrust;
	}

	async getAllEmployeeTrust(): Promise<EmployeeTrust[]> {
		const employeeTrust = await EmployeeTrust.findAll({
			order: [
				['emp_no', 'ASC']
			],
			raw: true
		});
		return employeeTrust;
	}

	async updateEmployeeTrust({
		id,
		emp_no,
		emp_trust_reserve_enc,
		org_trust_reserve_enc,
		emp_special_trust_incent_enc,
		org_special_trust_incent_enc,
		entry_date,
		start_date,
		end_date,
	}: z.infer<typeof updateEmployeeTrustService>): Promise<void> {
		const employeeTrust = await this.getEmployeeTrustById(id!);
		if (employeeTrust == null) {
			throw new BaseResponseError("Employee Trust does not exist");
		}
		const affectedCount = await EmployeeTrust.update(
			{
				emp_no: select_value(emp_no, employeeTrust.emp_no),
				emp_trust_reserve_enc: select_value(
					emp_trust_reserve_enc,
					employeeTrust.emp_trust_reserve_enc
				),
				org_trust_reserve_enc: select_value(
					org_trust_reserve_enc,
					employeeTrust.org_trust_reserve_enc
				),
				emp_special_trust_incent_enc: select_value(
					emp_special_trust_incent_enc,
					employeeTrust.emp_special_trust_incent_enc
				),
				org_special_trust_incent_enc: select_value(
					org_special_trust_incent_enc,
					employeeTrust.org_special_trust_incent_enc
				),
				entry_date: select_value(entry_date, employeeTrust.entry_date),
				start_date: select_value(start_date, employeeTrust.start_date),
				end_date: select_value(end_date, employeeTrust.end_date),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteEmployeeTrust(id: number): Promise<void> {
		const destroyedRows = await EmployeeTrust.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleEmployeeTrust(): Promise<void> {
		const employeeTrustList = await EmployeeTrust.findAll({
			order: [
				["emp_no", "ASC"],
				["start_date", "ASC"],
			],
		});

		for (let i = 0; i < employeeTrustList.length - 1; i += 1) {
			const end_date_string = get_date_string(
				new Date(employeeTrustList[i]!.dataValues.end_date!)
			);
			const start_date = new Date(
				employeeTrustList[i + 1]!.dataValues.start_date
			);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (
				employeeTrustList[i]!.dataValues.emp_no ==
				employeeTrustList[i + 1]!.dataValues.emp_no
			) {
				if (end_date_string != new_end_date_string) {
					await this.updateEmployeeTrust({
						id: employeeTrustList[i]!.dataValues.id,
						end_date: new_end_date_string,
					});
				}
			}
			else {
				await this.updateEmployeeTrust({
					id: employeeTrustList[i]!.dataValues.id,
					end_date: null,
				});
			}
		}

		await this.updateEmployeeTrust({
			id: employeeTrustList[employeeTrustList.length - 1]!.dataValues.id,
			end_date: null,
		});
	}
	async autoCalculateEmployeeTrust(
		period_id: number,
		emp_no_list: string[],
		start_date: string
	): Promise<void> {
		const employee_data_service = container.resolve(EmployeeDataService);
		const trust_money_service = container.resolve(TrustMoneyService);
		const employee_trust_mapper = container.resolve(EmployeeTrustMapper);

		const promises = emp_no_list.map(async (emp_no: string) => {
			const employeeTrust = await this.getCurrentEmployeeTrustByEmpNo(
				emp_no,
				period_id
			);

			if (employeeTrust == null) {
				throw new BaseResponseError("Employee Trust does not exist");
			}

			if (employeeTrust.end_date != null) {
				return;
			}

			const employee_data =
				await employee_data_service.getEmployeeDataByEmpNo(emp_no);
			if (employee_data == null) {
				throw new BaseResponseError("Employee data does not exist");
			}
			const trust_money =
				await trust_money_service.getCurrentTrustMoneyByPosition(
					period_id,
					employee_data.position,
					employee_data.position_type
				);
			if (trust_money == null) {
				return
			}

			const employeeTrustFE = await employee_trust_mapper.getEmployeeTrustFE(employeeTrust.dataValues);

			const originalEmployeeTrust = await employee_trust_mapper.getEmployeeTrust(employeeTrustFE);

			const updatedEmployeeTrust = await employee_trust_mapper.getEmployeeTrust({
				...employeeTrustFE,
				org_trust_reserve: trust_money.org_trust_reserve_limit,
				org_special_trust_incent:
					trust_money.org_special_trust_incent_limit,
			});

			if (originalEmployeeTrust.emp_trust_reserve_enc != updatedEmployeeTrust.emp_trust_reserve_enc ||
				originalEmployeeTrust.org_trust_reserve_enc != updatedEmployeeTrust.org_trust_reserve_enc ||
				originalEmployeeTrust.emp_special_trust_incent_enc != updatedEmployeeTrust.emp_special_trust_incent_enc ||
				originalEmployeeTrust.org_special_trust_incent_enc != updatedEmployeeTrust.org_special_trust_incent_enc) {
				await this.createEmployeeTrust({
					...updatedEmployeeTrust,
					start_date: start_date,
					end_date: null,
				});
			}
		});

		await Promise.all(promises);
	}
}
