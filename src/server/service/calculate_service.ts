import { container, injectable } from "tsyringe";
import { Op } from "sequelize";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { EmployeePayment } from "../database/entity/SALARY/employee_payment";
import { Period } from "../database/entity/UMEDIA/period";
import { EHRService } from "./ehr_service";
import { Overtime } from "../database/entity/UMEDIA/overtime";
import { Payset } from "../database/entity/UMEDIA/payset";
import { InsuranceRateSetting } from "../database/entity/SALARY/insurance_rate_setting";

@injectable()
export class CalculateService {
	constructor() { }

	// 平/假日加班費
	async getOvertimeMoney(
		emp_no: string,
		period_id: number,
		overtime_type: "平日" | "假日"
	): Promise<number> {
		// get [Period] by id
		const period: Period = await container
			.resolve(EHRService)
			.getPeriodById(period_id);
		const period_start = period.start_date;
		const period_end = period.end_date ?? new Date();
		// get employee data (data and payment)
		const employee_data = await EmployeeData.findOne({
			where: {
				emp_no: emp_no,
			},
		});
		const employee_payment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: period_end,
				},
				end_date: {
					[Op.or]: [{ [Op.eq]: null }, { [Op.gte]: period_end }],
				},
			},
		});
		// get overtime
		const overtime = (
			await container.resolve(EHRService).getOvertime(period_id)
		).find(
			(o: Overtime) =>
				o.emp_no === emp_no && o.type_name === overtime_type
		);
		if (overtime === undefined) {
			console.log("No overtiem [%s] data found", overtime_type);
			return 0;
		}
		const work_type = employee_data?.work_type;
		const work_status = employee_data?.work_status;
		const base_salary = employee_payment?.base_salary ?? 0;
		const t1 = overtime?.hours_134 ?? 0;
		const t2 = overtime?.hours_167 ?? 0;
		const t3 = overtime?.hours_2 ?? 0;
		const t4 = overtime?.hours_267 ?? 0;

		function isForeign() {
			return work_status === "外籍勞工";
		}

		const r1 = isForeign() ? 1 : 1.34;
		const r2 = isForeign() ? 1 : 1.67;
		const r3 = isForeign() ? 1 : 2;
		const r4 = isForeign() ? 1 : 2.67;

		const SALARY_RATE = 1; // 不知道有沒有存
		const salary_rate =
			work_type === "外籍勞工"
				? SALARY_RATE
				: work_status === "離職人員"
					? 0
					: work_status === "日薪"
						? base_salary / 8
						: base_salary / 240;

		const salary = Math.round(
			salary_rate * (t1 * r1 + t2 * r2 + t3 * r3 + t4 * r4)
		);

		return salary;
	}
	//MARK: 應發底薪
	async getGrossSalary(
		employee_payment: EmployeePayment,
		pay_set: Payset
	): Promise<number> {
		const gross_salary = (
			employee_payment.base_salary
			+ employee_payment.food_bonus
			+ employee_payment.supervisor_comp
			+ employee_payment.professional_cert_comp
			+ employee_payment.job_comp
			+ employee_payment.subsidy_comp
		) * (pay_set.work_day! / 30)
		return gross_salary;
	}
	//MARK: 勞保扣除額
	async getInsuranceDeduction(): Promise<number> {
	}

	//MARK:福利金提撥
	async getWelfareDeduction(): Promise<number> {
		const welfare_deduction = 0
		return welfare_deduction
	}
	// 請假扣款
	async getLeaveDeduction(
		emp_no: string,
		period_id: number
	): Promise<number> {
		// get [Period] by id
		const period: Period = await container
			.resolve(EHRService)
			.getPeriodById(period_id);
		const period_start = period.start_date;
		const period_end = period.end_date ?? new Date();
		// get employee data (data and payment)
		const employee_data = await EmployeeData.findOne({
			where: {
				emp_no: emp_no,
			},
		});
		const employee_payment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: period_end,
				},
				end_date: {
					[Op.or]: [{ [Op.eq]: null }, { [Op.gte]: period_end }],
				},
			},
		});
		// get leave time
		const leavetime = (
			await container.resolve(EHRService).getHoliday(period_id)
		).find((o: Overtime) => o.emp_no === emp_no);
		if (leavetime === undefined) {
			console.log("No leavetime data of [%s] found", emp_no);
			return 0;
		}
		const work_type = employee_data?.work_type;
		const work_status = employee_data?.work_status;
		const base_salary = employee_payment?.base_salary ?? 0;
		/* bonus
			不知道bonus是啥
		*/
		const bonus = 0;

		const t1 = leavetime.compensatory_134 ?? 0;
		const t2 = leavetime.compensatory_167 ?? 0;
		const t3 = leavetime.compensatory_2 ?? 0;
		const t4 = leavetime.compensatory_267 ?? 0;

		function isForeign() {
			return work_status === "外籍勞工" || work_type === "外籍勞工";
		}

		const r1 = isForeign() ? 1 : 1.34;
		const r2 = isForeign() ? 1 : 1.67;
		const r3 = isForeign() ? 1 : 2;
		const r4 = isForeign() ? 1 : 2.67;

		console.log(emp_no);
		console.log(base_salary);
		console.log(work_type);
		console.log(work_status);
		console.log("%f, %f, %f, %f", t1, t2, t3, t4);

		const SALARY_RATE = 1; // 不知道有沒有存最低工資率

		if (isForeign()) {
			return Math.round(SALARY_RATE * t1 + (SALARY_RATE / 2) * t2);
		} else if (work_status === "離職人員") {
			return 0;
		} else {
			return Math.round(
				((base_salary + bonus) / 240) * t1 +
				(((base_salary + bonus) / 240) * t2) / 2
			);
		}
	}
	//MARK: 應發底薪
	async getGrossSalary(): Promise<number> {
	}
	//MARK: 勞保扣除額
	async getLaborInsuranceDeduction(
		employee_data: EmployeeData,
		employee_payment: EmployeePayment,
		payset: Payset,
		insuranceRateSetting: InsuranceRateSetting
	): Promise<number> {
		// rd("勞保扣除額") = CalacWorkTex(rd("勞保"), CheckNull(rd("工作天數"), 30), CheckNull(rd("勞保天數"), 30), rd("工作類別"), rd("工作形態"), CheckNull(rd("殘障等級"), "正常"), CheckNull(rd("勞保追加"), 30), rd("已領老年給付")) 'Jerry 07/03/30 加入殘障等級計算, 07/11/26 增加勞保追加計算,10/04/26增加"已領老年給付"判斷
		// Tax: rd("勞保")
		// Normalday: CheckNull(rd("工作天數"), 30)
		// PartTimeDay: CheckNull(rd("勞保天數"), 30)
		// kind1: rd("工作類別")
		// kind2: rd("工作形態")
		// hinder: CheckNull(rd("殘障等級"), "正常")
		// Work_type: rd("已領老年給付")

		const wci_normal = insuranceRateSetting.l_i_accident_rate;		// 勞工保險普通事故險
		const wci_ji = insuranceRateSetting.l_i_employment_premium_rate; // 勞工保險就業保險率

		const hinderDict: { [key: string]: number } = {
			"正常": 1,
			"輕度": 0.75,
			"中度": 0.5,
			"重度": 0
		};		

		const FOREIGN = "外籍勞工";
		const PROFESSOR = "顧問";
		const BOSS = "總經理";
		const DAY_PAY = "日薪制";
		const NEWBIE = "當月新進人員";
		const WILL_LEAVE = "當月離職人員_破月";
		const PARTTIME1 = "工讀生";
		const PARTTIME2 = "建教生";
		const CONTRACT = "約聘人員";

		const Tax = employee_payment.l_i;
		const Normalday = payset.work_day ?? 30;
		const PartTimeDay = payset.li_day ?? 30;
		const kind1 = employee_data.work_type;
		const kind2 = employee_data.work_status;
		const hinder_rate = hinderDict[employee_data.accessible ?? "正常"] ?? 1;		// 假設accessible是殘障等級
		const old_age_benefit = (true || false);		// old_age_benefit: rd("已領老年給付")


		if (old_age_benefit)	return 0;	// 'Jerry 100426 已領老年給付者,員工免付勞保
		

		if (kind1 == FOREIGN || kind2 == FOREIGN) return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30)) * hinder_rate;   // 'Jerry 2023/04/06 由工作天數改為加勞保天數計算
		if (kind2 == PROFESSOR) return 0;
		if (kind2 == BOSS)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30)) * hinder_rate;	//   'Jerry 10/04/26 由工作天數改為加勞保天數計算
		if (kind2 == DAY_PAY)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30) + Math.round(Tax * wci_ji * 0.200001 * PartTimeDay / 30)) * hinder_rate;
		if (kind2 == NEWBIE || kind2 == WILL_LEAVE || kind2 == PARTTIME1 || kind2 == PARTTIME2 || kind2 == CONTRACT)	return Math.round(Math.round(Tax * wci_normal * 0.200001 * PartTimeDay / 30, 0) + Math.round(Tax * wci_ji * 0.200001 * PartTimeDay / 30)) * hinder_rate;		// 'Jerry 07/07/19 由工作天數改為加勞保天數計算
		
		return Math.round(Math.round(Tax * wci_normal * 0.200001) + Math.round(Tax * wci_ji * 0.200001)) * hinder_rate
	}
	//MARK: 健保扣除額
	async getHealthInsuranceDeduction(
		insurance_rate_setting: InsuranceRateSetting,
	): Promise<number> {
		// rd("健保扣除額") = CalacHelTax(rd("健保"), rd("健保眷口數"), rd("工作形態"), CheckNull(rd("殘障等級"), "正常"), 0, rd("健保追加"))   'Jerry 07/03/30 加入殘障等級計算  , 07/11/26 增加健保追加計算
		let Tax : number = rd("健保");
		let Peop : number = rd("健保眷口數");
		let kind : string = rd("工作形態");
		const hinder : string = CheckNull(rd("殘障等級"), 0);
		let exePep : number = 0;
		let HelAdd_YN : boolean = rd("健保追加");				
		
		if (Peop > 3) Peop = 3;

		let hinder_rate: number = 1;
		if (hinder == "正常") hinder_rate = 1;
		if (hinder == "輕度") hinder_rate = 0.75;
		if (hinder == "中度") hinder_rate = 0.5;
		if (hinder == "重度") hinder_rate = 0;

		const FOREIGN = "外籍勞工";
		const PROFESSOR = "顧問";
		const BOSS = "總經理";
		const DAY_PAY = "日薪制";
		const NEWBIE = "當月新進人員";
		const WILL_LEAVE = "當月離職人員_破月";
		const LEAVE_MAN = "離職人員";
		const PARTTIME1 = "工讀生";
		const PARTTIME2 = "建教生";
		const CONTRACT = "約聘人員";

		const nhi_rate = insurance_rate_setting.h_i_standard_rate;			// 健保一般保費費率 : 應該是這個

		if (HelAdd_YN) {
			if (kind === LEAVE_MAN || kind === PROFESSOR || kind === WILL_LEAVE) return 0;
			if (kind === BOSS) return ((Math.round(Math.round(Tax * nhi_rate) * (Peop + 1)) + Math.round(Math.round(Tax * nhi_rate) * exePep))) * hinder_rate * 2;
			return (Math.round(Math.round(Tax * nhi_rate * 0.3) * (Peop + 1)) + Math.round(Math.round(Tax * nhi_rate * 0.3) * exePep)) * hinder_rate * 2;
		}
		
		else {		// HelAdd_YN = False	=> 		不追加健保
			if (kind === LEAVE_MAN || kind === PROFESSOR || kind === WILL_LEAVE) return 0;
			if (kind === BOSS) return ((Math.round(Math.round(Tax * nhi_rate) * (Peop + 1)) + Math.round(Math.round(Tax * nhi_rate) * exePep))) * hinder_rate;
			return (Math.round(Tax * nhi_rate * 0.3) * (Peop + 1) + Math.round(Tax * nhi_rate * 0.3) * exePep) * hinder_rate;
		}

		return 0;
	}
	//MARK:福利金提撥
	async getWelfareDeduction(): Promise<number> {
		
	}
	//MARK: 平日加班費
	//MARK: 假日加班費
	//MARK: 請假扣款
	async getLeaveDeduction(): Promise<number> {
		
	}
	
	//MARK: 全勤獎金
	async getAttendanceBonus(): Promise<number> {
		
	}
	//MARK: 團保費代扣
	async getGroupInsuranceDeduction(): Promise<number> {
		
	}
	//MARK: 補發薪資
	async getReissueSalary(): Promise<number> {
		
	}
	//MARK: 年終獎金
	async getYearEndBonus(): Promise<number> {
		const end_of_year_bonus = 0; // to be checked
		return end_of_year_bonus;
	}
	//MARK: 薪資所得稅
	async getSalaryIncomeTax(): Promise<number> {
		const salary_income_tax = 0
		return salary_income_tax
	}
	//MARK: 獎金所得稅
	async getBonusTax(): Promise<number> {
		const bonus_tax = 0
		return bonus_tax
	}
	//MARK: 不休假代金
	async getUnpaidLeaveDeduction(): Promise<number> {
		const unpaid_leave_deduction = 0
		return unpaid_leave_deduction
	}
	//MARK: 薪資所得扣繳總額
	async getSalaryIncomeDeduction(): Promise<number> {
		const salary_income_deduction = 0
		return salary_income_deduction
	}
	//MARK: 課稅小計
	async getTaxSummary(): Promise<number> {
		const tax_summary = 0
		return tax_summary
	}
	//MARK: 非課稅小計
	async getNonTaxSummary(): Promise<number> {
		const non_tax_summary = 0
		return non_tax_summary
	}
	//MARK: 減項小計
	async getDeductionSummary(): Promise<number> {
		const deduction_summary = 0
		return deduction_summary
	}
	//MARK: 勞保費
	async getLaborInsurance(
		employee_payment: EmployeePayment,
	): Promise<number> {
		return employee_payment.l_i
	}
	//MARK: 健保費
	async getHealthInsurance(
		employee_payment: EmployeePayment,
	): Promise<number> {
		return employee_payment.h_i
	}
	//MARK: 團保費
	//MARK: 實發金額

	//MARK: 所得稅代扣
	//MARK: 勞退金自提
	//MARK: 薪資區隔
	//MARK: 薪資總額
	//MARK: 勞退金提撥
	//MARK:二代健保
	//MARK:員工信托提存金
	//MARK:特別信託獎勵金＿員工
	//MARK:公司獎勵金
	//MARK:特別信託獎勵金＿公司
	//MARK:團保費代扣＿升等
	//MARK:特別事假扣款
}



/*
if (!工作天數)
	工作天數 = 30
if (!勞保天數)
	勞保天數 = 30
if (!勞保追加)
	勞保追加 = 0
if (!健保追加)
	建保追加 = False
*/
