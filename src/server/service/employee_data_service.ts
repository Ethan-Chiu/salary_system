import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { z } from "zod";
import {
	createEmployeeDataService,
	updateEmployeeDataService,
} from "../api/types/parameters_input_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";
import { IncomingMessage } from "http";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { Emp } from "../database/entity/UMEDIA/emp";


export interface CombinedData {
	key: string
   	db_value: any
   	ehr_value: any
	is_different: boolean
  }
export interface PaidEmployee {
	emp_no: string
	name: string
	english_name: string 
	department: string
	work_status: string
	quit_date: string | null
	bug?: string
}
export interface PeriodObject {
	PERIOD_NAME: string;
	START_DATE: string;
	END_DATE: string;
}

@injectable()
export class EmployeeDataService {
	constructor() {}

	async createEmployeeData({
		emp_no,
		emp_name,
		position,
		position_type,
		ginsurance_type,
		u_dep,
		work_type,
		work_status,
		accesible,
		sex_type,
		dependents,
		healthcare,
		registration_date,
		quit_date,
		licens_id,
		nbanknumber
	}: z.infer<typeof createEmployeeDataService>): Promise<EmployeeData> {
		const now = new Date();

		const newData = await EmployeeData.create({
			emp_no: emp_no,
			emp_name: emp_name,
			position: position,
			position_type: position_type,
			ginsurance_type: ginsurance_type,
			u_dep: u_dep,
			work_type: work_type,
			work_status: work_status,
			accesible: accesible,
			sex_type: sex_type,
			dependents: dependents,
			healthcare: healthcare,
			registration_date: registration_date,
			quit_date: quit_date,
			licens_id: licens_id,
			nbanknumber: nbanknumber,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getEmployeeDataById(id: number): Promise<EmployeeData | null> {
		const employeeData = await EmployeeData.findOne({
			where: {
				id: id,
			},
		});
		return employeeData;
	}

	async getCurrentEmployeeData(): Promise<EmployeeData[]> {
		const now = Date();
		const employeeData = await EmployeeData.findAll({});
		return employeeData;
	}

	async getAllEmployeeData(): Promise<EmployeeData[]> {
		const employeeData = await EmployeeData.findAll();
		return employeeData;
	}

	async updateEmployeeData({
		id,
		emp_no: emp_no,
		emp_name: emp_name,
		position: position,
		position_type: position_type,
		ginsurance_type: ginsurance_type,
		u_dep: u_dep,
		work_type: work_type,
		work_status: work_status,
		accesible: accesible,
		sex_type: sex_type,
		dependents: dependents,
		healthcare: healthcare,
		registration_date: registration_date,
		quit_date: quit_date,
		licens_id: licens_id,
		nbanknumber: nbanknumber,
	}: z.infer<typeof updateEmployeeDataService>): Promise<void> {
		const employeeData = await this.getEmployeeDataById(id!);
		if (employeeData == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeData.update(
			{
				emp_no: select_value(emp_no, employeeData.emp_no),
				emp_name: select_value(emp_name, employeeData.emp_name),
				work_type: select_value(work_type, employeeData.work_type),
				work_status: select_value(
					work_status,
					employeeData.work_status
				),
				accesible: select_value(accesible, employeeData.accesible),
				sex_type: select_value(sex_type, employeeData.sex_type),
				dependents: select_value(dependents, employeeData.dependents),
				healthcare: select_value(healthcare, employeeData.healthcare),
				registration_date: select_value(
					registration_date,
					employeeData.registration_date
				),
				quit_date: select_value(quit_date, employeeData.quit_date),
				licens_id: select_value(licens_id, employeeData.licens_id),
				nbanknumber: select_value(nbanknumber, employeeData.nbanknumber),
				position: select_value(position, employeeData.position),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				ginsurance_type: select_value(
					ginsurance_type,
					employeeData.ginsurance_type
				),
				u_dep: select_value(u_dep, employeeData.u_dep),

				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteEmployeeData(id: number): Promise<void> {
		const destroyedRows = await EmployeeData.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
	async checkQuitDate(period:number, quit_date: string): Promise<string>  {
		const ehrService = container.resolve(EHRService);
		const periodInfo = await ehrService.getPeriodObject(period) as PeriodObject;
		const current_year = '20'+(periodInfo.PERIOD_NAME).split('-')[1];
		const current_month = periodInfo.PERIOD_NAME.split('-')[0]!;
		const levaing_year = quit_date.split('/')[0]!;
		const leaving_month = quit_date.split('/')[1]!;
		const monthDict: {
			[key: string]: string;
		} = {
			"JAN": "1",
			"FEB": "2",
			"MAR": "3",
			"APR": "4",
			"MAY": "5",
			"JUN": "6",
			"JUL": "7",
			"AUG": "8",
			"SEP": "9",
			"OCT": "10",
			"NOV": "11",
			"DEC": "12"
		}
		if (parseInt(current_year) < parseInt(levaing_year))
			return 'future'
		else if (parseInt(current_year) == parseInt(levaing_year)) {
			if (parseInt(monthDict[current_month]!) < parseInt(leaving_month))
				return 'future'
			else if (parseInt(monthDict[current_month]!) == parseInt(leaving_month))
				return 'current'
			else
				return 'past'
		}
		else
			return 'past'
	}
	//stage1
	async getCandPaidEmployees(func: string, period:number): Promise<PaidEmployee[]> {
		var paid_emps: PaidEmployee[] = [];
		const ehrService = container.resolve(EHRService);
		const pay_work_status = ["一般人員", "當月離職人員_破月", "當月離職人員_全月"];
		if (func == "month_pay") {
			var salary_emps = await EmployeeData.findAll({
				attributes: [ "emp_name", "english_name", "u_dep","emp_no", "work_status", "departure_date"],
			});
			var ehr_emps = await ehrService.getEmp(period);
			// Step 1: Create a dictionary for ehr_emps
			interface EHRDictType {
				[key: string]: any;
			};
			const ehrDict: EHRDictType = {};
			ehr_emps.forEach(emp => {
				ehrDict[emp.emp_no] = emp;
			});

			// Step 2: Replace corresponding records in salary_emps with ehr_emps
			const updatedSalaryEmps = salary_emps.map(salaryEmp => {
				const matchingEhrEmp = ehrDict[salaryEmp.emp_no];
				return matchingEhrEmp ? { ...salaryEmp, ...matchingEhrEmp } : salaryEmp;
			});

			// Step 3: Filter ehr_emps to get only the new employees
			const newEmployees = ehr_emps.filter(emp => emp.work_status === '新進人員');
			newEmployees.map(emp => {
				this.createEmployeeData({
					emp_no: emp.emp_no,
					emp_name: emp.emp_name,
					position: emp.position,
					position_type: emp.position_type,
					ginsurance_type: emp.ginsurance_type,
					u_dep: emp.u_dep,
					work_type: emp.work_type,
					work_status: emp.work_status,
					accesible: emp.accesible,
					sex_type: emp.sex_type,
					dependents: emp.dependents,
					healthcare: emp.healthcare,
					registration_date: emp.registration_date,
					quit_date: emp.quit_date,
					licens_id: emp.licens_id,
					nbanknumber: emp.nbanknumber
				})
			})
			// Step 4: Concatenate updatedSalaryEmps and newEmployees to get all_emps
			const all_emps = updatedSalaryEmps.concat(newEmployees);

			// Output or use all_emps as needed
			console.log(all_emps);
			console.log('check all emps')
			var msg=''
			paid_emps = await Promise.all(all_emps.map(async (emp) => {
				// var work_check = true //由工作型態判斷要發薪的人員
				// var quit_check = false //由離職日期判斷要發薪的人員
				switch (emp.work_type) {
					case "一般人員":
						if (emp.quit_date != null) {
							if( await this.checkQuitDate(period, emp.quit_date) !='future'){
								msg = '一般人員卻有不合理離職日期('+emp.quit_date+')';
							}
						}
						break;
					case "當月離職人員_破月":
						if (emp.quit_date == null) {
							msg = '當月離職人員卻沒有離職日期'
						}
						else {
							if ( await this.checkQuitDate(period, emp.quit_date) !='current'){
								msg = '當月離職人員卻有不合理離職日期('+emp.quit_date+')';
							}
						}
						break;
					case "當月離職人員_全月":
						if (emp.quit_date == null) {
							msg = '當月離職人員卻沒有離職日期'
						}
						else {
							if ( await this.checkQuitDate(period, emp.quit_date) !='current'){
								msg = '當月離職人員卻有不合理離職日期('+emp.quit_date+')';
							}
						}
						break;
					case "離職人員":
						if (emp.quit_date == null) {
							msg = '離職人員卻沒有離職日期'
						}
						else {
							if ( await this.checkQuitDate(period, emp.quit_date) !='past'){
								msg = '離職人員卻有不合理離職日期('+emp.quit_date+')';
							}
						}
				}
				const paid_emp : PaidEmployee = {
					emp_no: emp.emp_no,
					name: emp.emp_name,
					english_name: emp.english_name,
					department: emp.department,
					work_status: emp.work_status,
					quit_date: emp.departure_date,
					bug: (msg!='')?msg:undefined
				}
				return paid_emp
			}))
		}
		return paid_emps
	}
	//stage2
	async checkEmployeeData(
		func: string,
		period: number,
	): Promise<CombinedData[][] | undefined> {
		const ehrService = container.resolve(EHRService);
		var db_datas = [];

		const cand_paid_emps = await this.getCandPaidEmployees(func, period);
		const emp_nos = cand_paid_emps.map((emp) => emp.emp_no);
		if (func == "month_salary") {
			db_datas = await EmployeeData.findAll({
				where: {
					emp_no: {
						[Op.in]: emp_nos,
					}
				}
			});
		} else {
			db_datas = await EmployeeData.findAll({});
		}

		const changedDatas = await Promise.all(
			db_datas.map(async (db_data) => {
				await this.updateEmployeeData({
					id: db_data.id,
					// has_esot: !db_data.has_esot,
				});

				var ehr_datas = await ehrService.getEmp(period);
				const excludedKeys = [
					"create_date",
					"create_by",
					"update_date",
					"update_by",
				];
				// const dates = ['hire_date', 'entry_date', 'departure_date', 'birthdate'];
				const keys = Object.keys(db_data.dataValues);
				const combinedDatas = await Promise.all(
					keys.map(async (key) => {
						const db_value = (db_data as any)[key];
						const ehr_value = (ehr_datas as any)[key];
						const is_different =
							!excludedKeys.includes(key) &&
							db_value !== ehr_value;
						const combinedData: CombinedData = {
							key: key,
							db_value: db_value,
							ehr_value: ehr_value,
							is_different: is_different,
						};
						return combinedData;
					})
				);

				if (
					combinedDatas.some(
						async (combinedData) =>
							(await combinedData.is_different) === true
					)
				) {
					return combinedDatas;
				}
				return undefined; // Explicitly return undefined for the cases where db_data is equal to ehrData
			})
		);

		// Filter out the undefined values
		const filteredChangeDatas = changedDatas.filter(
			(data): data is CombinedData[] => data !== undefined
		);

		return filteredChangeDatas;
	}
	//stage3
	async getPaidEmps(func: string) {
		if (func == "month") {
			const paid_status=["一般人員","當月離職人員_全月","當月離職人員_破月"]
		const paid_emps = await EmployeeData.findAll({
			where: {
				work_status: {
					[Op.in]: paid_status
				}
			},
		})
		return paid_emps;
		}
	}
}
