import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { EHRService } from "./ehr_service";
import { type Emp } from "../database/entity/UMEDIA/emp";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { type Exact } from "~/utils/exact_type";
import {
	FunctionsEnum,
	type FunctionsEnumType,
} from "../api/types/functions_enum";
import { EmployeeTrustService } from "./employee_trust_service";
import {
	type DataComparison,
	type PaidEmployee,
	QuitDateEnum,
	type QuitDateEnumType,
	SyncData,
	type SyncInputType,
} from "../api/types/sync_type";
import { type Period } from "../database/entity/UMEDIA/period";
import { LongServiceEnum } from "../api/types/long_service_enum";
import { createEmployeeDataService } from "../api/types/employee_data_type";
import { Op } from "sequelize";
import { WorkStatusEnum } from "../api/types/work_status_enum";
import { z } from "zod";

@injectable()
export class SyncService {
	constructor(
		private readonly ehrService: EHRService,
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeePaymentService: EmployeePaymentService,
		private readonly employeeTrustService: EmployeeTrustService
	) { }
	// TODO: move this
	parsedPeriod(
		period: Period
	): Period & { period_year: number; period_month: number } {
		const current_year = "20" + period.period_name.split("-")[1];
		const current_month = period.period_name.split("-")[0]!;
		const year = parseInt(current_year);

		const monthDict: Record<string, number> = {
			JAN: 1,
			FEB: 2,
			MAR: 3,
			APR: 4,
			MAY: 5,
			JUN: 6,
			JUL: 7,
			AUG: 8,
			SEP: 9,
			OCT: 10,
			NOV: 11,
			DEC: 12,
		};

		const month = monthDict[current_month];
		if (!month) {
			throw new Error(`Invalid month: ${current_month}`);
		}

		return { ...period, period_year: year, period_month: month };
	}

	async getPreviousPeriodId(period_id: number): Promise<number> {
		const ehr_service = container.resolve(EHRService);
		const previousMonthDict: Record<string, string> = {
			JAN: "DEC",
			FEB: "JAN",
			MAR: "FEB",
			APR: "MAR",
			MAY: "APR",
			JUN: "MAY",
			JUL: "JUN",
			AUG: "JUL",
			SEP: "AUG",
			OCT: "SEP",
			NOV: "OCT",
			DEC: "NOV",
		};
		const period_name = (await ehr_service.getPeriodById(period_id))
			.period_name;
		const previous_month = previousMonthDict[period_name.split("-")[0]!];
		const year =
			previous_month === "DEC"
				? String(parseInt(period_name.split("-")[1]!) - 1)
				: period_name.split("-")[1];
		const previous_period_id = (
			await ehr_service.getPeriodByName(`${previous_month}-${year}`)
		).period_id;
		return previous_period_id;
	}
	async checkQuitDate(
		parsedPeriod: Period & { period_year: number; period_month: number },
		quit_date: string | null
	): Promise<QuitDateEnumType> {
		if (!quit_date) return QuitDateEnum.Values.null;

		const leaving_year_str = quit_date.split("-")[0]!; //讀出來是2023-05-04的形式
		const leaving_month_str = quit_date.split("-")[1]!;
		const levaing_year = parseInt(leaving_year_str);
		const leaving_month = parseInt(leaving_month_str);

		if (parsedPeriod.period_year < levaing_year)
			return QuitDateEnum.Values.future;
		else if (parsedPeriod.period_year == levaing_year) {
			if (parsedPeriod.period_month < leaving_month)
				return QuitDateEnum.Values.future;
			else if (parsedPeriod.period_month == leaving_month)
				return QuitDateEnum.Values.current;
			else return QuitDateEnum.Values.past;
		} else return QuitDateEnum.Values.past;
	}

	// TODO: move this
	// 將EHR資料格式轉換 Salary資料格式
	empToEmployee(
		ehr_data: Emp,
		period_id: number
	): z.infer<typeof createEmployeeDataService> {
		return {
			period_id: period_id,
			emp_no: ehr_data.emp_no,
			emp_name: ehr_data.emp_name,
			position: ehr_data.position,
			position_type: ehr_data.position_type,
			group_insurance_type: ehr_data.group_insurance_type,
			department: ehr_data.department,
			work_type: ehr_data.work_type,
			work_status: ehr_data.work_status,
			disabilty_level: ehr_data.disabilty_level,
			sex_type: ehr_data.sex_type,
			dependents: ehr_data.dependents,
			healthcare_dependents: ehr_data.healthcare_dependents,
			registration_date: ehr_data.registration_date,
			quit_date: ehr_data.quit_date!,
			license_id: ehr_data.license_id!,
			bank_account: ehr_data.bank_account!,
		};
	}

	dataComparison<ValueT>(
		key: keyof EmployeeData,
		ehrData: ValueT,
		salaryData?: ValueT
	) {
		const excludedKeys: (keyof EmployeeData)[] = [
			"id",
			// "accumulated_bonus",
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
		ehrEmp: Partial<Exact<T, EmployeeData>>,
		salaryEmp?: Exact<T, EmployeeData>
	): SyncData {
		// TODO: change this
		// syncData.english_name = this.dataComparison("english_name", ehrEmp.english_name, salaryEmp?.english_name);
		const pseudo_english_name: DataComparison = {
			key: "english_name",
			salary_value: "Howard",
			ehr_value: "Howard",
			is_different: false,
		};

		const syncData: SyncData = new SyncData({
			emp_no: this.dataComparison(
				"emp_no",
				ehrEmp.emp_no,
				salaryEmp?.emp_no
			),
			name: this.dataComparison(
				"emp_name",
				ehrEmp.emp_name,
				salaryEmp?.emp_name
			),
			department: this.dataComparison(
				"department",
				ehrEmp.department,
				salaryEmp?.department
			),
			english_name: pseudo_english_name,
			comparisons: [],
		});

		syncData.comparisons = [];
		for (const key in ehrEmp) {
			if (key == "emp_no" || key == "id") continue;
			syncData.comparisons.push(
				this.dataComparison(
					key as keyof EmployeeData,
					ehrEmp[key],
					salaryEmp?.get(key)
				)
			);
		}

		return syncData;
	}

	// Stage 1
	async getCandPaidEmployees(
		func: FunctionsEnumType, // 要執行的功能
		period_id: number // 期間
	): Promise<PaidEmployee[]> {
		// 返回需支付的員工數組的Promise
		let cand_paid_emps: PaidEmployee[] = [];
		const paid_status = [
			// 支付工作狀態列表
			"一般員工",
			"外籍勞工",
			"當月離職人員全月",
			"當月離職人員破月",
			"當月新進人員全月",
			"當月新進人員破月",
		];

		if (func == FunctionsEnum.Enum.month_salary) {
			// 如果功能是月薪計算
			const salary_emps_data = await EmployeeData.findAll({
				attributes: [
					"emp_name",
					"department",
					"emp_no",
					"work_status",
					"quit_date",
				],
			});

			// 篩選符合支付工作狀態的員工
			const salary_emps: z.infer<typeof createEmployeeDataService>[] =
				salary_emps_data.filter((emp) => {
					return paid_status.includes(emp.work_status);
				});

			const salary_emp_nos = salary_emps.map((emp) => emp.emp_no); // 提取工資員工的員工編號
			const ehr_emps = await this.ehrService.getEmp(period_id); // 從EHR服務中獲取員工數據

			// 步驟1: 創建ehr_emps的字典
			const ehrDict: Map<string, Emp> = new Map<string, Emp>();
			ehr_emps.forEach((emp) => {
				ehrDict.set(emp.emp_no, emp);
			});

			// 步驟2: 添加新員工
			const newEmps: Array<Emp> = [];
			ehr_emps.map((emp) => {
				if (
					emp.change_flag == "當月新進" &&
					!salary_emp_nos.includes(emp.emp_no)
				)
					newEmps.push(emp);
			});
			// 將新員工轉換為Employee
			const new_employees: z.infer<typeof createEmployeeDataService>[] = newEmps.map(
				(emp) => this.empToEmployee(emp, period_id)
			);

			const all_emps = salary_emps.concat(new_employees); // 合併所有員工數據

			// 最新的所有員工數據
			const updated_all_emps = all_emps.map((salaryEmp) => {
				const matchingEhrEmp = ehrDict.get(salaryEmp.emp_no);
				return matchingEhrEmp
					? this.empToEmployee(matchingEhrEmp, period_id)
					: salaryEmp;
			});
			const periodInfo = await this.ehrService.getPeriodById(period_id);
			const parsedPeriod = this.parsedPeriod(periodInfo);
			// NOTE: check employee work status
			// NOTE: 檢查所有員工的支付狀態有無不合理處
			cand_paid_emps = await Promise.all(
				updated_all_emps.map(async (emp) => {
					let msg = "";
					const quit_date = await this.checkQuitDate(
						parsedPeriod,
						emp.quit_date
					);
					switch (emp.work_status) {
						case "一般員工":
							// 檢查不合理的離職日期
							if (quit_date !== QuitDateEnum.Values.future) {
								msg = `一般員工卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						case "當月離職人員破月":
							// 檢查不合理的離職日期
							if (quit_date === QuitDateEnum.Values.null) {
								msg = "當月離職人員卻沒有離職日期";
							} else if (
								quit_date !== QuitDateEnum.Values.current
							) {
								msg = `當月離職人員卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						case "當月離職人員全月":
							// 檢查不合理的離職日期
							if (quit_date === QuitDateEnum.Values.null) {
								msg = "當月離職人員卻沒有離職日期";
							} else if (
								quit_date !== QuitDateEnum.Values.current
							) {
								msg = `當月離職人員卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						case "離職人員":
							// 檢查不合理的離職日期
							if (quit_date === QuitDateEnum.Values.null) {
								msg = "離職人員卻沒有離職日期";
							} else if (quit_date !== QuitDateEnum.Values.past) {
								msg = `離職人員卻有不合理離職日期(${emp.quit_date})`;
							}
							break;
						default:
							// 檢查不合理的離職日期
							if (quit_date !== QuitDateEnum.Values.future) {
								msg = `有不合理離職日期(${emp.quit_date})`;
							}
							break;
					}

					const cand_paid_emp: PaidEmployee = {
						emp_no: emp.emp_no,
						name: emp.emp_name,
						department: emp.department,
						work_status: emp.work_status,
						quit_date: emp.quit_date,
						bug: msg != "" ? msg : undefined, // 如果消息不為空，將其添加為bug屬性
					};
					return cand_paid_emp; // 返回候選已支付員工對象
				})
			);
		}
		return cand_paid_emps;
	}
	async createNewMonthData(period_id: number, emp_no_list: string[]) {
		const salary_datas = await EmployeeData.findAll({
			where: {
				emp_no: {
					[Op.in]: emp_no_list,
				},
				period_id: period_id,
			},
		});
		const previous_period_id = await this.getPreviousPeriodId(period_id);
		const employee_data_service = container.resolve(EmployeeDataService);
		if (salary_datas.length == 0) {
			emp_no_list.forEach(async (emp_no) => {
				const old_employee_data =
					await employee_data_service.getEmployeeDataByEmpNoByPeriod(
						previous_period_id,
						emp_no
					);
				if (!old_employee_data) return;
				if (
					old_employee_data?.work_status ==
					WorkStatusEnum.Values.當月離職人員破月 ||
					old_employee_data?.work_status ==
					WorkStatusEnum.Values.當月離職人員全月
				) {
					employee_data_service.createEmployeeData({
						...old_employee_data,
						period_id: period_id,
						work_status: WorkStatusEnum.Enum.離職人員,
					});
				} else if (
					old_employee_data?.work_status ==
					WorkStatusEnum.Values.當月新進人員破月 ||
					old_employee_data?.work_status ==
					WorkStatusEnum.Values.當月新進人員全月
				) {
					employee_data_service.createEmployeeData({
						...old_employee_data,
						period_id: period_id,
						work_status: WorkStatusEnum.Values.一般員工,
					});
				} else {
					employee_data_service.createEmployeeData({
						...old_employee_data,
						period_id: period_id,
					});
				}
			});
		}
	}
	// Stage 2
	async checkEmployeeData(
		func: FunctionsEnumType,
		period_id: number
	): Promise<SyncData[] | null> {
		const cand_paid_emps = await this.getCandPaidEmployees(func, period_id); // 獲取候選需支付員工數據
		const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no); // 提取候選員工的員工編號列表
		await this.createNewMonthData(period_id, cand_emp_no_list);
		// Get Data from Salary and EHR
		let salary_datas: EmployeeData[] = [];

		if (func == FunctionsEnum.Enum.month_salary) {
			salary_datas = await EmployeeData.findAll({
				where: {
					emp_no: {
						[Op.in]: cand_emp_no_list,
					},
					period_id: period_id,
				},
			});
		}
		// else {
		// 	salary_datas = await EmployeeData.findAll({}); // 否則查找所有工資數據
		// }

		const ehr_datas: Emp[] = await this.ehrService.getEmp(period_id);
		const ehr_datas_transformed: z.infer<typeof createEmployeeDataService>[] =
			ehr_datas.map((emp) => this.empToEmployee(emp, period_id));

		// Lookup table by EMP_NO
		const ehrDict: Map<string, Partial<EmployeeData>> = new Map<
			string,
			Partial<EmployeeData>
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

	async synchronize(period_id: number, change_emp_list: SyncInputType[]) {
		// NOTE: All employee data from EHR
		const period = await this.ehrService.getPeriodById(period_id);
		const ehr_datas = await this.ehrService.getEmp(period_id);
		const ehrDict: Map<string, Emp> = new Map<string, Emp>();
		ehr_datas.forEach((emp) => {
			ehrDict.set(emp.emp_no, emp);
		});

		// NOTE: All the employee that needs to be updated
		const changed_emp_nos = change_emp_list.map((emp) => emp.emp_no);

		// All existing employee data from Salary
		const salary_datas = await EmployeeData.findAll({
			where: { period_id: period_id, emp_no: { [Op.in]: changed_emp_nos } },
		});

		// Get services

		// Update fields
		const updatedDatas: EmployeeData[] = [];
		for (const changeEmp of change_emp_list) {
			// TODO: the data type is incorrect, lacking type check (period_id is missing)
			// TODO: append period_id
			const ehr_emp_data: z.infer<typeof createEmployeeDataService> =
				this.empToEmployee(ehrDict.get(changeEmp.emp_no)!, period_id);

			let salary_emp_data: EmployeeData | undefined = salary_datas.find(
				(emp) => emp.emp_no == changeEmp.emp_no
			);
			// Create default employee if not exist
			// TODO: Refactor this
			if (!salary_emp_data) {
				salary_emp_data =
					await this.employeeDataService.createEmployeeData(
						ehr_emp_data
					);

				await this.employeePaymentService.createEmployeePayment({
					emp_no: ehr_emp_data.emp_no,
					long_service_allowance_type:
						LongServiceEnum.Enum.month_allowance,
					start_date: new Date(period.start_date),
					end_date: null,
					base_salary: 0,
					food_allowance: 0,
					supervisor_allowance: 0,
					occupational_allowance: 0,
					subsidy_allowance: 0,
					long_service_allowance: 0,
					l_r_self: 0,
					l_i: 0,
					h_i: 0,
					l_r: 0,
					occupational_injury: 0,
				});

				await this.employeeTrustService.createEmployeeTrust({
					emp_no: ehr_emp_data.emp_no,
					emp_trust_reserve: 0,
					emp_special_trust_incent: 0,
					start_date: new Date(0),
					end_date: null,
				});
			}

			// if (!salary_emp_data) {
			// 	throw new Error(
			// 		`Employee data for ${changeEmp.emp_no} does not exist`
			// 	);
			// }

			const updatedData: EmployeeData = salary_emp_data;
			for (const key of changeEmp.keys) {
				const data_key: keyof z.infer<typeof createEmployeeDataService> =
					key as keyof z.infer<typeof createEmployeeDataService>;
				updatedData.set(data_key, ehr_emp_data[data_key]);
			}

			await this.employeeDataService.updateEmployeeDataByEmpNoByPeriod(
				updatedData
			);
			updatedDatas.push(updatedData);

			if (updatedData.quit_date) {
				await this.employeePaymentService.rescheduleEmployeePaymentByQuitDate(updatedData.emp_no, period_id)
				await this.employeeTrustService.rescheduleEmployeeTrustByQuitDate(updatedData.emp_no, period_id)
			}
		}

		return updatedDatas;
	}

	// Stage 3
	// 獲取需支付員工的函數
	async getPaidEmps(func: FunctionsEnumType, period_id: number): Promise<EmployeeData[]> {
		if (func == FunctionsEnum.Enum.month_salary) {
			// 定義需支付的員工狀態列表
			const paid_status = [
				"一般員工",
				"外籍勞工",
				"當月離職人員全月",
				"當月離職人員破月",
				"當月新進人員全月",
				"當月新進人員破月",
			];
			const paid_emps = await EmployeeData.findAll({
				where: {
					// work_status: {
					// 	[Op.in]: paid_status,
					// },
					period_id: period_id,
				},
			});
			return paid_emps.filter((emp) => paid_status.includes(emp.work_status));
		} else {
			// 如果功能不是月薪計算
			const paid_emps = await EmployeeData.findAll({}); // 查找所有需支付的員工數據
			return paid_emps;
		}
	}
}
