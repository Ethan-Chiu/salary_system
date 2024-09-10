import { injectable } from "tsyringe";
import { type z } from "zod";
import {
	createEmployeeBonusService,
    updateEmployeeBonusService,
} from "../api/types/parameters_input_type";
import { EmployeeBonus } from "../database/entity/SALARY/employee_bonus";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class EmployeeBonusService {
	async createEmployeeBonus({
		period_id,
		bonus_type,
		emp_no,
		budget_amount,
		superviser_amount,
		final_amount,
	}: z.infer<typeof createEmployeeBonusService>) {
        const newData = await EmployeeBonus.create({
            period_id: period_id,
            bonus_type: bonus_type,
            emp_no: emp_no,
            budget_amount: budget_amount,
            superviser_amount: superviser_amount,
            final_amount: final_amount,
			// received_elderly_benefits: received_elderly_benefits,
			create_by: "system",
			update_by: "system",
		});
		return newData;
    }
    async createEmployeeBonusByEmpNoList(period_id: number, bonus_type: BonusTypeEnumType, emp_no_list: string[]) {
        emp_no_list.forEach(async (emp_no) => {
            await this.createEmployeeBonus({
                period_id: period_id,
                bonus_type: bonus_type,
                emp_no: emp_no,
                multiplier: null,
                fixed_amount: null,
                budget_amount: null,
                superviser_amount: null,
                final_amount: null,
            });
        })
    }
    async getEmployeeBonusByEmpNo(emp_no: string) {
        const result = await EmployeeBonus.findOne({
            where: {
                emp_no: emp_no
            }
        });
        return result;
    }

    async getEmployeeBonusByPeriodId(period_id: number) {
        const result = await EmployeeBonus.findAll({
            where: {
                period_id: period_id
            }
        });
        return result;
    }

    async getEmployeeBonusById(id: number) {
        const result = await EmployeeBonus.findByPk(id);
        return result;
    }

    async getAllEmployeeBonus() {
        const result = await EmployeeBonus.findAll();
        return result;
    }   

    async deleteEmployeeBonus(id: number) {
        const result = await EmployeeBonus.destroy({
            where: {
                id: id
            }
        });
        return result;
    }

    async updateEmployeeBonus({
        id,
        period_id,
        bonus_type,
        emp_no,
        budget_amount,
        superviser_amount,
        final_amount,
    }: z.infer<typeof updateEmployeeBonusService>) {
        const employeeBonus = await this.getEmployeeBonusById(id!);
		if (employeeBonus == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeBonus.update(
			{
				emp_no: select_value(emp_no, employeeBonus.emp_no),
				period_id: select_value(period_id, employeeBonus.period_id),
                bonus_type: select_value(bonus_type, employeeBonus.bonus_type),
                budget_amount: select_value(budget_amount, employeeBonus.budget_amount),
                superviser_amount: select_value(superviser_amount, employeeBonus.superviser_amount),
                final_amount: select_value(final_amount, employeeBonus.final_amount),
				// received_elderly_benefits: select_value(
				// 	received_elderly_benefits,
				// 	employeeData.received_elderly_benefits
				// ),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
    }
}
