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
	createLevelAPI,
	createLevelRangeAPI,
	createPerformanceLevelAPI,
	createTrustMoneyAPI,
	updateAttendanceSettingAPI,
	updateBankSettingAPI,
	updateBonusDepartmentAPI,
	updateBonusPositionAPI,
	updateBonusPositionTypeAPI,
	updateBonusSeniorityAPI,
	updateBonusSettingAPI,
	updateInsuranceRateSettingAPI,
	updateLevelAPI,
	updateLevelRangeAPI,
	updatePerformanceLevelAPI,
	updateTrustMoneyAPI,
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
import { LevelRangeService } from "~/server/service/level_range_service";
import { LevelService } from "~/server/service/level_service";
import { PerformanceLevelService } from "~/server/service/performance_level_service";
import { TrustMoneyService } from "~/server/service/trust_money_service";

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
			let newdata = await bonusDepartmentService.createBonusDepartment(
				input
			);
			return newdata;
		}),

	getCurrentBonusDepartment: publicProcedure.query(async () => {
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

	getCurrentBonusPositionType: publicProcedure.query(async () => {
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
			throw new BaseResponseError("BonusSeniority does not exist");
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
			throw new BaseResponseError("BonusSetting does not exist");
		}
		return bonusSetting;
	}),

	getAllBonusSetting: publicProcedure.query(async () => {
		const bonusSettingService = container.resolve(BonusSettingService);
		let bonusSetting = await bonusSettingService.getAllBonusSetting();
		if (bonusSetting == null) {
			throw new BaseResponseError("BonusSetting does not exist");
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

	createLevelRange: publicProcedure
		.input(createLevelRangeAPI)
		.mutation(async ({ input }) => {
			const levelRangeService = container.resolve(LevelRangeService);
			let newdata = await levelRangeService.createLevelRange(input);
			return newdata;
		}),

	getCurrentLevelRange: publicProcedure.query(async () => {
		const levelRangeService = container.resolve(LevelRangeService);
		let levelRange = await levelRangeService.getCurrentLevelRange();
		if (levelRange == null) {
			throw new BaseResponseError("LevelRange does not exist");
		}
		return levelRange;
	}),

	getAllLevelRange: publicProcedure.query(async () => {
		const levelRangeService = container.resolve(LevelRangeService);
		let levelRange = await levelRangeService.getAllLevelRange();
		if (levelRange == null) {
			throw new BaseResponseError("LevelRange does not exist");
		}
		return levelRange;
	}),

	updateLevelRange: publicProcedure
		.input(updateLevelRangeAPI)
		.mutation(async ({ input }) => {
			const levelRangeService = container.resolve(LevelRangeService);
			let newdata = await levelRangeService.updateLevelRange(input);
			return newdata;
		}),

	deleteLevelRange: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const levelRangeService = container.resolve(LevelRangeService);
			await levelRangeService.deleteLevelRange(input.id);
		}),

	createLevel: publicProcedure
		.input(createLevelAPI)
		.mutation(async ({ input }) => {
			const levelService = container.resolve(LevelService);
			let newdata = await levelService.createLevel(input);
			return newdata;
		}),

	getCurrentLevel: publicProcedure.query(async () => {
		const levelService = container.resolve(LevelService);
		let level = await levelService.getCurrentLevel();
		if (level == null) {
			throw new BaseResponseError("Level does not exist");
		}
		return level;
	}),

	getAllLevel: publicProcedure.query(async () => {
		const levelService = container.resolve(LevelService);
		let level = await levelService.getAllLevel();
		if (level == null) {
			throw new BaseResponseError("Level does not exist");
		}
		return level;
	}),

	updateLevel: publicProcedure
		.input(updateLevelAPI)
		.mutation(async ({ input }) => {
			const levelService = container.resolve(LevelService);
			let newdata = await levelService.updateLevel(input);
			return newdata;
		}),

	deleteLevel: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const levelService = container.resolve(LevelService);
			await levelService.deleteLevel(input.id);
		}),

	createPerformanceLevel: publicProcedure
		.input(createPerformanceLevelAPI)
		.mutation(async ({ input }) => {
			const performanceLevelService = container.resolve(
				PerformanceLevelService
			);
			let newdata = await performanceLevelService.createPerformanceLevel(
				input
			);
			return newdata;
		}),

	getCurrentPerformanceLevel: publicProcedure.query(async () => {
		const performanceLevelService = container.resolve(
			PerformanceLevelService
		);
		let performanceLevel =
			await performanceLevelService.getCurrentPerformanceLevel();
		if (performanceLevel == null) {
			throw new BaseResponseError("PerformanceLevel does not exist");
		}
		return performanceLevel;
	}),

	getAllPerformanceLevel: publicProcedure.query(async () => {
		const performanceLevelService = container.resolve(
			PerformanceLevelService
		);
		let performanceLevel =
			await performanceLevelService.getAllPerformanceLevel();
		if (performanceLevel == null) {
			throw new BaseResponseError("LevelRange does not exist");
		}
		return performanceLevel;
	}),

	updatePerformanceLevel: publicProcedure
		.input(updatePerformanceLevelAPI)
		.mutation(async ({ input }) => {
			const performanceLevelService = container.resolve(
				PerformanceLevelService
			);
			let newdata = await performanceLevelService.updatePerformanceLevel(
				input
			);
			return newdata;
		}),

	deletePerformanceLevel: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const performanceLevelService = container.resolve(
				PerformanceLevelService
			);
			await performanceLevelService.deletePerformanceLevel(input.id);
		}),

	createTrustMoney: publicProcedure
		.input(createTrustMoneyAPI)
		.mutation(async ({ input }) => {
			const trustMoneyService = container.resolve(TrustMoneyService);
			let newdata = await trustMoneyService.createTrustMoney(input);
			return newdata;
		}),

	getCurrentTrustMoney: publicProcedure.query(async () => {
		const trustMoneyService = container.resolve(TrustMoneyService);
		let trustMoney = await trustMoneyService.getCurrentTrustMoney();
		if (trustMoney == null) {
			throw new BaseResponseError("TrustMoney does not exist");
		}
		return trustMoney;
	}),

	getAllTrustMoney: publicProcedure.query(async () => {
		const trustMoneyService = container.resolve(TrustMoneyService);
		let trustMoney = await trustMoneyService.getAllTrustMoney();
		if (trustMoney == null) {
			throw new BaseResponseError("TrustMoney does not exist");
		}
		return trustMoney;
	}),

	updateTrustMoney: publicProcedure
		.input(updateTrustMoneyAPI)
		.mutation(async ({ input }) => {
			const trustMoneyService = container.resolve(TrustMoneyService);
			let newdata = await trustMoneyService.updateTrustMoney(input);
			return newdata;
		}),

	deleteTrustMoney: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const trustMoneyService = container.resolve(TrustMoneyService);
			await trustMoneyService.deleteTrustMoney(input.id);
		}),
});
