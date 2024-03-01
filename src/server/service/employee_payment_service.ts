import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import {
	type createEmployeePaymentService,
	type updateEmployeePaymentService,
} from "../api/types/parameters_input_type";
import { EmployeePayment } from "../database/entity/SALARY/employee_payment";
import { Op } from "sequelize";

@injectable()
export class EmployeePaymentService {
	/* constructor() {} */

	async createEmployeePayment({
		emp_no,
		base_salary,
		supervisor_bonus,
		job_bonus,
		subsidy_bonus,
		shift_bonus,
		professional_cert_bonus,
		labor_retirement_self,
		emp_trust_reserve,
		org_trust_reserve,
		emp_special_trust_incent,
		org_special_trust_incent,
		l_i,
		h_i,
		labor_retirement,
		occupational_injury,
		start_date,
		end_date,
		dir_sup_comp,
		food_bonus,
		moon_fes_bonus,
		dragonboat_fes_bonus,
		performance_bonus,
	}: z.infer<typeof createEmployeePaymentService>): Promise<EmployeePayment> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await EmployeePayment.create({
			emp_no: emp_no,
			base_salary: base_salary,
			supervisor_bonus: supervisor_bonus,
			job_bonus: job_bonus,
			subsidy_bonus: subsidy_bonus,
			shift_bonus: shift_bonus,
			professional_cert_bonus: professional_cert_bonus,
			labor_retirement_self: labor_retirement_self,
			emp_trust_reserve: emp_trust_reserve,
			org_trust_reserve: org_trust_reserve,
			emp_special_trust_incent: emp_special_trust_incent,
			org_special_trust_incent: org_special_trust_incent,
			l_i: l_i,
			h_i: h_i,
			labor_retirement: labor_retirement,
			occupational_injury: occupational_injury,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			dir_sup_comp: dir_sup_comp,
			food_bonus: food_bonus,
			moon_fes_bonus: moon_fes_bonus,
			dragonboat_fes_bonus: dragonboat_fes_bonus,
			performance_bonus: performance_bonus,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getEmployeePaymentById(id: number): Promise<EmployeePayment | null> {
		const employeePayment = await EmployeePayment.findOne({
			where: {
				id: id,
			},
		});
		return employeePayment;
	}

	async getCurrentEmployeePayment(): Promise<EmployeePayment[]> {
		const current_date_string = get_date_string(new Date());
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
			},
		});
		return employeePayment;
	}

	async getCurrentEmployeePaymentById(
		id: number
	): Promise<EmployeePayment | null> {
		const current_date_string = get_date_string(new Date());
		const employeePayment = await EmployeePayment.findOne({
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
		return employeePayment;
	}

	async getAllEmployeePayment(): Promise<EmployeePayment[]> {
		const employeePayment = await EmployeePayment.findAll();
		return employeePayment;
	}

	async updateEmployeePayment({
		id,
		emp_no,
		base_salary,
		supervisor_bonus,
		job_bonus,
		subsidy_bonus,
		shift_bonus,
		professional_cert_bonus,
		labor_retirement_self,
		emp_trust_reserve,
		org_trust_reserve,
		emp_special_trust_incent,
		org_special_trust_incent,
		l_i,
		h_i,
		labor_retirement,
		occupational_injury,
		start_date,
		end_date,
		dir_sup_comp: dir_sup_comp,
		food_bonus: food_bonus,
		moon_fes_bonus: moon_fes_bonus,
		dragonboat_fes_bonus: dragonboat_fes_bonus,
		performance_bonus: performance_bonus,
	}: z.infer<typeof updateEmployeePaymentService>): Promise<void> {
		const employeePayment = await this.getEmployeePaymentById(id!);
		if (employeePayment == null) {
			throw new BaseResponseError("Employee Payment does not exist");
		}
		const affectedCount = await EmployeePayment.update(
			{
				emp_no: select_value(emp_no, employeePayment.emp_no),
				base_salary: select_value(
					base_salary,
					employeePayment.base_salary
				),
				supervisor_bonus: select_value(
					supervisor_bonus,
					employeePayment.supervisor_bonus
				),
				job_bonus: select_value(job_bonus, employeePayment.job_bonus),
				subsidy_bonus: select_value(
					subsidy_bonus,
					employeePayment.subsidy_bonus
				),
				shift_bonus: select_value(
					shift_bonus,
					employeePayment.shift_bonus
				),
				professional_cert_bonus: select_value(
					professional_cert_bonus,
					employeePayment.professional_cert_bonus
				),
				labor_retirement_self: select_value(
					labor_retirement_self,
					employeePayment.labor_retirement_self
				),
				emp_trust_reserve: select_value(
					emp_trust_reserve,
					employeePayment.emp_trust_reserve
				),
				org_trust_reserve: select_value(
					org_trust_reserve,
					employeePayment.org_trust_reserve
				),
				emp_special_trust_incent: select_value(
					emp_special_trust_incent,
					employeePayment.emp_special_trust_incent
				),
				org_special_trust_incent: select_value(
					org_special_trust_incent,
					employeePayment.org_special_trust_incent
				),
				l_i: select_value(l_i, employeePayment.l_i),
				h_i: select_value(h_i, employeePayment.h_i),
				labor_retirement: select_value(
					labor_retirement,
					employeePayment.labor_retirement
				),
				occupational_injury: select_value(
					occupational_injury,
					employeePayment.occupational_injury
				),
				start_date: select_value(
					start_date,
					employeePayment.start_date
				),
				end_date: select_value(end_date, employeePayment.end_date),
				dir_sup_comp: select_value(
					dir_sup_comp,
					employeePayment.dir_sup_comp
				),
				food_bonus: select_value(
					food_bonus,
					employeePayment.food_bonus
				),
				moon_fes_bonus: select_value(
					moon_fes_bonus,
					employeePayment.moon_fes_bonus
				),
				dragonboat_fes_bonus: select_value(
					dragonboat_fes_bonus,
					employeePayment.dragonboat_fes_bonus
				),
				performance_bonus: select_value(
					performance_bonus,
					employeePayment.performance_bonus
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteEmployeePayment(id: number): Promise<void> {
		const destroyedRows = await EmployeePayment.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
