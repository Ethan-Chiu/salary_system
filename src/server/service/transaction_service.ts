import { injectable } from "tsyringe";
import { type z } from "zod";
import {

} from "../api/types/parameters_input_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";


@injectable()
export class TransactionService {
    async createTransaction({
      emp_no : string,
      period_id : number,     
    }) {
        // period_id,
        // issue_date, // 發薪日期
        // pay_type, // 發薪別
        // department, // 部門
        // employee_id, // 員工編號
        // name, // 姓名
        // job_category, // 工作類別
        // job_type, // 工作形態
        // position_level, // 職等
        // group_insurance_type, // 團保類別
        // gender, // 性別
        // number_of_dependents, // 扶養人數
        // number_of_insured_dependents, // 健保眷口數
        // start_date, // 到職日期
        // end_date, // 離職日期
        
        // // 勞工相關信息
        // labor_insurance, // 勞保
        // health_insurance, // 健保
        // labor_pension, // 勞退
        // occupational_injury, // 職災
        // paid_leave, // 特休
        // compensatory_leave, // 補休
        // paid_leave_time, // 特休時間
        // compensatory_leave_time, // 補休時間
        // monthly_paid_leave, // 當月特休
        // monthly_compensatory_leave, // 當月補休
        // monthly_paid_leave_time, // 當月特休時間
        // monthly_compensatory_leave_time, // 當月補休時間
        // managerial_allowance, // 主管津貼
        // professional_license_allowance, // 專業証照津貼
        // base_salary, // 底薪
        // meal_allowance, // 伙食津貼
        // gross_salary, // 應發底薪
        // labor_insurance_deduction, // 勞保扣除額
        // health_insurance_deduction, // 健保扣除額
        // welfare_fund_contribution, // 福利金提撥
        // allowance, // 補助津貼
        // weekday_overtime_pay, // 平日加班費
        // holiday_overtime_pay, // 假日加班費
        // leave_deduction, // 請假扣款
        // overtime_hours, // 超時加班
        // personal_leave, // 事假
        // sick_leave, // 病假
        // personal_leave_hours, // 事假時數
        // sick_leave_hours, // 病假時數
        // stock_loan, // 股票貸款
        // attendance_bonus, // 全勤獎金
        // fixed_deposit_amount, // 定存金額
        // vehicle_loan, // 車輛貸款
        // group_insurance_premium_deduction, // 團保費代扣
        // retroactive_salary, // 補發薪資
        // year_end_bonus, // 年終獎金
        // year_end_performance_bonus, // 年終考核獎金
        // operational_performance_bonus, // 營運考核獎金
        // project_bonus, // 專案獎金
        // other_deductions, // 其他減項
        // other_additions, // 其他加項
        // meal_deduction, // 伙食扣款
        // taxable_income, // 課稅所得
        // income_tax, // 薪資所得稅
        // bonus_tax, // 獎金所得稅
        // position_allowance, // 職務津貼
        // shift_allowance, // 輪班津貼
        // non_leave, // 不休假
        // non_leave_hours, // 不休假時數
        // non_leave_compensation, // 不休假代金
        // total_income_tax_withheld, // 薪資所得扣繳總額
        // taxable_subtotal, // 課稅小計
        // non_taxable_subtotal, // 非課稅小計
        // deduction_subtotal, // 減項小計
        // labor_insurance_premium, // 勞保費
        // salary_advance, // 工資墊償
        // health_insurance_premium, // 健保費
        // group_insurance_premium, // 團保費
        // net_salary, // 實發金額
        // work_days, // 工作天數
        // labor_insurance_days, // 勞保天數
        // health_insurance_days, // 健保天數
        // additional_labor_insurance, // 勞保追加
        // additional_health_insurance, // 健保追加
        // other_addition_tax, // 其他加項稅
        // other_deduction_tax, // 其他減項稅
        // income_tax_withheld, // 所得稅代扣
        // self_withdrawn_retirement_pension, // 勞退金自提
        // parking_fee, // 停車費
        // brokerage_fee, // 仲介費
        // salary_range, // 薪資區隔
        // total_salary, // 薪資總額
        // dragon_boat_festival_bonus, // 端午獎金
        // mid_autumn_festival_bonus, // 中秋獎金
        // overtime1_hours, // 加班1_時數
        // overtime2_hours, // 加班2_時數
        // overtime1_taxable_hours, // 加班稅1_時數
        // overtime2_taxable_hours, // 加班稅2_時數
        // holiday_overtime_hours, // 假日加班時數
        // half_holiday_overtime_hours, // 假日加班時數_半
        // rest_overtime1_hours, // 休加班1_時數
        // rest_overtime2_hours, // 休加班2_時數
        // rest_overtime3_hours, // 休加班3_時數
        // rest_overtime1_taxable_hours, // 休加班稅1_時數
        // rest_overtime2_taxable_hours, // 休加班稅2_時數
        // rest_overtime3_taxable_hours, // 休加班稅3_時數
        // national_overtime0_hours, // 國加班0_時數
        // national_overtime1_hours, // 國加班1_時數
        // national_overtime2_hours, // 國加班2_時數
        // national_overtime1_taxable_hours, // 國加班稅1_時數
        // national_overtime2_taxable_hours, // 國加班稅2_時數
        // example_overtime0_hours, // 例加班0_時數
        // example_holiday_overtime_hours, // 例假日加班_時數
        // example_holiday_overtime_taxable_hours, // 例假日加班稅_時數
        // identity_number, // 身份字號
        // account1, // 帳號1
        // account2, // 帳號2
        // foreign_currency_account, // 外幣帳號
        // bonus_ratio, // 獎金比率
        // printing, // 列印
        // annual_days_in_service, // 年度在職天數
        // labor_pension_contribution, // 勞退金提撥
        // old_system_labor_pension_contribution, // 勞退金提撥_舊制
        // seniority, // 年資
        // appraisal_rate, // 考核比率
        // appraisal_bonus, // 考核獎金
        // probation_period_complete, // 試用期滿
        // disability_level, // 殘障等級
        // retirement_income, // 退職所得
        // received_elderly_benefits, // 已領老年給付
        // second_generation_health_insurance, // 二代健保
        // non_leave_paid_leave_hours, // 不休假特休時數
        // non_leave_compensatory_leave1_hours, // 不休假補休1時數
        // non_leave_compensatory_leave2_hours, // 不休假補休2時數
        // non_leave_compensatory_leave3_hours, // 不休假補休3時數
        // non_leave_compensatory_leave4_hours, // 不休假補休4時數
        // non_leave_compensatory_leave5_hours, // 不休假補休5時數
        // stock_trust_yn, // 持股信託_YN
        // employee_trust_deposit, // 員工信託提存金
        // special_trust_incentive_employee, // 特別信託獎勵金_員工
        // company_incentive, // 公司獎勵金
        // special_trust_incentive_company, // 特別信託獎勵金_公司
        // group_insurance_premium_deduction_promotion, // 團保費代扣_升等
        // special_leave_deduction, // 特別事假扣款
        // special_leave, // 特別事假
        // full_attendance_special_leave, // 有全勤事假
        // full_attendance_sick_leave, // 有全勤病假     
}