// import { container, injectable } from "tsyringe";
// import { type z } from "zod";
// import {
//     createEmployeeDataMutService,
// 	updateEmployeeDataMutByEmpNoService,
// 	updateEmployeeDataMutService,
// } from "../api/types/employee_data_type";
// import { BaseResponseError } from "../api/error/BaseResponseError";
// import { select_value } from "./helper_function";
// import { EmployeeDataMut } from "../database/entity/SALARY/employee_data_mut";
// import { EHRService } from "./ehr_service";
// import { Op } from "sequelize";

// @injectable()
// export class EmployeeDataMutService {
// 	/* constructor() {} */

// 	async createEmployeeDataMut({
// 		emp_no,
//         trust_date,
//         start_date,
//         end_date
// 	}: // received_elderly_benefits,
// 	z.infer<typeof createEmployeeDataMutService>): Promise<EmployeeDataMut> {
// 		const newData = await EmployeeDataMut.create({
// 			emp_no: emp_no,
// 			trust_date: trust_date,
//             start_date: start_date,
//             end_date: end_date,
// 			create_by: "system",
// 			update_by: "system",
// 		});
// 		return newData;
// 	}

// 	async getEmployeeDataMutById(id: number): Promise<EmployeeDataMut | null> {
// 		const employeeDataMut = await EmployeeDataMut.findOne({
// 			where: {
// 				id: id,
// 			},
// 		});
// 		return employeeDataMut;
// 	}
// 	async getEmployeeDataMutByEmpNo(emp_no: string): Promise<EmployeeDataMut | null> {
// 		const employeeDataMut = await EmployeeDataMut.findOne({
// 			where: {
// 				emp_no: emp_no,
// 			},
// 		});
// 		return employeeDataMut;
// 	}

// 	async getCurrentEmployeeData(period_id: number): Promise<EmployeeDataMut[]> {
//         const ehr_service = container.resolve(EHRService);
// 		const period = await ehr_service.getPeriodById(period_id);
// 		const current_date_string = period.end_date;
// 		const employeeDataMutList = await EmployeeDataMut.findAll({
// 			where: {
// 				start_date: {
// 					[Op.lte]: current_date_string,
// 				},
// 				end_date: {
// 					[Op.or]: [
// 						{ [Op.gte]: current_date_string },
// 						{ [Op.eq]: null },
// 					],
// 				},
// 			},
// 		});
//         return employeeDataMutList;
// 	}

// 	async getAllEmployeeDataMut(): Promise<EmployeeDataMut[]> {
// 		const employeeData = await EmployeeDataMut.findAll({
// 			raw: true,
// 			order: [["emp_no", "ASC"]],
// 		});
// 		return employeeData;
// 	}

// 	async updateEmployeeDataMut({
// 		id,
// 		emp_no: emp_no,
// 		trust_date: trust_date,
//         start_date: start_date,
//         end_date: end_date
// 	}: // received_elderly_benefits: received_elderly_benefits,
// 	z.infer<typeof updateEmployeeDataMutService>): Promise<void> {
// 		const employeeDataMut = await this.getEmployeeDataMutById(id!);
// 		if (employeeDataMut == null) {
// 			throw new BaseResponseError("Employee account does not exist");
// 		}
// 		const affectedCount = await EmployeeDataMut.update(
// 			{
// 				emp_no: select_value(emp_no, employeeDataMut.emp_no),
//                 trust_date: select_value(trust_date, employeeDataMut.trust_date),
//                 start_date: select_value(start_date, employeeDataMut.start_date),
//                 end_date: select_value(end_date, employeeDataMut.end_date),
// 				// received_elderly_benefits: select_value(
// 				// 	received_elderly_benefits,
// 				// 	employeeData.received_elderly_benefits
// 				// ),
// 				update_by: "system",
// 			},
// 			{ where: { id: id } }
// 		);
// 		if (affectedCount[0] == 0) {
// 			throw new BaseResponseError("Update error");
// 		}
// 	}

// 	async updateEmployeeDataMutByEmpNo({
// 		emp_no: emp_no,
//         trust_date: trust_date,
//         start_date: start_date,
//         end_date: end_date
		
// 	}: // received_elderly_benefits: received_elderly_benefits,
// 	z.infer<typeof updateEmployeeDataMutByEmpNoService>): Promise<void> {
// 		const employeeDataMut = await this.getEmployeeDataMutByEmpNo(emp_no!);
// 		if (employeeDataMut == null) {
// 			throw new BaseResponseError("Employee account does not exist");
// 		}
// 		const affectedCount = await EmployeeDataMut.update(
// 			{
// 				emp_no: select_value(emp_no, employeeDataMut.emp_no),
//                 trust_date: select_value(trust_date, employeeDataMut.trust_date),
//                 start_date: select_value(start_date, employeeDataMut.start_date),
//                 end_date: select_value(end_date, employeeDataMut.end_date),
// 				update_by: "system",
// 			},
// 			{ where: { emp_no: emp_no } }
// 		);
// 		if (affectedCount[0] == 0) {
// 			throw new BaseResponseError("Update error");
// 		}
// 	}

// 	async deleteEmployeeDataMut(id: number): Promise<void> {
// 		const destroyedRows = await EmployeeDataMut.destroy({
// 			where: { id: id },
// 		});
// 		if (destroyedRows != 1) {
// 			throw new BaseResponseError("Delete error");
// 		}
// 	}
// }
