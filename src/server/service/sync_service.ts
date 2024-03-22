import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { Emp } from "../database/entity/UMEDIA/emp";
import { EmployeeDataService } from "./employee_data_service";

export interface CombinedData {
	key: string;
	salary_value: any;
	ehr_value: any;
	is_different: boolean;
}
export interface PaidEmployee {
	emp_no: string;
	name: string;
	department: string;
	work_status: string;
	quit_date: string | null;
	bug?: string;
}

@injectable()
export class SyncService {
	constructor() {}
	async checkQuitDate(period: number, quit_date: string): Promise<string> {
		const ehrService = container.resolve(EHRService);
		const periodInfo = await ehrService.getPeriodById(period);
		const current_year = "20" + periodInfo.period_name.split("-")[1];
		const current_month = periodInfo.period_name.split("-")[0]!;
		const levaing_year = quit_date.split("-")[0]!; //讀出來是2023-05-04的形式
		const leaving_month = quit_date.split("-")[1]!;
		const monthDict: {
			[key: string]: string;
		} = {
			JAN: "1",
			FEB: "2",
			MAR: "3",
			APR: "4",
			MAY: "5",
			JUN: "6",
			JUL: "7",
			AUG: "8",
			SEP: "9",
			OCT: "10",
			NOV: "11",
			DEC: "12",
		};
		// console.log(current_year);
		// console.log(current_month);
		// console.log(levaing_year);
		// console.log(leaving_month);
		// console.log(parseInt(current_year))
		// console.log(parseInt(levaing_year))
		// console.log(parseInt(monthDict[current_month]!))
		// console.log(parseInt(leaving_month))
		// console.log(parseInt(monthDict[current_month]!) == parseInt(leaving_month))
		if (parseInt(current_year) < parseInt(levaing_year)) return "future";
		else if (parseInt(current_year) == parseInt(levaing_year)) {
			if (parseInt(monthDict[current_month]!) < parseInt(leaving_month))
				return "future";
			else if (
				parseInt(monthDict[current_month]!) == parseInt(leaving_month)
			)
				return "current";
			else return "past";
		} else return "past";
	}
	async empToEmployee(ehr_data: Emp) {
		let salary_data = new EmployeeData();
		salary_data.emp_no = ehr_data.emp_no!;
		salary_data.emp_name = ehr_data.emp_name!;
		salary_data.position = ehr_data.position!;
		salary_data.position_type = ehr_data.position_type!;
		salary_data.ginsurance_type = ehr_data.ginsurance_type!;
		salary_data.u_dep = ehr_data.u_dep!;
		salary_data.work_type = ehr_data.work_type!;
		salary_data.work_status = ehr_data.work_status!;
		salary_data.accessible = ehr_data.accessible!;
		salary_data.sex_type = ehr_data.sex_type!;
		salary_data.dependents = ehr_data.dependents!;
		salary_data.healthcare = ehr_data.healthcare!;
		salary_data.registration_date = ehr_data.registration_date!;
		salary_data.quit_date = ehr_data.quit_date!;
		salary_data.licens_id = ehr_data.licens_id!;
		salary_data.nbanknumber = ehr_data.nbanknumber!;
		return salary_data;
	}

	//stage1
	async getCandPaidEmployees(
		func: string,
		period: number
	): Promise<PaidEmployee[]> {
		let cand_paid_emps: PaidEmployee[] = [];
		const ehrService = container.resolve(EHRService);
		const pay_work_status = [
			"一般員工",
			"當月離職人員破月",
			"當月離職人員全月",
			"當月新進人員全月",
			"當月新進人員破月",
		];
		if (func == "month_salary") {
			let salary_emps = await EmployeeData.findAll({
				attributes: [
					"emp_name",
					"u_dep",
					"emp_no",
					"work_status",
					"quit_date",
				],
			});
			salary_emps = salary_emps.filter((emp) => {
				return pay_work_status.includes(emp.work_status!);
			});
			const salary_emp_nos = salary_emps.map((emp) => emp.emp_no);
			let ehr_emps = await ehrService.getEmp(period);
			// console.log("ehr_emps:");
			// console.log(ehr_emps);
			// Step 1: Create a dictionary for ehr_emps
			interface EHRDictType {
				[key: string]: any;
			}
			const ehrDict: EHRDictType = {};
			ehr_emps.forEach((emp) => {
				ehrDict[emp.emp_no!] = emp;
			});

			// Step 2: Add new employees
			let newEmps: Array<Emp> = [];
			ehr_emps.map((emp) => {
				Object.keys(emp).map((key) => {
					//console.log(key);
					//console.log((emp as any)[key]);
				});
				if (
					emp.change_flag == "當月新進" &&
					!salary_emp_nos.includes(emp.emp_no!)
				)
					newEmps.push(emp);
				// else
				//console.log(emp.change_flag);
			});
			const new_employees = await Promise.all(
				newEmps.map(async (emp) => await this.empToEmployee(emp))
			);
			const all_emps = salary_emps.concat(new_employees);

			const updated_all_emps = await Promise.all(
				all_emps.map(async (salaryEmp) => {
					const matchingEhrEmp = ehrDict[salaryEmp.emp_no];
					return matchingEhrEmp
						? await this.empToEmployee(matchingEhrEmp)
						: salaryEmp;
				})
			);
			let msg = "";
			cand_paid_emps = await Promise.all(
				updated_all_emps.map(async (emp) => {
					switch (emp.work_status) {
						case "一般員工":
							if (emp.quit_date != null) {
								if (
									(await this.checkQuitDate(
										period,
										emp.quit_date
									)) != "future"
								) {
									msg =
										"一般員工卻有不合理離職日期(" +
										emp.quit_date +
										")";
								}
							}
							break;
						case "當月離職人員破月":
							if (emp.quit_date == null) {
								msg = "當月離職人員卻沒有離職日期";
							} else {
								if (
									(await this.checkQuitDate(
										period,
										emp.quit_date
									)) != "current"
								) {
									msg =
										"當月離職人員卻有不合理離職日期(" +
										emp.quit_date +
										")";
								}
							}
							break;
						case "當月離職人員全月":
							if (emp.quit_date == null) {
								msg = "當月離職人員卻沒有離職日期";
							} else {
								if (
									(await this.checkQuitDate(
										period,
										emp.quit_date
									)) != "current"
								) {
									msg =
										"當月離職人員卻有不合理離職日期(" +
										emp.quit_date +
										")";
								}
							}
							break;
						case "離職人員":
							if (emp.quit_date == null) {
								msg = "離職人員卻沒有離職日期";
							} else {
								if (
									(await this.checkQuitDate(
										period,
										emp.quit_date
									)) != "past"
								) {
									msg =
										"離職人員卻有不合理離職日期(" +
										emp.quit_date +
										")";
								}
							}
							break;
						default:
							if (emp.quit_date != null) {
								if (
									(await this.checkQuitDate(
										period,
										emp.quit_date
									)) != "future"
								) {
									msg =
										"有不合理離職日期(" +
										emp.quit_date +
										")";
								}
							}
							break;
					}
					const cand_paid_emp: PaidEmployee = {
						emp_no: emp.emp_no,
						name: emp.emp_name,
						department: emp.u_dep,
						work_status: emp.work_status,
						quit_date: emp.quit_date,
						bug: msg != "" ? msg : undefined,
					};
					return cand_paid_emp;
				})
			);
		}
		return cand_paid_emps;
	}
	//stage2
	async checkEmployeeData(
		func: string,
		period: number
	): Promise<CombinedData[][] | undefined> {
		const ehrService = container.resolve(EHRService);
		let salary_datas = [];

		const cand_paid_emps = await this.getCandPaidEmployees(func, period);
		const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no);
		if (func == "month_salary") {
			salary_datas = await EmployeeData.findAll({
				where: {
					emp_no: {
						[Op.in]: cand_emp_no_list,
					}
				}
			});
		} else {
			salary_datas = await EmployeeData.findAll({});
		}
		const ehr_datas = await ehrService.getEmp(period);
		interface EmpDictType {
			[key: string]: any;
		}
		const ehrDict: EmpDictType = {};
		const salaryDict: EmpDictType = {};
		ehr_datas.forEach((emp) => {
			ehrDict[emp.emp_no!] = emp;
		});
		salary_datas.forEach((emp) => {
			salaryDict[emp.emp_no!] = emp;
		});
		const changedDatas = await Promise.all(
			cand_emp_no_list.map(async (cand_emp_no: string) => {
				const excludedKeys = [
					"id",
					"create_date",
					"create_by",
					"update_date",
					"update_by",
				];
				if (!ehrDict[cand_emp_no]) {
					return undefined;
				} else if (!salaryDict[cand_emp_no]) {
					const employee_data = await this.empToEmployee(
						ehrDict[cand_emp_no]
					);
					const keys = Object.keys(employee_data.dataValues);
					const combinedDatas = await Promise.all(
						keys.map(async (key) => {
							// console.log("key :" + key)
							const salary_value = undefined;
							// console.log("salary_value :" + salary_value)
							const ehr_value = (ehrDict[cand_emp_no] as any)[
								key
							];
							// console.log("ehr_value :" + ehr_value)
							const is_different =
								!excludedKeys.includes(key) &&
								salary_value !== ehr_value;
							// console.log("is_different :" + is_different)
							const combinedData: CombinedData = {
								key: key,
								salary_value: salary_value,
								ehr_value: ehr_value,
								is_different: is_different,
							};
							return combinedData;
						})
					);
					return combinedDatas;
				} else {
					const salary_data = salaryDict[cand_emp_no];
					const keys = Object.keys(salary_data.dataValues);
					const combinedDatas = await Promise.all(
						keys.map(async (key) => {
							// console.log("key :" + key)
							const salary_value = (salary_data as any)[key];
							// console.log("salary_value :" + salary_value)
							const ehr_value = (
								ehrDict[salary_data.emp_no] as any
							)[key];
							// console.log("ehr_value :" + ehr_value)
							const is_different =
								!excludedKeys.includes(key) &&
								salary_value !== ehr_value;
							// console.log("is_different :" + is_different)
							const combinedData: CombinedData = {
								key: key,
								salary_value: salary_value,
								ehr_value: ehr_value,
								is_different: is_different,
							};
							return combinedData;
						})
					);
					if (
						combinedDatas.some(
							(combinedData) => combinedData.is_different === true
						)
					) {
						return combinedDatas;
					}
					return undefined; // Explicitly return undefined for the cases where db_data is equal to ehrData
				}
			})
		);
		// Filter out the undefined values
		const filteredChangeDatas = changedDatas.filter(
			(data): data is CombinedData[] => data !== undefined
		);
		return filteredChangeDatas;
	}
	async synchronize(period: number, emp_no_list: string[]) {
		const ehrService = container.resolve(EHRService);
		const ehr_datas = await ehrService.getEmp(period);
		const salary_datas = await EmployeeData.findAll({ where: { emp_no: { [Op.in]: emp_no_list } } });
		const salary_emp_no_list = salary_datas.map((emp) => emp.emp_no);
		interface EHRDictType {
			[key: string]: any;
		}
		const ehrDict: EHRDictType = {};
		ehr_datas.forEach((emp) => {
			ehrDict[emp.emp_no!] = emp;
		});
		const updatedDatas = await Promise.all(
			emp_no_list.map(async (emp_no: string) => {
				const updatedData = await this.empToEmployee(ehrDict[emp_no])
				return updatedData
			})
		);
		const employee_data_service = container.resolve(EmployeeDataService);
		updatedDatas.map(async (updatedData) => {
			if (!(updatedData.emp_no in salary_emp_no_list)) {
				await employee_data_service.createEmployeeData(updatedData)
			}
			else
				await employee_data_service.updateEmployeeDataByEmpNO(updatedData)
		})
		return updatedDatas
	}
	//stage3
	async getPaidEmps(func: string): Promise<EmployeeData[]> {
		if (func == "month_salary") {
			const paid_status = [
				"一般員工",
				"當月離職人員全月",
				"當月離職人員破月",
				"當月新進人員全月",
				"當月新進人員破月",
			];
			const paid_emps = await EmployeeData.findAll({
				where: {
					work_status: {
						[Op.in]: paid_status,
					},
				},
			});
			return paid_emps;
		} else {
			const paid_emps = await EmployeeData.findAll({});
			return paid_emps;
		}
	}
}
