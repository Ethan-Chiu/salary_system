import { z } from "zod";
import { container } from "tsyringe";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { get_date_string } from "~/server/service/helper_function";
import {
	createAttendanceSettingAPI,
	createBankSettingAPI,
	createBonusDepartmentAPI,
	createBonusPositionAPI,
	createBonusPositionTypeAPI,
	createBonusSeniorityAPI,
	createBonusSettingAPI,
	createInsuranceRateSettingAPI,
	updateAttendanceSettingAPI,
	updateBankSettingAPI,
	updateBonusDepartmentAPI,
	updateBonusPositionAPI,
	updateBonusPositionTypeAPI,
	updateBonusSeniorityAPI,
	updateBonusSettingAPI,
	updateInsuranceRateSettingAPI,
} from "../input_type/parameters_input";
import { BankSettingService } from "~/server/service/bank_setting_service";
import { AttendanceSettingService } from "~/server/service/attendance_setting_service";
import { BaseResponseError } from "../error/BaseResponseError";
import { BonusDepartmentService } from "~/server/service/bonus_department_service";
import { BonusPositionService } from "~/server/service/bonus_position_service";
import { BonusSeniorityService } from "~/server/service/bonus_seniority_service";
import { BonusSettingService } from "~/server/service/bonus_setting_service";
import { InsuranceRateSettingService } from "~/server/service/insurance_rate_setting_service";
import { BonusPositionTypeService } from "~/server/service/bonus_position_type_service";

export const parametersRouter = createTRPCRouter({
	createBankSetting: publicProcedure
		.input(createBankSettingAPI)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			let newdata = await bankService.createBankSetting({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
			return newdata;
		}),

	getCurrentBankSetting: publicProcedure.query(async () => {
		const bankService = container.resolve(BankSettingService);
		let bankSetting = await bankService.getCurrentBankSetting();
		if (bankSetting.length == 0) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		return bankSetting;
	}),

	getAllBankSetting: publicProcedure.query(async () => {
		const bankService = container.resolve(BankSettingService);
		let bankSetting = await bankService.getAllBankSetting();
		if (bankSetting.length == 0) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		return bankSetting;
	}),

	updateBankSetting: publicProcedure
		.input(updateBankSettingAPI)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			let newdata = await bankService.updateBankSetting({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
			return newdata;
		}),

	deleteBankSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bankService = container.resolve(BankSettingService);
			await bankService.deleteBankSetting(input.id);
		}),

	getCurrentAttendanceSetting: publicProcedure.query(async () => {
		const attendanceService = container.resolve(AttendanceSettingService);
		let attendanceSetting =
			await attendanceService.getCurrentAttendanceSetting();
		if (attendanceSetting == null) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}
		return attendanceSetting;
	}),

	getAllAttendanceSetting: publicProcedure.query(async () => {
		const attendanceService = container.resolve(AttendanceSettingService);
		let attendanceSetting =
			await attendanceService.getAllAttendanceSetting();
		if (attendanceSetting.length == 0) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}
		return attendanceSetting;
	}),

	createAttendanceSetting: publicProcedure
		.input(createAttendanceSettingAPI)
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			let newdata = await attendanceService.createAttendanceSetting({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
			await attendanceService.rescheduleAttendanceSetting();
			return newdata;
		}),

	updateAttendanceSetting: publicProcedure
		.input(updateAttendanceSettingAPI)
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			await attendanceService.updateAttendanceSetting({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
			await attendanceService.rescheduleAttendanceSetting();
		}),

	deleteAttendanceSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			await attendanceService.deleteAttendanceSetting(input.id);
			await attendanceService.rescheduleAttendanceSetting();
		}),

	getCurrentInsuranceRateSetting: publicProcedure.query(async () => {
		const insuranceRateService = container.resolve(
			InsuranceRateSettingService
		);
		let insuranceRateSetting =
			await insuranceRateService.getCurrentInsuranceRateSetting();
		if (insuranceRateSetting == null) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}
		return insuranceRateSetting;
	}),

	getAllInsuranceRateSetting: publicProcedure.query(async () => {
		const insuranceRateService = container.resolve(
			InsuranceRateSettingService
		);
		let insuranceRateSetting =
			await insuranceRateService.getAllInsuranceRateSetting();
		if (insuranceRateSetting.length == 0) {
			throw new BaseResponseError("InsuranceRateSetting does not exist");
		}
		return insuranceRateSetting;
	}),

	createInsuranceRateSetting: publicProcedure
		.input(createInsuranceRateSettingAPI)
		.mutation(async ({ input }) => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			let newdata = await insuranceRateService.createInsuranceRateSetting(
				{
					...input,
					start_date: input.start_date
						? get_date_string(input.start_date)
						: null,
					end_date: input.end_date
						? get_date_string(input.end_date)
						: null,
				}
			);
			await insuranceRateService.rescheduleInsuranceRateSetting();
			return newdata;
		}),

	updateInsuranceRateSetting: publicProcedure
		.input(updateInsuranceRateSettingAPI)
		.mutation(async ({ input }) => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			await insuranceRateService.updateInsuranceRateSetting({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
			await insuranceRateService.rescheduleInsuranceRateSetting();
		}),

	deleteInsuranceRateSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const insuranceRateService = container.resolve(
				InsuranceRateSettingService
			);
			await insuranceRateService.deleteInsuranceRateSetting(input.id);
			await insuranceRateService.rescheduleInsuranceRateSetting();
		}),

	createBonusDepartment: publicProcedure
		.input(createBonusDepartmentAPI)
		.mutation(async ({ input }) => {
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			let bonusDepartment =
				await bonusDepartmentService.getCurrentBonusDepartment();
			if (bonusDepartment == null) {
				throw new BaseResponseError("BonusDepartment does not exist");
			}
			return bonusDepartment;
		}),

	getAllBonusDepartment: publicProcedure.query(async () => {
		const bonusDepartmentService = container.resolve(
			BonusDepartmentService
		);
		let bonusDepartment =
			await bonusDepartmentService.getAllBonusDepartment();
		if (bonusDepartment == null) {
			throw new BaseResponseError("BonusDepartment does not exist");
		}
		return bonusDepartment;
	}),

	updateBonusDepartment: publicProcedure
		.input(updateBonusDepartmentAPI)
		.mutation(async ({ input }) => {
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			let newdata = await bonusDepartmentService.updateBonusDepartment(
				input
			);
			return newdata;
		}),

	deleteBonusDepartment: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bonusDepartmentService = container.resolve(
				BonusDepartmentService
			);
			await bonusDepartmentService.deleteBonusDepartment(input.id);
		}),

	createBonusPosition: publicProcedure
		.input(createBonusPositionAPI)
		.mutation(async ({ input }) => {
			const bonusPositionService =
				container.resolve(BonusPositionService);
			let newdata = await bonusPositionService.createBonusPosition(input);
			return newdata;
		}),

	getCurrentBonusPosition: publicProcedure.query(async () => {
		const bonusPositionService = container.resolve(BonusPositionService);
		let bonusPosition =
			await bonusPositionService.getCurrentBonusPosition();
		if (bonusPosition == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}
		return bonusPosition;
	}),

	getAllBonusPosition: publicProcedure.query(async () => {
		const bonusPositionService = container.resolve(BonusPositionService);
		let bonusPosition = await bonusPositionService.getAllBonusPosition();
		if (bonusPosition == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}
		return bonusPosition;
	}),

	updateBonusPosition: publicProcedure
		.input(updateBonusPositionAPI)
		.mutation(async ({ input }) => {
			const bonusPositionService =
				container.resolve(BonusPositionService);
			let newdata = await bonusPositionService.updateBonusPosition(input);
			return newdata;
		}),

	deleteBonusPosition: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bonusPositionService =
				container.resolve(BonusPositionService);
			await bonusPositionService.deleteBonusPosition(input.id);
		}),

	createBonusPositionType: publicProcedure
		.input(createBonusPositionTypeAPI)
		.mutation(async ({ input }) => {
			const bonusPositionTypeService = container.resolve(
				BonusPositionTypeService
			);
			let newdata =
				await bonusPositionTypeService.createBonusPositionType(input);
			return newdata;
		}),

	getCurrentBonusPositioType: publicProcedure.query(async () => {
		const bonusPositionTypeService = container.resolve(
			BonusPositionTypeService
		);
		let bonusPositionType =
			await bonusPositionTypeService.getCurrentBonusPositionType();
		if (bonusPositionType == null) {
			throw new BaseResponseError("BonusPositionType does not exist");
		}
		return bonusPositionType;
	}),

	getAllBonusPositionType: publicProcedure.query(async () => {
		const bonusPositionTypeService = container.resolve(
			BonusPositionTypeService
		);
		let bonusPositionType =
			await bonusPositionTypeService.getAllBonusPositionType();
		if (bonusPositionType == null) {
			throw new BaseResponseError("BonusPositionType does not exist");
		}
		return bonusPositionType;
	}),

	updateBonusPositionType: publicProcedure
		.input(updateBonusPositionTypeAPI)
		.mutation(async ({ input }) => {
			const bonusPositionTypeService = container.resolve(
				BonusPositionTypeService
			);
			let newdata =
				await bonusPositionTypeService.updateBonusPositionType(input);
			return newdata;
		}),

	deleteBonusPositionType: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bonusPositionTypeService = container.resolve(
				BonusPositionTypeService
			);
			await bonusPositionTypeService.deleteBonusPositionType(input.id);
		}),

	createBonusSeniority: publicProcedure
		.input(createBonusSeniorityAPI)
		.mutation(async ({ input }) => {
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			let newdata = await bonusSeniorityService.createBonusSeniority(
				input
			);
			return newdata;
		}),

	getCurrentBonusSeniority: publicProcedure.query(async () => {
		const bonusSeniorityService = container.resolve(BonusSeniorityService);
		let bonusSeniority =
			await bonusSeniorityService.getCurrentBonusSeniority();
		if (bonusSeniority == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}
		return bonusSeniority;
	}),

	getAllBonusSeniority: publicProcedure.query(async () => {
		const bonusSeniorityService = container.resolve(BonusSeniorityService);
		let bonusSeniority = await bonusSeniorityService.getAllBonusSeniority();
		if (bonusSeniority == null) {
			throw new BaseResponseError("BonusSeniority does not exist");
		}
		return bonusSeniority;
	}),

	updateBonusSeniority: publicProcedure
		.input(updateBonusSeniorityAPI)
		.mutation(async ({ input }) => {
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			let newdata = await bonusSeniorityService.updateBonusSeniority(
				input
			);
			return newdata;
		}),

	deleteBonusSeniority: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bonusSeniorityService = container.resolve(
				BonusSeniorityService
			);
			await bonusSeniorityService.deleteBonusSeniority(input.id);
		}),

	createBonusSetting: publicProcedure
		.input(createBonusSettingAPI)
		.mutation(async ({ input }) => {
			const bonusSettingService = container.resolve(BonusSettingService);
			let newdata = await bonusSettingService.createBonusSetting(input);
			return newdata;
		}),

	getCurrentBonusSetting: publicProcedure.query(async () => {
		const bonusSettingService = container.resolve(BonusSettingService);
		let bonusSetting = await bonusSettingService.getCurrentBonusSetting();
		if (bonusSetting == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}
		return bonusSetting;
	}),

	getAllBonusSetting: publicProcedure.query(async () => {
		const bonusSettingService = container.resolve(BonusSettingService);
		let bonusSetting = await bonusSettingService.getAllBonusSetting();
		if (bonusSetting == null) {
			throw new BaseResponseError("BonusSeniority does not exist");
		}
		return bonusSetting;
	}),

	updateBonusSetting: publicProcedure
		.input(updateBonusSettingAPI)
		.mutation(async ({ input }) => {
			const bonusSettingService = container.resolve(BonusSettingService);
			let newdata = await bonusSettingService.updateBonusSetting(input);
			return newdata;
		}),

	deleteBonusSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bonusSettingService = container.resolve(BonusSettingService);
			await bonusSettingService.deleteBonusSetting(input.id);
		}),
});
