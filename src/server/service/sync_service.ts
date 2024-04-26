import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { type Emp } from "../database/entity/UMEDIA/emp";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { EmployeeTrustService } from "./employee_trust_service";
import { type Exact } from "~/utils/exact_type";

export interface DataComparison<ValueT = any> {
	key: string;
	salary_value: ValueT;
	ehr_value: ValueT;
	is_different: boolean;
}

export class SyncData {
	emp_no: DataComparison<string>;
	name: DataComparison<string>;
	department: DataComparison;
	english_name: DataComparison;
	comparisons: Array<DataComparison>;
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
	async checkQuitDate(period: number, quit_date: string): Promise<string> {
		const ehrService = container.resolve(EHRService);
		const periodInfo = await ehrService.getPeriodById(period);
		const current_year = "20" + periodInfo.period_name.split("-")[1];
		const current_month = periodInfo.period_name.split("-")[0]!;
		const levaing_year = quit_date.split("-")[0]!; //讀出來是2023-05-04的形式
		const leaving_month = quit_date.split("-")[1]!;
		const monthDict: {[key: string]: string} = {
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

	empToEmployee(ehr_data: Emp) {
		const salary_data = new EmployeeData();
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

	dataComparison<ValueT>(
		key: keyof EmployeeData,
		ehrData: ValueT,
		salaryData?: ValueT
	) {
		const excludedKeys: (keyof EmployeeData)[] = [
			"id",
			"create_date",
			"create_by",
			"update_date",
			"update_by",
		];

		const isDifferent =
			!excludedKeys.includes(key) && ehrData !== salaryData;

		const comparison: DataComparison = {
			key: key,
			salary_value: salaryData,
			ehr_value: ehrData,
			is_different: isDifferent,
		};

		return comparison;
	}

	compareEmpData<T>(
		ehrEmp: Exact<T, EmployeeData>,
		salaryEmp?: Exact<T, EmployeeData>
	): SyncData {
		const syncData: SyncData = new SyncData();

		syncData.emp_no = this.dataComparison(
			"emp_no",
			ehrEmp.emp_no,
			salaryEmp?.emp_no
		);
		syncData.name = this.dataComparison(
			"emp_name",
			ehrEmp.emp_name,
			salaryEmp?.emp_name
		);
		syncData.department = this.dataComparison(
			"u_dep",
			ehrEmp.u_dep,
			salaryEmp?.u_dep
		);
		// syncData.english_name = this.dataComparison("english_name", ehrEmp.english_name, salaryEmp?.english_name);
		let pseudo_english_name: DataComparison = {
			key: "english_name",
			salary_value: "Howard",
			ehr_value: "Howard",
			is_different: false,
		};
		syncData.english_name = pseudo_english_name;

		syncData.comparisons = [];
		for (const key in ehrEmp.dataValues) {
			if (key == "emp_no" || key == "emp_name") continue;
			syncData.comparisons.push(
				this.dataComparison(
					key as keyof EmployeeData,
					ehrEmp.get(key),
					salaryEmp?.get(key)
				)
			);
		}

		return syncData;
	}

	// Stage 1
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
			const ehr_emps = await ehrService.getEmp(period); // 從EHR服務中獲取員工數據
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
				newEmps.map((emp) => this.empToEmployee(emp))
			);
			const all_emps = salary_emps.concat(new_employees); // 合併所有員工數據

			const updated_all_emps = await Promise.all(
				// 最新的所有員工數據
				all_emps.map((salaryEmp) => {
					const matchingEhrEmp = ehrDict[salaryEmp.emp_no];
					return matchingEhrEmp
						? this.empToEmployee(matchingEhrEmp)
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
		func: string,
		period: number
	): Promise<SyncData[] | null> {
		const ehrService = container.resolve(EHRService);

		const cand_paid_emps = await this.getCandPaidEmployees(func, period); // 獲取候選需支付員工數據
		const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no); // 提取候選員工的員工編號列表

		// Get Data from Salary and EHR
		let salary_datas: EmployeeData[] = [];

		if (func == "month_salary") {
			salary_datas = await EmployeeData.findAll({
				where: {
					emp_no: {
						[Op.in]: cand_emp_no_list,
					},
				},
			});
		} else {
			salary_datas = await EmployeeData.findAll({}); // 否則查找所有工資數據
		}

		const ehr_datas: Emp[] = await ehrService.getEmp(period);
		const ehr_datas_transformed: EmployeeData[] = ehr_datas.map((emp) =>
			this.empToEmployee(emp)
		);

		// Lookup table by EMP_NO
		const ehrDict: Map<string, EmployeeData> = new Map<
			string,
			EmployeeData
		>();
		const salaryDict: Map<string, EmployeeData> = new Map<
			string,
			EmployeeData
		>();

		ehr_datas_transformed.forEach((emp) => {
			ehrDict.set(emp.emp_no, emp);
		});
		salary_datas.forEach((emp) => {
			salaryDict.set(emp.emp_no, emp);
		});

		// Compare data
		const changedDatas: SyncData[] = [];
		for (const cand_emp_no of cand_emp_no_list) {
			// Get data from lookup table
			const ehrEmp = ehrDict.get(cand_emp_no);
			const salaryEmp = salaryDict.get(cand_emp_no);

			if (!ehrEmp) {
				continue;
			}

			const syncData = this.compareEmpData(ehrEmp, salaryEmp);
			const hasDiff = syncData.comparisons.some(
				(data) => data.is_different
			);
			if (hasDiff) changedDatas.push(syncData);
		}

		return changedDatas;
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
		const employee_trust_setvice = container.resolve(EmployeeTrustService);
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
				let employee_trust_input = {
					emp_no: updatedData.emp_no,
					emp_trust_reserve: 0,
					org_trust_reserve: 0,
					emp_special_trust_incent: 0,
					org_special_trust_incent: 0,
					start_date: updatedData.registration_date,
					end_date: null,
				};
				await employee_trust_setvice.createEmployeeTrust(
					employee_trust_input
				);
			} else
				await employee_data_service.updateEmployeeDataByEmpNO(
					updatedData
				);
		});
		return updatedDatas;
	}
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
}
