import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import {
    type createEmployeeTrustService,
    type updateEmployeeTrustService,
} from "../api/types/parameters_input_type";
import { Op } from "sequelize";
import { EmployeeTrust } from "../database/entity/SALARY/employee_trust";
import { EHRService } from "./ehr_service";
import { EmployeeDataService } from "./employee_data_service";
import { TrustMoneyService } from "./trust_money_service";

@injectable()
export class EmployeeTrustService {
    /* constructor() {} */

    async createEmployeeTrust({
        emp_no,
        emp_trust_reserve,
        org_trust_reserve,
        emp_special_trust_incent,
        org_special_trust_incent,
        start_date,
        end_date,
    }: z.infer<typeof createEmployeeTrustService>): Promise<EmployeeTrust> {
        const current_date_string = get_date_string(new Date());
        check_date(start_date, end_date, current_date_string);
        const newData = await EmployeeTrust.create({
            emp_no: emp_no,
            emp_trust_reserve: emp_trust_reserve,
            org_trust_reserve: org_trust_reserve,
            emp_special_trust_incent: emp_special_trust_incent,
            org_special_trust_incent: org_special_trust_incent,
            start_date: start_date ?? current_date_string,
            end_date: end_date,
            create_by: "system",
            update_by: "system",
        });
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
            },
        });
        return employeeTrust;
    }

    async getCurrentEmployeeTrustByEmpNo(emp_no: string, period_id: number): Promise<EmployeeTrust | null> {
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
        const employeeTrust = await EmployeeTrust.findAll();
        return employeeTrust;
    }

    async updateEmployeeTrust({
        id,
        emp_no,
        emp_trust_reserve,
        org_trust_reserve,
        emp_special_trust_incent,
        org_special_trust_incent,
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
                emp_trust_reserve: select_value(
                    emp_trust_reserve,
                    employeeTrust.emp_trust_reserve
                ),
                org_trust_reserve: select_value(
                    org_trust_reserve,
                    employeeTrust.org_trust_reserve
                ),
                emp_special_trust_incent: select_value(
                    emp_special_trust_incent,
                    employeeTrust.emp_special_trust_incent
                ),
                org_special_trust_incent: select_value(org_special_trust_incent, employeeTrust.org_special_trust_incent),
                start_date: select_value(
                    start_date,
                    employeeTrust.start_date
                ),
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

    async autoCalculateEmployeeTrust(period_id: number, emp_no_list: string[]): Promise<void> {
        const employee_data_service = container.resolve(EmployeeDataService);
        const trust_money_service = container.resolve(TrustMoneyService);

        emp_no_list.forEach(async (emp_no: string) => {
            const employeeTrust = await this.getCurrentEmployeeTrustByEmpNo(emp_no, period_id);
            if (employeeTrust == null) {
                throw new BaseResponseError("Employee Trust does not exist");
            }
            const employee_data = await employee_data_service.getEmployeeDataByEmpNo(emp_no);
            if (employee_data == null) {
                throw new BaseResponseError("Employee data does not exist");
            }
            const trust_money = await trust_money_service.getTrustMoneyByPosition(employee_data.position, employee_data.position_type);
            if (trust_money == null) {
                throw new BaseResponseError("Trust money does not exist");
            }

            const affectedCount = await EmployeeTrust.update(
                {
                    emp_trust_reserve: trust_money.emp_trust_reserve_limit ?? trust_money.org_trust_reserve_limit,
                    org_trust_reserve: trust_money.org_trust_reserve_limit,
                    emp_special_trust_incent: trust_money.emp_special_trust_incent_limit ?? trust_money.org_special_trust_incent_limit,
                    org_special_trust_incent: trust_money.org_special_trust_incent_limit,
                    update_by: "system",
                },
                { where: { emp_no: emp_no } }
            );
            if (affectedCount[0] == 0) {
                throw new BaseResponseError("Update error");
            }
        })
    }
}
