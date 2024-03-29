import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { Emp } from "../database/entity/UMEDIA/emp";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";

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
		func: string, // 要執行的功能
		period: number // 期間
	): Promise<PaidEmployee[]> {
		// 返回需支付的員工數組的Promise
		let cand_paid_emps: PaidEmployee[] = []; // 候選需支付員工數組初始化為空
		const ehrService = container.resolve(EHRService); // 獲取EHR服務的實例
		const pay_work_status = [
			// 支付工作狀態列表
			"一般員工",
			"當月離職人員破月",
			"當月離職人員全月",
			"當月新進人員全月",
			"當月新進人員破月",
		];
		if (func == "month_salary") {
			// 如果功能是月薪計算
			let salary_emps = await EmployeeData.findAll({
				// 查找所有員工數據
				attributes: [
					"emp_name",
					"u_dep",
					"emp_no",
					"work_status",
					"quit_date",
				],
			});
			salary_emps = salary_emps.filter((emp) => {
				// 篩選符合支付工作狀態的員工
				return pay_work_status.includes(emp.work_status!);
			});
			const salary_emp_nos = salary_emps.map((emp) => emp.emp_no); // 提取工資員工的員工編號
			let ehr_emps = await ehrService.getEmp(period); // 從EHR服務中獲取員工數據
			// 步驟1: 創建ehr_emps的字典
			interface EHRDictType {
				[key: string]: any;
			}
			const ehrDict: EHRDictType = {}; // 創建EHR字典
			ehr_emps.forEach((emp) => {
				// 將EHR員工映射到字典中
				ehrDict[emp.emp_no!] = emp;
			});

			// 步驟2: 添加新員工
			let newEmps: Array<Emp> = [];
			ehr_emps.map((emp) => {
				if (
					emp.change_flag == "當月新進" &&
					!salary_emp_nos.includes(emp.emp_no!)
				)
					newEmps.push(emp);
			});
			const new_employees = await Promise.all(
				// 將新員工轉換為Employee對象
				newEmps.map(async (emp) => await this.empToEmployee(emp))
			);
			const all_emps = salary_emps.concat(new_employees); // 合併所有員工數據

			const updated_all_emps = await Promise.all(
				// 最新的所有員工數據
				all_emps.map(async (salaryEmp) => {
					const matchingEhrEmp = ehrDict[salaryEmp.emp_no];
					return matchingEhrEmp
						? await this.empToEmployee(matchingEhrEmp)
						: salaryEmp;
				})
			);
			cand_paid_emps = await Promise.all(
				// 檢查所有員工的支付狀態有無不合理處
				updated_all_emps.map(async (emp) => {
					let msg = "";
					switch (
						emp.work_status // 根據工作狀態生成不同的消息
					) {
						case "一般員工":
							// 檢查不合理的離職日期
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
							// 檢查不合理的離職日期
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
							// 檢查不合理的離職日期
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
							// 檢查不合理的離職日期
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
							// 檢查不合理的離職日期
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
					// 創建候選需支付員工對象
					const cand_paid_emp: PaidEmployee = {
						emp_no: emp.emp_no,
						name: emp.emp_name,
						department: emp.u_dep,
						work_status: emp.work_status,
						quit_date: emp.quit_date,
						bug: msg != "" ? msg : undefined, // 如果消息不為空，將其添加為bug屬性
					};
					return cand_paid_emp; // 返回候選已支付員工對象
				})
			);
		}
		return cand_paid_emps; // 返回候選已支付員工數組
	}
	// Stage 2
	async checkEmployeeData(
		func: string, // 要執行的功能
		period: number // 期間
	): Promise<CombinedData[][] | undefined> {
		// 返回組合數據的二維數組的Promise或undefined
		const ehrService = container.resolve(EHRService); // 獲取EHR服務的實例
		let salary_datas = []; // 初始化工資數據為空

		const cand_paid_emps = await this.getCandPaidEmployees(func, period); // 獲取候選需支付員工數據
		const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no); // 提取候選員工的員工編號列表
		if (func == "month_salary") {
			// 如果功能是月薪計算
			salary_datas = await EmployeeData.findAll({
				// 查找符合候選員工編號的工資數據
				where: {
					emp_no: {
						[Op.in]: cand_emp_no_list,
					},
				},
			});
		} else {
			salary_datas = await EmployeeData.findAll({}); // 否則查找所有工資數據
		}
		const ehr_datas = await ehrService.getEmp(period); // 從EHR服務獲取員工數據
		interface EmpDictType {
			[key: string]: any;
		}
		const ehrDict: EmpDictType = {}; // 創建EHR員工字典
		const salaryDict: EmpDictType = {}; // 創建salary資料庫員工字典
		ehr_datas.forEach((emp) => {
			// 將EHR員工映射到字典中
			ehrDict[emp.emp_no!] = emp;
		});
		salary_datas.forEach((emp) => {
			// 將salary員工映射到字典中
			salaryDict[emp.emp_no!] = emp;
		});
		const changedDatas = await Promise.all(
			// 檢查並返回有更動的數據
			cand_emp_no_list.map(async (cand_emp_no: string) => {
				const excludedKeys = [
					// 排除的鍵列表
					"id",
					"create_date",
					"create_by",
					"update_date",
					"update_by",
				];
				if (!ehrDict[cand_emp_no]) {
					// 如果EHR中沒有對應的員工
					return undefined;
				} else if (!salaryDict[cand_emp_no]) {
					// 如果salary數據中沒有對應的員工
					const employee_data = await this.empToEmployee(
						// 將EHR數據轉換為Employee對象
						ehrDict[cand_emp_no]
					);
					const keys = Object.keys(employee_data.dataValues); // 獲取對象的鍵列表
					const combinedDatas = await Promise.all(
						// 創建所有欄位比較結果
						keys.map(async (key) => {
							const salary_value = undefined; // 舊值設置為undefined
							const ehr_value = (ehrDict[cand_emp_no] as any)[ // 從EHR字典中獲取值
								key
							];
							const is_different = // 判斷舊值和EHR值是否不同
								!excludedKeys.includes(key) &&
								salary_value !== ehr_value;
							const combinedData: CombinedData = {
								// 創建單一欄位比較結果
								key: key,
								salary_value: salary_value,
								ehr_value: ehr_value,
								is_different: is_different,
							};
							return combinedData;
						})
					);
					return combinedDatas; // 返回所有欄位比較結果
				} else {
					// 如果EHR數據和工資數據都存在
					const salary_data = salaryDict[cand_emp_no]; // 獲取工資數據
					const keys = Object.keys(salary_data.dataValues); // 獲取對象的鍵列表
					const combinedDatas = await Promise.all(
						// 創建所以欄位比較結果
						keys.map(async (key) => {
							const salary_value = (salary_data as any)[key]; // 從工資數據中獲取值
							const ehr_value = // 從EHR字典中獲取值
								(ehrDict[salary_data.emp_no] as any)[key];
							const is_different = // 判斷工資值和EHR值是否不同
								!excludedKeys.includes(key) &&
								salary_value !== ehr_value;
							const combinedData: CombinedData = {
								// 創建單一欄位比較結果
								key: key,
								salary_value: salary_value,
								ehr_value: ehr_value,
								is_different: is_different,
							};
							return combinedData;
						})
					);
					if (
						// 如果存在不同的數據則返回所有欄位比較結果
						combinedDatas.some(
							(combinedData) => combinedData.is_different === true
						)
					) {
						return combinedDatas; // 返回所有欄位比較結果
					}
					return undefined; // 對於db_data等於ehrData的情況，明確返回undefined
				}
			})
		);
		// 过滤掉未定义的值
		const filteredChangeDatas = changedDatas.filter(
			// 过滤未定义的值
			(data): data is CombinedData[] => data !== undefined
		);
		return filteredChangeDatas; // 返回過濾後的所有員工所有欄位比較結果
	}
	async synchronize(period: number, emp_no_list: string[]) {
		const ehrService = container.resolve(EHRService);
		const ehr_datas = await ehrService.getEmp(period);
		const salary_datas = await EmployeeData.findAll({
			where: { emp_no: { [Op.in]: emp_no_list } },
		});
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
				const updatedData = await this.empToEmployee(ehrDict[emp_no]);
				return updatedData;
			})
		);
		const employee_data_service = container.resolve(EmployeeDataService);
		const employee_payment_service = container.resolve(
			EmployeePaymentService
		);
		updatedDatas.map(async (updatedData) => {
			if (!salary_emp_no_list.includes(updatedData.emp_no)) {
				await employee_data_service.createEmployeeData(updatedData);
				let payment_input = {
					emp_no: updatedData.emp_no,
					base_salary: 0,
					food_bonus: 0,
					supervisor_comp: 0,
					job_comp: 0,
					subsidy_comp: 0,
					professional_cert_comp: 0,
					labor_retirement_self: 0,
					l_i: 0,
					h_i: 0,
					labor_retirement: 0,
					occupational_injury: 0,
					start_date: updatedData.registration_date,
					end_date: null,
				};
				await employee_payment_service.createEmployeePayment(
					payment_input
				);
			} else
				await employee_data_service.updateEmployeeDataByEmpNO(
					updatedData
				);
		});
		return updatedDatas;
	}
	//stage3
	// Stage 3
	async getPaidEmps(func: string): Promise<EmployeeData[]> {
		// 獲取需支付員工的函數，返回Promise<EmployeeData[]>類型的數組
		if (func == "month_salary") {
			// 如果功能是月薪計算
			const paid_status = [
				// 定義需支付的員工狀態列表
				"一般員工",
				"當月離職人員全月",
				"當月離職人員破月",
				"當月新進人員全月",
				"當月新進人員破月",
			];
			const paid_emps = await EmployeeData.findAll({
				// 查找符合需支付狀態的員工數據
				where: {
					work_status: {
						[Op.in]: paid_status,
					},
				},
			});
			return paid_emps; // 返回需支付員工數據
		} else {
			// 如果功能不是月薪計算
			const paid_emps = await EmployeeData.findAll({}); // 查找所有需支付的員工數據
			return paid_emps; // 返回需支付員工數據
		}
	}

	// async getPaidEmps(func: string): Promise<EmployeeData[]> {
	// 	if (func == "month_salary") {
	// 		const paid_status = [
	// 			"一般員工",
	// 			"當月離職人員全月",
	// 			"當月離職人員破月",
	// 			"當月新進人員全月",
	// 			"當月新進人員破月",
	// 		];
	// 		const paid_emps = await EmployeeData.findAll({
	// 			where: {
	// 				work_status: {
	// 					[Op.in]: paid_status,
	// 				},
	// 			},
	// 		});
	// 		return paid_emps;
	// 	} else {
	// 		const paid_emps = await EmployeeData.findAll({});
	// 		return paid_emps;
	// 	}
	// }
}
