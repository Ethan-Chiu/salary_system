import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { type InferAttributes, Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { type Emp } from "../database/entity/UMEDIA/emp";
import { EmployeeDataService } from "./employee_data_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { type Exact } from "~/utils/exact_type";
import {
	FunctionsEnum,
	type FunctionsEnumType,
} from "../api/types/functions_enum";
import { EmployeePaymentMapper } from "../database/mapper/employee_payment_mapper";
/* import { EmployeeTrustService } from "./employee_trust_service"; */
/* import { EmployeeTrustMapper } from "../database/mapper/employee_trust_mapper"; */
import {
	type DataComparison,
	type PaidEmployee,
	QuitDateEnum,
	type QuitDateEnumType,
	SyncData,
	type SyncInputType,
} from "../api/types/sync_type";
import { type Period } from "../database/entity/UMEDIA/period";
import { type EmployeePaymentFEType } from "../api/types/employee_payment_type";
import { LongServiceeEnum } from "../api/types/long_service_enum";

@injectable()
export class SyncService {
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

	async checkQuitDate(
		period: number,
		quit_date: string | null
	): Promise<QuitDateEnumType> {
		if (!quit_date) return QuitDateEnum.Values.null;

		const ehrService = container.resolve(EHRService);

		const periodInfo = await ehrService.getPeriodById(period);
		const parsedPeriod = this.parsedPeriod(periodInfo);

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
	// 將EHR資料格式轉換為Salary資料格式
	empToEmployee(ehr_data: Emp): EmployeeData {
		const salary_data = new EmployeeData();
		salary_data.emp_no = ehr_data.emp_no!;
		salary_data.emp_name = ehr_data.emp_name!;
		salary_data.position = ehr_data.position!;
		salary_data.position_type = ehr_data.position_type!;
		salary_data.group_insurance_type = ehr_data.group_insurance_type!;
		salary_data.department = ehr_data.department!;
		salary_data.work_type = ehr_data.work_type!;
		salary_data.work_status = ehr_data.work_status!;
		salary_data.disabilty_level = ehr_data.disabilty_level!;
		salary_data.sex_type = ehr_data.sex_type!;
		salary_data.dependents = ehr_data.dependents!;
		salary_data.healthcare_dependents = ehr_data.healthcare_dependents!;
		salary_data.registration_date = ehr_data.registration_date!;
		salary_data.quit_date = ehr_data.quit_date!;
		salary_data.license_id = ehr_data.license_id!;
		salary_data.bank_account = ehr_data.bank_account!;
		// salary_data.accumulated_bonus = 0;
		return salary_data;
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
			"department",
			ehrEmp.department,
			salaryEmp?.department
		);
		// TODO: change this
		// syncData.english_name = this.dataComparison("english_name", ehrEmp.english_name, salaryEmp?.english_name);
		const pseudo_english_name: DataComparison = {
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
		func: FunctionsEnumType, // 要執行的功能
		period: number // 期間
	): Promise<PaidEmployee[]> {
		const ehrService = container.resolve(EHRService); // 獲取EHR服務的實例

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
			let salary_emps = await EmployeeData.findAll({
				attributes: [
					"emp_name",
					"department",
					"emp_no",
					"work_status",
					"quit_date",
				],
			});
			// 篩選符合支付工作狀態的員工
			salary_emps = salary_emps.filter((emp) => {
				return paid_status.includes(emp.work_status);
			});

			const salary_emp_nos = salary_emps.map((emp) => emp.emp_no); // 提取工資員工的員工編號
			const ehr_emps = await ehrService.getEmp(period); // 從EHR服務中獲取員工數據

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
			const new_employees: EmployeeData[] = newEmps.map((emp) =>
				this.empToEmployee(emp)
			);

			const all_emps = salary_emps.concat(new_employees); // 合併所有員工數據

			// 最新的所有員工數據
			const updated_all_emps = all_emps.map((salaryEmp) => {
				const matchingEhrEmp = ehrDict.get(salaryEmp.emp_no);
				return matchingEhrEmp
					? this.empToEmployee(matchingEhrEmp)
					: salaryEmp;
			});
			// NOTE: check employee work status
			// NOTE: 檢查所有員工的支付狀態有無不合理處
			cand_paid_emps = await Promise.all(
				updated_all_emps.map(async (emp) => {
					let msg = "";
					const quit_date = await this.checkQuitDate(
						period,
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

	// Stage 2
	async checkEmployeeData(
		func: FunctionsEnumType,
		period: number
	): Promise<SyncData[] | null> {
		const ehrService = container.resolve(EHRService);

		const cand_paid_emps = await this.getCandPaidEmployees(func, period); // 獲取候選需支付員工數據
		const cand_emp_no_list = cand_paid_emps.map((emp) => emp.emp_no); // 提取候選員工的員工編號列表

		// Get Data from Salary and EHR
		let salary_datas: EmployeeData[] = [];

		if (func == FunctionsEnum.Enum.month_salary) {
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

	async synchronize(period: number, change_emp_list: SyncInputType[]) {
		const ehrService = container.resolve(EHRService);
		// NOTE: All employee data from EHR
		const ehr_datas = await ehrService.getEmp(period);
		const ehrDict: Map<string, Emp> = new Map<string, Emp>();
		ehr_datas.forEach((emp) => {
			ehrDict.set(emp.emp_no, emp);
		});

		// NOTE: All the employee that needs to be updated
		const changed_emp_nos = change_emp_list.map((emp) => emp.emp_no);

		// All existing employee data from Salary
		const salary_datas = await EmployeeData.findAll({
			where: { emp_no: { [Op.in]: changed_emp_nos } },
		});

		// Get services
		const employee_data_service = container.resolve(EmployeeDataService);
		const employee_payment_service = container.resolve(
			EmployeePaymentService
		);
		const employee_payment_mapper = container.resolve(
			EmployeePaymentMapper
		);
		/* const employee_trust_setvice = container.resolve(EmployeeTrustService); */
		/* const employee_trust_mapper = container.resolve(EmployeeTrustMapper); */

		// Update fields
		const updatedDatas: EmployeeData[] = [];
		for (const changeEmp of change_emp_list) {
      // TODO: the data type is incorrect, lacking type check (period_id is missing)
      // TODO: append period_id 
			const ehr_emp_data: EmployeeData = this.empToEmployee(
				ehrDict.get(changeEmp.emp_no)!
			);

			let salary_emp_data: EmployeeData | undefined = salary_datas.find(
				(emp) => emp.emp_no == changeEmp.emp_no
			);
			// Create default employee if not exist
			// TODO: Refactor this
			if (!salary_emp_data) {
				salary_emp_data =
					await employee_data_service.createEmployeeData(
						ehr_emp_data
					);

				const payment_input: EmployeePaymentFEType = {
					emp_no: ehr_emp_data.emp_no,
					base_salary: 0,
					food_allowance: 0,
					supervisor_allowance: 0,
					occupational_allowance: 0,
					subsidy_allowance: 0,
					long_service_allowance: 0,
					long_service_allowance_type: LongServiceeEnum.Enum.月領,
					l_r_self: 0,
					l_i: 0,
					h_i: 0,
					l_r: 0,
					occupational_injury: 0,
					start_date: new Date(ehr_emp_data.registration_date),
					end_date: null,
				};
				const employee_payment_input =
					await employee_payment_mapper.getEmployeePayment(
						payment_input
					);
				await employee_payment_service.createEmployeePayment(
					employee_payment_input
				);

				// const employee_trust_input = {
				// 	emp_no: updatedData.emp_no,
				// 	emp_trust_reserve: 0,
				// 	org_trust_reserve: 0,
				// 	emp_special_trust_incent: 0,
				// 	org_special_trust_incent: 0,
				// 	start_date: new Date(updatedData.registration_date),
				// 	end_date: null,
				// };
				// const employee_trust = await employee_trust_mapper.getEmployeeTrust(employee_trust_input);
				// await employee_trust_setvice.createEmployeeTrust(employee_trust);

				// TODO:
				/* salary_emp_data = ehr_emp_data; */
			}

			if (!salary_emp_data) {
				throw new Error(
					`Employee data for ${changeEmp.emp_no} does not exist`
				);
			}

			const updatedData: EmployeeData = salary_emp_data;
			for (const key of changeEmp.keys) {
				const data_key: keyof InferAttributes<EmployeeData> =
					key as keyof InferAttributes<EmployeeData>;
				updatedData.set(data_key, ehr_emp_data[data_key]);
			}

			await employee_data_service.updateEmployeeDataByEmpNo(updatedData);
			updatedDatas.push(updatedData);
		}

		return updatedDatas;
	}

	// Stage 3
	// 獲取需支付員工的函數
	async getPaidEmps(func: FunctionsEnumType): Promise<EmployeeData[]> {
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
					work_status: {
						[Op.in]: paid_status,
					},
				},
			});
			return paid_emps;
		} else {
			// 如果功能不是月薪計算
			const paid_emps = await EmployeeData.findAll({}); // 查找所有需支付的員工數據
			return paid_emps;
		}
	}
}
