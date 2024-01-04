import * as bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { AttendanceSettingService } from "./attendance_setting_service";
import { InsuranceRateSettingService } from "./insurance_rate_setting_service";
import { EHRService } from "./ehr_service";
import { EmployeePaymentService } from "./employee_payment_service";
import { EmployeeDataService } from "./employee_data_service";

@injectable()
export class CalculateService {
	constructor(
        private ehrService: EHRService,
        private attendanceSettingService: AttendanceSettingService,
        private insuranceRateSettingService: InsuranceRateSettingService,
        private employeePaymentService: EmployeePaymentService,
        private employeeDataService: EmployeeDataService,
    ) {}

    // 平日加班費
    async calcNormalMoney(
        emp_no: string,
        period_id: number
        // kind1: string,  // 工作類別
        // kind2: string,  // 工作型態
        // money: number,  // 底薪
        // t1: number,     // 加班時間1
        // t2: number      // 加班時間2
    ): Promise<number> {

        const FOREIGNER = "外籍勞工", LEAVE_MAN = "離職人員", DAY_PAY = "日薪制"

        const ehr_datas = await this.ehrService.getOvertime(period_id);
        const att_setting = await this.attendanceSettingService.getCurrentAttendanceSetting();
        const ins_setting = await this.insuranceRateSettingService.getCurrentInsuranceRateSetting();
        const emp_payments = await this.employeePaymentService.getCurrentEmployeePayment();
        const emp_datas = await this.employeeDataService.getCurrentEmployeeData();
        if (ehr_datas === null) {throw new BaseResponseError("No EHR data");}
        if (att_setting === null) {throw new BaseResponseError("No attendance setting");}
        if (ins_setting === null) {throw new BaseResponseError("No insurance rate setting");}
        
        const ehr_data = ehr_datas.find((overtimeData) => (overtimeData.emp_no === emp_no))
        const emp_payment = emp_payments.find((data) => (data.emp_no === emp_no))
        const emp_data = emp_datas.find((data) => (data.emp_no === emp_no))

        const kind1 = emp_data?.work_type;
        const kind2 = emp_data?.work_status;
        
        
        const overtimes =
            Object.keys(ehr_data!).filter(key => key.includes("hours_")).map(
                (key: string) => {
                    return parseInt((key.split("_")[1] ?? "0"), 10)*((ehr_data as any)[key])
                }
            )

        const SALARY_RATE = ins_setting.min_wage_rate / 240;    // 薪資率 = 最低薪資/240    // 103年最低薪資 19273
        const ForeignRate1 = att_setting.overtime_by_foreign_workers_1;
        const ForeignRate2 = att_setting.overtime_by_foreign_workers_2;
        const ForeignRate3 = att_setting.overtime_by_foreign_workers_3;

        const money = emp_payment?.base_salary ?? 0;

        const rate = (kind1 === FOREIGNER || kind2 === FOREIGNER) ? SALARY_RATE :
                    (kind2 === LEAVE_MAN) ? 0 :
                    (kind2 === DAY_PAY) ? money/8 :
                    money/240;
        
        const normalMoney = rate * overtimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        
        return normalMoney;
    }


	async calcOvertimePay(
        overtime_1: number, 
        overtime_2: number, 
        is_foreign_worker: boolean, 
        is_leave:boolean, 
        is_day_pay: boolean): Promise<number> {
		
        const att_setting = await this.attendanceSettingService.getCurrentAttendanceSetting();
        if (att_setting === null) {
            throw new BaseResponseError("No attendance setting");
        }

        const money = 100; // dont know what this is

        if (is_leave) {
            return 0;
        }

        if (is_foreign_worker) {
            const pay = Math.round(att_setting.overtime_by_foreign_workers_1 * overtime_1 + att_setting.overtime_by_foreign_workers_2 * overtime_2);
            return pay;
        }

        if (is_day_pay) {
            const pay = Math.round(money / 8 * att_setting.overtime_by_foreign_workers_1 * overtime_1 + money / 8 * att_setting.overtime_by_foreign_workers_2 * overtime_2);
            return pay;
        }

        const pay = Math.round(money / 240 * att_setting.overtime_by_foreign_workers_1 * overtime_1 + money / 240 * att_setting.overtime_by_foreign_workers_2 * overtime_2);
        return pay;
	}

	
}
