import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class Transaction extends Model<
	InferAttributes<Transaction>,
	InferCreationAttributes<Transaction>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare issue_date: string; // 發新日期
	declare pay_type: string; // 發薪別
	declare department: string; // 部門
	declare employee_id: string; // 員工編號
	declare name: string; // 姓名
	declare job_category: string; // 工作類別
	declare job_type: string; // 工作形態
	declare position_level: string; // 職等
	declare group_insurance_type: string; // 團保類別
	declare gender: string; // 性別
	declare number_of_dependents: number; // 扶養人數
	declare number_of_insured_dependents: number; // 健保眷口數
	declare start_date: string; // 到職日期
	declare end_date: string | null; // 離職日期

	// 勞工相關信息
	declare labor_insurance: string; // 勞保
	declare health_insurance: string; // 健保
	declare labor_pension: string; // 勞退
	declare occupational_injury: string; // 職災
	declare paid_leave: string; // 特休
	declare compensatory_leave: string; // 補休
	declare paid_leave_time: number; // 特休時間
	declare compensatory_leave_time: number; // 補休時間
	declare monthly_paid_leave: string; // 當月特休
	declare monthly_compensatory_leave: string; // 當月補休
	declare monthly_paid_leave_time: number; // 當月特休時間
	declare monthly_compensatory_leave_time: number; // 當月補休時間
	declare managerial_allowance: number; // 主管津貼
	declare professional_license_allowance: number; // 專業証照津貼
	declare base_salary: number; // 底薪
	declare meal_allowance: number; // 伙食津貼
	declare gross_salary: number; // 應發底薪
	declare labor_insurance_deduction: number; // 勞保扣除額
	declare health_insurance_deduction: number; // 健保扣除額
	declare welfare_fund_contribution: number; // 福利金提撥
	declare allowance: number; // 補助津貼
	declare weekday_overtime_pay: number; // 平日加班費
	declare holiday_overtime_pay: number; // 假日加班費
	declare leave_deduction: number; // 請假扣款
	declare overtime_hours: number; // 超時加班
	declare night_shift_pay: number; // 夜點費
	declare personal_leave: number; // 事假
	declare sick_leave: number; // 病假
	declare personal_leave_hours: number; // 事假時數
	declare sick_leave_hours: number; // 病假時數
	declare stock_loan: number; // 股票貸款
	declare attendance_bonus: number; // 全勤獎金
	declare fixed_deposit_amount: number; // 定存金額
	declare vehicle_loan: number; // 車輛貸款
	declare group_insurance_premium_deduction: number; // 團保費代扣
	declare retroactive_salary: number; // 補發薪資
	declare year_end_bonus: number; // 年終獎金
	declare year_end_performance_bonus: number; // 年終考核獎金
	declare operational_performance_bonus: number; // 營運考核獎金
	declare project_bonus: number; // 專案獎金
	declare other_deductions: number; // 其他減項
	declare other_additions: number; // 其他加項
	declare meal_deduction: number; // 伙食扣款
	declare taxable_income: number; // 課稅所得
	declare income_tax: number; // 薪資所得稅
	declare bonus_tax: number; // 獎金所得稅
	declare position_allowance: number; // 職務津貼
	declare shift_allowance: number; // 輪班津貼
	declare non_leave: string; // 不休假
	declare non_leave_hours: number; // 不休假時數
	declare non_leave_compensation: number; // 不休假代金
	declare total_income_tax_withheld: number; // 薪資所得扣繳總額
	declare taxable_subtotal: number; // 課稅小計
	declare non_taxable_subtotal: number; // 非課說小計
	declare deduction_subtotal: number; // 減項小計
	declare labor_insurance_premium: number; // 勞保費
	declare salary_advance: number; // 工資墊償
	declare health_insurance_premium: number; // 健保費
	declare group_insurance_premium: number; // 團保費
	declare net_salary: number; // 實發金額
	declare work_days: number; // 工作天數
	declare labor_insurance_days: number; // 勞保天數
	declare health_insurance_days: number; // 健保天數
	declare additional_labor_insurance: number; // 勞保追加
	declare additional_health_insurance: number; // 健保追加
	declare other_addition_tax: number; // 其他加項稅
	declare other_deduction_tax: number; // 其他減項稅
	declare income_tax_withheld: number; // 所得稅代扣
	declare self_withdrawn_retirement_pension: number; // 勞退金自提
	declare parking_fee: number; // 停車費
	declare brokerage_fee: number; // 仲介費
	declare salary_range: string; // 薪資區隔
	declare total_salary: number; // 薪資總額
	declare dragon_boat_festival_bonus: number; // 端午獎金
	declare mid_autumn_festival_bonus: number; // 中秋獎金
	declare overtime1_hours: number; // 加班1_時數
	declare overtime2_hours: number; // 加班2_時數
	declare overtime1_taxable_hours: number; // 加班稅1_時數
	declare overtime2_taxable_hours: number; // 加班稅2_時數
	declare holiday_overtime_hours: number; // 假日加班時數
	declare half_holiday_overtime_hours: number; // 假日加班時數_半
	declare rest_overtime1_hours: number; // 休加班1_時數
	declare rest_overtime2_hours: number; // 休加班2_時數
	declare rest_overtime3_hours: number; // 休加班3_時數
	declare rest_overtime1_taxable_hours: number; // 休加班稅1_時數
	declare rest_overtime2_taxable_hours: number; // 休加班稅2_時數
	declare rest_overtime3_taxable_hours: number; // 休加班稅3_時數
	declare national_overtime0_hours: number; // 國加班0_時數
	declare national_overtime1_hours: number; // 國加班1_時數
	declare national_overtime2_hours: number; // 國加班2_時數
	declare national_overtime1_taxable_hours: number; // 國加班稅1_時數
	declare national_overtime2_taxable_hours: number; // 國加班稅2_時數
	declare example_overtime0_hours: number; // 例加班0_時數
	declare example_holiday_overtime_hours: number; // 例假日加班_時數
	declare example_holiday_overtime_taxable_hours: number; // 例假日加班稅_時數
	declare identity_number: string; // 身份字號
	declare account1: string; // 帳號1
	declare account2: string; // 帳號2
	declare foreign_currency_account: string; // 外幣帳號
	declare bonus_ratio: number; // 獎金比率
	declare printing: string; // 列印
	declare annual_days_in_service: number; // 年度在職天數
	declare labor_pension_contribution: number; // 勞退金提撥
	declare old_system_labor_pension_contribution: number; // 勞退金提撥_舊制
	declare seniority: number; // 年資
	declare appraisal_rate: number; // 考核比率
	declare appraisal_bonus: number; // 考核獎金
	declare probation_period_complete: string; // 試用期滿
	declare disability_level: string; // 殘障等級
	declare retirement_income: number; // 退職所得
	declare received_elderly_benefits: string; // 已領老年給付
	declare second_generation_health_insurance: string; // 二代健保
	declare non_leave_paid_leave_hours: number; // 不休假特休時數
	declare non_leave_compensatory_leave1_hours: number; // 不休假補休1時數
	declare non_leave_compensatory_leave2_hours: number; // 不休假補休2時數
	declare non_leave_compensatory_leave3_hours: number; // 不休假補休3時數
	declare non_leave_compensatory_leave4_hours: number; // 不休假補休4時數
	declare non_leave_compensatory_leave5_hours: number; // 不休假補休5時數
	declare stock_trust_yn: string; // 持股信託_YN
	declare employee_trust_deposit: number; // 員工信託提存金
	declare special_trust_incentive_employee: number; // 特別信託獎勵金_員工
	declare company_incentive: number; // 公司獎勵金
	declare special_trust_incentive_company: number; // 特別信託獎勵金_公司
	declare group_insurance_premium_deduction_promotion: number; // 團保費代扣_升等
	declare special_leave_deduction: number; // 特別事假扣款
	declare special_leave: number; // 特別事假
	declare full_attendance_special_leave: number; // 有全勤事假
	declare full_attendance_sick_leave: number; // 有全勤病假
	declare create_date: CreationOptional<Date>; // 建立日期
	declare create_by: string; // 建立者
	declare update_date: CreationOptional<Date>; // 更新日期
	declare update_by: string; // 更新者
}

const sequelize = container.resolve(Database).connection;

Transaction.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		period_id: {
			type: DataTypes.STRING(128),
			comment: "期間",
		},
		issue_date: {
			type: DataTypes.STRING(128),
			comment: "發新日期",
		},
		pay_type: {
			type: DataTypes.STRING(128),
			comment: "發薪別",
		},
		department: {
			type: DataTypes.STRING(128),
			comment: "部門",
		},
		employee_id: {
			type: DataTypes.STRING(128),
			comment: "員工編號",
		},
		name: {
			type: DataTypes.STRING(128),
			comment: "姓名",
		},
		job_category: {
			type: DataTypes.STRING(128),
			comment: "工作類別",
		},
		job_type: {
			type: DataTypes.STRING(128),
			comment: "工作形態",
		},
		position_level: {
			type: DataTypes.STRING(128),
			comment: "職等",
		},
		group_insurance_type: {
			type: DataTypes.STRING(128),
			comment: "團保類別",
		},
		gender: {
			type: DataTypes.STRING(128),
			comment: "性別",
		},
		number_of_dependents: {
			type: DataTypes.INTEGER,
			comment: "扶養人數",
		},
		number_of_insured_dependents: {
			type: DataTypes.INTEGER,
			comment: "健保眷口數",
		},
		start_date: {
			type: DataTypes.STRING(128),
			comment: "到職日期",
		},
		end_date: {
			type: DataTypes.STRING(128),
			allowNull: true,
			comment: "離職日期",
		},
		labor_insurance: {
			type: DataTypes.STRING(128),
			comment: "勞保",
		},
		health_insurance: {
			type: DataTypes.STRING(128),
			comment: "健保",
		},
		labor_pension: {
			type: DataTypes.STRING(128),
			comment: "勞退",
		},
		occupational_injury: {
			type: DataTypes.STRING(128),
			comment: "職災",
		},
		paid_leave: {
			type: DataTypes.STRING(128),
			comment: "特休",
		},
		compensatory_leave: {
			type: DataTypes.STRING(128),
			comment: "補休",
		},
		paid_leave_time: {
			type: DataTypes.INTEGER,
			comment: "特休時間",
		},
		compensatory_leave_time: {
			type: DataTypes.INTEGER,
			comment: "補休時間",
		},
		monthly_paid_leave: {
			type: DataTypes.STRING(128),
			comment: "當月特休",
		},
		monthly_compensatory_leave: {
			type: DataTypes.STRING(128),
			comment: "當月補休",
		},
		monthly_paid_leave_time: {
			type: DataTypes.INTEGER,
			comment: "當月特休時間",
		},
		monthly_compensatory_leave_time: {
			type: DataTypes.INTEGER,
			comment: "當月補休時間",
		},
		managerial_allowance: {
			type: DataTypes.INTEGER,
			comment: "主管津貼",
		},
		professional_license_allowance: {
			type: DataTypes.INTEGER,
			comment: "專業証照津貼",
		},
		base_salary: {
			type: DataTypes.INTEGER,
			comment: "底薪",
		},
		meal_allowance: {
			type: DataTypes.INTEGER,
			comment: "伙食津貼",
		},
		gross_salary: {
			type: DataTypes.INTEGER,
			comment: "應發底薪",
		},
		labor_insurance_deduction: {
			type: DataTypes.INTEGER,
			comment: "勞保扣除額",
		},
		health_insurance_deduction: {
			type: DataTypes.INTEGER,
			comment: "健保扣除額",
		},
		welfare_fund_contribution: {
			type: DataTypes.INTEGER,
			comment: "福利金提撥",
		},
		allowance: {
			type: DataTypes.INTEGER,
			comment: "補助津貼",
		},
		weekday_overtime_pay: {
			type: DataTypes.INTEGER,
			comment: "平日加班費",
		},
		holiday_overtime_pay: {
			type: DataTypes.INTEGER,
			comment: "假日加班費",
		},
		leave_deduction: {
			type: DataTypes.INTEGER,
			comment: "請假扣款",
		},
		overtime_hours: {
			type: DataTypes.INTEGER,
			comment: "超時加班",
		},
		night_shift_pay: {
			type: DataTypes.INTEGER,
			comment: "夜點費",
		},
		personal_leave: {
			type: DataTypes.INTEGER,
			comment: "事假",
		},
		sick_leave: {
			type: DataTypes.INTEGER,
			comment: "病假",
		},
		personal_leave_hours: {
			type: DataTypes.INTEGER,
			comment: "事假時數",
		},
		sick_leave_hours: {
			type: DataTypes.INTEGER,
			comment: "病假時數",
		},
		stock_loan: {
			type: DataTypes.INTEGER,
			comment: "股票貸款",
		},
		attendance_bonus: {
			type: DataTypes.INTEGER,
			comment: "全勤獎金",
		},
		fixed_deposit_amount: {
			type: DataTypes.INTEGER,
			comment: "定存金額",
		},
		vehicle_loan: {
			type: DataTypes.INTEGER,
			comment: "車輛貸款",
		},
		group_insurance_premium_deduction: {
			type: DataTypes.INTEGER,
			comment: "團保費代扣",
		},
		retroactive_salary: {
			type: DataTypes.INTEGER,
			comment: "補發薪資",
		},
		year_end_bonus: {
			type: DataTypes.INTEGER,
			comment: "年終獎金",
		},
		year_end_performance_bonus: {
			type: DataTypes.INTEGER,
			comment: "年終考核獎金",
		},
		operational_performance_bonus: {
			type: DataTypes.INTEGER,
			comment: "營運考核獎金",
		},
		project_bonus: {
			type: DataTypes.INTEGER,
			comment: "專案獎金",
		},
		other_deductions: {
			type: DataTypes.INTEGER,
			comment: "其他減項",
		},
		other_additions: {
			type: DataTypes.INTEGER,
			comment: "其他加項",
		},
		meal_deduction: {
			type: DataTypes.INTEGER,
			comment: "伙食扣款",
		},
		taxable_income: {
			type: DataTypes.INTEGER,
			comment: "課稅所得",
		},
		income_tax: {
			type: DataTypes.INTEGER,
			comment: "薪資所得稅",
		},
		bonus_tax: {
			type: DataTypes.INTEGER,
			comment: "獎金所得稅",
		},
		position_allowance: {
			type: DataTypes.INTEGER,
			comment: "職務津貼",
		},
		shift_allowance: {
			type: DataTypes.INTEGER,
			comment: "輪班津貼",
		},
		non_leave: {
			type: DataTypes.STRING(128),
			comment: "不休假",
		},
		non_leave_hours: {
			type: DataTypes.INTEGER,
			comment: "不休假時數",
		},
		non_leave_compensation: {
			type: DataTypes.INTEGER,
			comment: "不休假代金",
		},
		total_income_tax_withheld: {
			type: DataTypes.INTEGER,
			comment: "薪資所得扣繳總額",
		},
		taxable_subtotal: {
			type: DataTypes.INTEGER,
			comment: "課稅小計",
		},
		non_taxable_subtotal: {
			type: DataTypes.INTEGER,
			comment: "非課說小計",
		},
		deduction_subtotal: {
			type: DataTypes.INTEGER,
			comment: "減項小計",
		},
		labor_insurance_premium: {
			type: DataTypes.INTEGER,
			comment: "勞保費",
		},
		salary_advance: {
			type: DataTypes.INTEGER,
			comment: "工資墊償",
		},
		health_insurance_premium: {
			type: DataTypes.INTEGER,
			comment: "健保費",
		},
		group_insurance_premium: {
			type: DataTypes.INTEGER,
			comment: "團保費",
		},
		net_salary: {
			type: DataTypes.INTEGER,
			comment: "實發金額",
		},
		work_days: {
			type: DataTypes.INTEGER,
			comment: "工作天數",
		},
		labor_insurance_days: {
			type: DataTypes.INTEGER,
			comment: "勞保天數",
		},
		health_insurance_days: {
			type: DataTypes.INTEGER,
			comment: "健保天數",
		},
		additional_labor_insurance: {
			type: DataTypes.INTEGER,
			comment: "勞保追加",
		},
		additional_health_insurance: {
			type: DataTypes.INTEGER,
			comment: "健保追加",
		},
		other_addition_tax: {
			type: DataTypes.INTEGER,
			comment: "其他加項稅",
		},
		other_deduction_tax: {
			type: DataTypes.INTEGER,
			comment: "其他減項稅",
		},
		income_tax_withheld: {
			type: DataTypes.INTEGER,
			comment: "所得稅代扣",
		},
		self_withdrawn_retirement_pension: {
			type: DataTypes.INTEGER,
			comment: "勞退金自提",
		},
		parking_fee: {
			type: DataTypes.INTEGER,
			comment: "停車費",
		},
		brokerage_fee: {
			type: DataTypes.INTEGER,
			comment: "仲介費",
		},
		salary_range: {
			type: DataTypes.STRING(128),
			comment: "薪資區隔",
		},
		total_salary: {
			type: DataTypes.INTEGER,
			comment: "薪資總額",
		},
		dragon_boat_festival_bonus: {
			type: DataTypes.INTEGER,
			comment: "端午獎金",
		},
		mid_autumn_festival_bonus: {
			type: DataTypes.INTEGER,
			comment: "中秋獎金",
		},
		overtime1_hours: {
			type: DataTypes.INTEGER,
			comment: "加班1_時數",
		},
		overtime2_hours: {
			type: DataTypes.INTEGER,
			comment: "加班2_時數",
		},
		overtime1_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "加班稅1_時數",
		},
		overtime2_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "加班稅2_時數",
		},
		holiday_overtime_hours: {
			type: DataTypes.INTEGER,
			comment: "假日加班時數",
		},
		half_holiday_overtime_hours: {
			type: DataTypes.INTEGER,
			comment: "假日加班時數_半",
		},
		rest_overtime1_hours: {
			type: DataTypes.INTEGER,
			comment: "休加班1_時數",
		},
		rest_overtime2_hours: {
			type: DataTypes.INTEGER,
			comment: "休加班2_時數",
		},
		rest_overtime3_hours: {
			type: DataTypes.INTEGER,
			comment: "休加班3_時數",
		},
		rest_overtime1_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "休加班稅1_時數",
		},
		rest_overtime2_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "休加班稅2_時數",
		},
		rest_overtime3_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "休加班稅3_時數",
		},
		national_overtime0_hours: {
			type: DataTypes.INTEGER,
			comment: "國加班0_時數",
		},
		national_overtime1_hours: {
			type: DataTypes.INTEGER,
			comment: "國加班1_時數",
		},
		national_overtime2_hours: {
			type: DataTypes.INTEGER,
			comment: "國加班2_時數",
		},
		national_overtime1_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "國加班稅1_時數",
		},
		national_overtime2_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "國加班稅2_時數",
		},
		example_overtime0_hours: {
			type: DataTypes.INTEGER,
			comment: "例加班0_時數",
		},
		example_holiday_overtime_hours: {
			type: DataTypes.INTEGER,
			comment: "例假日加班_時數",
		},
		example_holiday_overtime_taxable_hours: {
			type: DataTypes.INTEGER,
			comment: "例假日加班稅_時數",
		},
		identity_number: {
			type: DataTypes.STRING(128),
			comment: "身份字號",
		},
		account1: {
			type: DataTypes.STRING(128),
			comment: "帳號1",
		},
		account2: {
			type: DataTypes.STRING(128),
			comment: "帳號2",
		},
		foreign_currency_account: {
			type: DataTypes.STRING(128),
			comment: "外幣帳號",
		},
		bonus_ratio: {
			type: DataTypes.INTEGER,
			comment: "獎金比率",
		},
		printing: {
			type: DataTypes.STRING(128),
			comment: "列印",
		},
		annual_days_in_service: {
			type: DataTypes.INTEGER,
			comment: "年度在職天數",
		},
		labor_pension_contribution: {
			type: DataTypes.INTEGER,
			comment: "勞退金提撥",
		},
		old_system_labor_pension_contribution: {
			type: DataTypes.INTEGER,
			comment: "勞退金提撥_舊制",
		},
		seniority: {
			type: DataTypes.INTEGER,
			comment: "年資",
		},
		appraisal_rate: {
			type: DataTypes.INTEGER,
			comment: "考核比率",
		},
		appraisal_bonus: {
			type: DataTypes.INTEGER,
			comment: "考核獎金",
		},
		probation_period_complete: {
			type: DataTypes.STRING(128),
			comment: "試用期滿",
		},
		disability_level: {
			type: DataTypes.STRING(128),
			comment: "殘障等級",
		},
		retirement_income: {
			type: DataTypes.INTEGER,
			comment: "退職所得",
		},
		received_elderly_benefits: {
			type: DataTypes.STRING(128),
			comment: "已領老年給付",
		},
		second_generation_health_insurance: {
			type: DataTypes.STRING(128),
			comment: "二代健保",
		},
		non_leave_paid_leave_hours: {
			type: DataTypes.INTEGER,
			comment: "不休假特休時數",
		},
		non_leave_compensatory_leave1_hours: {
			type: DataTypes.INTEGER,
			comment: "不休假補休1時數",
		},
		non_leave_compensatory_leave2_hours: {
			type: DataTypes.INTEGER,
			comment: "不休假補休2時數",
		},
		non_leave_compensatory_leave3_hours: {
			type: DataTypes.INTEGER,
			comment: "不休假補休3時數",
		},
		non_leave_compensatory_leave4_hours: {
			type: DataTypes.INTEGER,
			comment: "不休假補休4時數",
		},
		non_leave_compensatory_leave5_hours: {
			type: DataTypes.INTEGER,
			comment: "不休假補休5時數",
		},
		stock_trust_yn: {
			type: DataTypes.STRING(128),
			comment: "持股信託_YN",
		},
		employee_trust_deposit: {
			type: DataTypes.INTEGER,
			comment: "員工信託提存金",
		},
		special_trust_incentive_employee: {
			type: DataTypes.INTEGER,
			comment: "特別信託獎勵金_員工",
		},
		company_incentive: {
			type: DataTypes.INTEGER,
			comment: "公司獎勵金",
		},
		special_trust_incentive_company: {
			type: DataTypes.INTEGER,
			comment: "特別信託獎勵金_公司",
		},
		group_insurance_premium_deduction_promotion: {
			type: DataTypes.INTEGER,
			comment: "團保費代扣_升等",
		},
		special_leave_deduction: {
			type: DataTypes.INTEGER,
			comment: "特別事假扣款",
		},
		special_leave: {
			type: DataTypes.INTEGER,
			comment: "特別事假",
		},
		full_attendance_special_leave: {
			type: DataTypes.INTEGER,
			comment: "有全勤事假",
		},
		full_attendance_sick_leave: {
			type: DataTypes.INTEGER,
			comment: "有全勤病假",
		},
		create_date: {
			type: DataTypes.DATE,
			comment: "建立日期",
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: true,
			comment: "建立者",
		},
		update_date: {
			type: DataTypes.DATE,
			comment: "修改日期",
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: true,
			comment: "修改者",
		},
	},
	{
		sequelize,
		tableName: "U_TRANSACTION",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
