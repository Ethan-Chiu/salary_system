import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { type z } from "zod";
import { get_date_string, select_value } from "./helper_function";
import {
	SalaryIncomeTax,
	type SalaryIncomeTaxDecType,
	decSalaryIncomeTax,
	encSalaryIncomeTax,
} from "../database/entity/SALARY/salary_income_tax";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { BaseMapper } from "../database/mapper/base_mapper";
import { createSalaryIncomeTaxService, updateSalaryIncomeTaxService } from "../api/types/salary_income_tax";

@injectable()
export class SalaryIncomeTaxService {
	private readonly salaryIncomeTaxMapper: BaseMapper<
		SalaryIncomeTax,
		SalaryIncomeTaxDecType
	>;

	constructor() {
		this.salaryIncomeTaxMapper = new BaseMapper<
			SalaryIncomeTax,
			SalaryIncomeTaxDecType
		>(encSalaryIncomeTax, decSalaryIncomeTax);
	}

	async createSalaryIncomeTax(
		data: z.infer<typeof createSalaryIncomeTaxService>
	): Promise<SalaryIncomeTax> {
		const d = createSalaryIncomeTaxService.parse(data);

		const attendanceSetting = await this.salaryIncomeTaxMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await SalaryIncomeTax.create(attendanceSetting, {
			raw: true,
		});

		return newData;
	}

	async batchCreateSalaryIncomeTax(
		data_array: z.infer<typeof createSalaryIncomeTaxService>[]
	) {
		const current_date_string = get_date_string(new Date());
		await SalaryIncomeTax.bulkCreate(
			await Promise.all(
				data_array.map(async (data) => {
					return await this.salaryIncomeTaxMapper.encode({
						...data,
						start_date: data.start_date ?? current_date_string,
						disabled: false,
						create_by: "system",
						update_by: "system",
					});
				})
			)
		);
	}

	async getCurrentSalaryIncomeTax(
		period_id: number
	): Promise<SalaryIncomeTaxDecType[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const salaryIncomeTax = await SalaryIncomeTax.findAll({
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
			order: [
				["dependent", "ASC"],
				["salary_start", "ASC"],
			],
		});
		return await this.salaryIncomeTaxMapper.decodeList(salaryIncomeTax);
	}

	async getAllSalaryIncomeTax(): Promise<SalaryIncomeTaxDecType[]> {
		const salaryIncomeTax = await SalaryIncomeTax.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["dependent", "ASC"],
				["salary_start", "ASC"],
			],
		});
		return await this.salaryIncomeTaxMapper.decodeList(salaryIncomeTax);
	}

	async getAllFutureSalaryIncomeTax(): Promise<SalaryIncomeTaxDecType[]> {
		const current_date_string = get_date_string(new Date());
		const salaryIncomeTax = await SalaryIncomeTax.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["dependent", "ASC"],
				["salary_start", "ASC"],
			],
		});
		return this.salaryIncomeTaxMapper.decodeList(salaryIncomeTax);
	}

	async getSalaryIncomeTaxById(
		id: number
	): Promise<SalaryIncomeTaxDecType | null> {
		const salaryIncomeTax = await SalaryIncomeTax.findOne({
			where: {
				id: id,
			},
		});

		if (!salaryIncomeTax) return null;

		return this.salaryIncomeTaxMapper.decode(salaryIncomeTax);
	}

	async getTargetSalaryIncomeTax(
		salary: number,
		dependent: number
	): Promise<SalaryIncomeTaxDecType | null> {
		const salaryIncomeTax = await SalaryIncomeTax.findOne({
			where: {
				salary_start: {
					[Op.lte]: salary,
				},
				salary_end: {
					[Op.gte]: salary,
				},
				dependent: dependent,
				disabled: false,
			},
		});

		return this.salaryIncomeTaxMapper.decode(salaryIncomeTax);
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

		await this.createSalaryIncomeTax({
			salary_start: select_value(
				salary_start,
				salaryIncomeTax.salary_start
			),
			salary_end: select_value(salary_end, salaryIncomeTax.salary_end),
			dependent: select_value(dependent, salaryIncomeTax.dependent),
			tax_amount: select_value(tax_amount, salaryIncomeTax.tax_amount),
			start_date: select_value(start_date, salaryIncomeTax.start_date),
			end_date: select_value(end_date, salaryIncomeTax.end_date),
		});
	}

	async deleteSalaryIncomeTax(id: number) {
		const result = await SalaryIncomeTax.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		return result;
	}
}
