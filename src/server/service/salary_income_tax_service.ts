import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import { createSalaryIncomeTaxService, updateSalaryIncomeTaxService } from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
import { workerData } from "worker_threads";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";
import { SalaryIncomeTax } from "../database/entity/SALARY/salary_income_tax";
import { Op } from "sequelize";

@injectable()
export class SalaryIncomeTaxService {
	constructor() {}

	async createSalaryIncomeTax({
        salary_start,
        salary_end,
        dependent,
        tax_amount
    }: z.infer<typeof createSalaryIncomeTaxService>): Promise<SalaryIncomeTax> {
        const newData = await SalaryIncomeTax.create({
            salary_start: salary_start,
            salary_end: salary_end,
            dependent: dependent,
            tax_amount: tax_amount
        });
        return newData;
    }

    async initSalaryIncomeTax(data_array: z.infer<typeof createSalaryIncomeTaxService>[]) {
        await SalaryIncomeTax.bulkCreate(data_array);
    }

    async getAllSalaryIncomeTax(): Promise<SalaryIncomeTax[]> {
        const salaryIncomeTax = await SalaryIncomeTax.findAll();
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
        const salaryIncomeTax = await SalaryIncomeTax.findOne({
            where: {
                salary_start: {
                    [Op.lte]: salary
                },
                salary_end: {
                    [Op.gte]: salary
                },
                dependent: dependent
            },
        });
        return salaryIncomeTax;
    }

    async updateSalaryIncomeTax({
        id,
        salary_start,
        salary_end,
        dependent,
        tax_amount
    }: z.infer<typeof updateSalaryIncomeTaxService>) {
        const salaryIncomeTax = await this.getSalaryIncomeTaxById(id!);
		if (salaryIncomeTax == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await SalaryIncomeTax.update(
			{
				salary_start: select_value(salary_start, salaryIncomeTax.salary_start),
                salary_end: select_value(salary_end, salaryIncomeTax.salary_end),
                dependent: select_value(dependent, salaryIncomeTax.dependent),
                tax_amount: select_value(tax_amount, salaryIncomeTax.tax_amount),
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
    }

    async deleteSalaryIncomeTax(id: number) {
        const result = await SalaryIncomeTax.destroy({
			where: {
				id: id,
			},
		});
		return result;
    }
	
}
