import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createSalaryIncomeTaxService,
	updateSalaryIncomeTaxService,
} from "../api/types/parameters_input_type";
import { check_date, get_date_string, select_value } from "./helper_function";
import { SalaryIncomeTax } from "../database/entity/SALARY/salary_income_tax";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";

@injectable()
export class SalaryIncomeTaxService {
	constructor() { }

	async createSalaryIncomeTax({
		salary_start,
		salary_end,
		dependent,
		tax_amount,
		start_date,
		end_date,
	}: z.infer<typeof createSalaryIncomeTaxService>): Promise<SalaryIncomeTax> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);

		const newData = await SalaryIncomeTax.create(
			{
				salary_start: salary_start,
				salary_end: salary_end,
				dependent: dependent,
				tax_amount: tax_amount,
				start_date: start_date ?? current_date_string,
				end_date: end_date,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}

	async batchCreateSalaryIncomeTax(
		data_array: z.infer<typeof createSalaryIncomeTaxService>[]
	) {
		const current_date_string = get_date_string(new Date());
		await SalaryIncomeTax.bulkCreate(
			data_array.map(data => {
				check_date(data.start_date, data.end_date, current_date_string);
				return {
					...data,
					start_date: data.start_date ?? current_date_string,
					disabled: false,
					create_by: "system",
					update_by: "system",
				}
			})
		);
	}

	async getCurrentSalaryIncomeTax(period_id: number): Promise<SalaryIncomeTax[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const salaryIncomeTax = await SalaryIncomeTax.findAll(
			{
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
					disabled: false
				},
				order: [["dependent", "ASC"], ["salary_start", "ASC"]],
			}
		);
		return salaryIncomeTax;
	}

	async getAllSalaryIncomeTax(): Promise<SalaryIncomeTax[]> {
		const salaryIncomeTax = await SalaryIncomeTax.findAll(
			{
				where: { disabled: false },
				order: [["dependent", "ASC"], ["salary_start", "ASC"]],
			}
		);
		return salaryIncomeTax;
	}

	async getSalaryIncomeTaxById(id: number): Promise<SalaryIncomeTax | null> {
		const salaryIncomeTax = await SalaryIncomeTax.findOne({
			where: {
				id: id,
			},
		});
		return salaryIncomeTax;
	}

	async getTargetSalaryIncomeTax(salary: number, dependent: number): Promise<SalaryIncomeTax | null> {
		const salaryIncomeTax = await SalaryIncomeTax.findOne(
			{
				where: {
					salary_start: {
						[Op.lte]: salary
					},
					salary_end: {
						[Op.gte]: salary
					},
					dependent: dependent,
					disabled: false
				},
			}
		);
		return salaryIncomeTax;
	}

	async updateSalaryIncomeTax({
		id,
		salary_start,
		salary_end,
		dependent,
		tax_amount,
		start_date,
		end_date,
	}: z.infer<typeof updateSalaryIncomeTaxService>) {
		const salaryIncomeTax = await this.getSalaryIncomeTaxById(id);
		if (salaryIncomeTax == null) {
			throw new BaseResponseError("Employee account does not exist");
		}

		await this.deleteSalaryIncomeTax(id);

		await this.createSalaryIncomeTax(
			{
				salary_start: select_value(
					salary_start,
					salaryIncomeTax.salary_start
				),
				salary_end: select_value(
					salary_end,
					salaryIncomeTax.salary_end
				),
				dependent: select_value(dependent, salaryIncomeTax.dependent),
				tax_amount: select_value(
					tax_amount,
					salaryIncomeTax.tax_amount
				),
				start_date: select_value(start_date, salaryIncomeTax.start_date),
				end_date: select_value(end_date, salaryIncomeTax.end_date),
			}
		);
	}

	async deleteSalaryIncomeTax(id: number) {
		const result = await SalaryIncomeTax.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		return result;
	}
}
