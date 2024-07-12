import { BaseResponseError } from "../error/BaseResponseError";
import { CalculateService } from "~/server/service/calculate_service";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { AttendanceSettingService } from "~/server/service/attendance_setting_service";
import { EHRService } from "~/server/service/ehr_service";
import { InsuranceRateSettingService } from "~/server/service/insurance_rate_setting_service";
import { HolidaysTypeService } from "~/server/service/holidays_type_service";

export const calculateRouter = createTRPCRouter({
	// API for 平日加班費
	calculateWeekdayOvertimePay: publicProcedure
		.input(
			z.object({
				emp_no: z.coerce.string(),
				period_id: z.coerce.number(),
			})
		)
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNo(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const overtime_list = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				[input.emp_no]
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			)[0];
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const calculateService = container.resolve(CalculateService);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const weekday_overtime_pay: number =
				await calculateService.getWeekdayOvertimePay(
					employee_data!,
					employee_payment!,
					overtime_list!,
					payset!,
					insurance_rate_setting!,
					full_attendance_bonus
				);
			if (weekday_overtime_pay == null) {
				throw new BaseResponseError(
					"Cannot calculate weekday overtime payment"
				);
			}
			return weekday_overtime_pay;
		}),

	// API for 假日加班費
	calculateHolidayOvertimePay: publicProcedure
		.input(
			z.object({
				emp_no: z.coerce.string(),
				period_id: z.coerce.number(),
			})
		)
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNo(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const overtime_list = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				[input.emp_no]
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			)[0];
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const calculateService = container.resolve(CalculateService);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const holiday_overtime_pay: number =
				await calculateService.getHolidayOvertimePay(
					employee_data!,
					employee_payment!,
					overtime_list!,
					payset!,
					insurance_rate_setting!,
					full_attendance_bonus
				);
			if (holiday_overtime_pay == null) {
				throw new BaseResponseError(
					"Cannot calculate holiday overtime payment"
				);
			}
			return holiday_overtime_pay;
		}),
	// API for 超時加班
		calculateExceedOvertimePay: publicProcedure
		.input(
			z.object({
				emp_no: z.coerce.string(),
				period_id: z.coerce.number(),
			})
		)
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNo(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const overtime_list = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				[input.emp_no]
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			)[0];
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const calculateService = container.resolve(CalculateService);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const exceed_overtime_pay: number =
				await calculateService.getExceedOvertimePay(
					employee_data!,
					employee_payment!,
					overtime_list!,
					payset!,
					insurance_rate_setting!,
					full_attendance_bonus
				);
			if (exceed_overtime_pay == null) {
				throw new BaseResponseError(
					"Cannot calculate holiday overtime payment"
				);
			}
			return exceed_overtime_pay;
		}),
	//API for 應發底薪

	// API for 請假扣款
	calculateLeaveDeduction: publicProcedure
		.input(
			z.object({
				emp_no: z.coerce.string(),
				period_id: z.coerce.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const attendanceSettingService = container.resolve(
				AttendanceSettingService
			);
			const insuranceRateSettingService = container.resolve(
				InsuranceRateSettingService
			);
			const ehrService = container.resolve(EHRService);
			const holidaysTypeService = container.resolve(HolidaysTypeService);
			const employee_data =
				await employeeDataService.getEmployeeDataByEmpNo(input.emp_no);
			const employee_payment =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
					input.emp_no,
					input.period_id
				);
			const holiday_list = await ehrService.getHolidayByEmpNoList(
				input.period_id,
				[input.emp_no]
			);
			const payset = (
				await ehrService.getPaysetByEmpNoList(input.period_id, [
					input.emp_no,
				])
			)[0];
			const holidays_type = await holidaysTypeService.getCurrentHolidaysType();
			const insurance_rate_setting =
				await insuranceRateSettingService.getCurrentInsuranceRateSetting(
					input.period_id
				);
			const full_attendance_bonus: number =
				await calculateService.getFullAttendanceBonus(
					input.period_id,
					input.emp_no
				);
			const leave_deduction: number =
				await calculateService.getLeaveDeduction(
					employee_data!,
					employee_payment!,
					holiday_list!,
					payset!,
					holidays_type,
					insurance_rate_setting!,
					full_attendance_bonus,

				);
			if (leave_deduction == null) {
				throw new BaseResponseError("Cannot calculate leave deduction");
			}
			return leave_deduction;
		}),
});
