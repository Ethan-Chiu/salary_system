import { z } from "zod";
import { container } from "tsyringe";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import {
	createAttendanceSettingInput,
	updateAttendanceSettingInput,
	createBankSettingInput,
	updateBankSettingInput,
	createBonusDepartmentInput,
	updateBonusDepartmentInput,
	createBonusPositionInput,
	updateBonusPositionInput,
	createBonusSeniorityInput,
	updateBonusSeniorityInput,
	createBonusSettingInput,
	updateBonusSettingInput,
} from "../input_type/parameters_input";
import { BankSettingService } from "~/server/service/bank_setting_service";
import { AttendanceSettingService } from "~/server/service/attendance_setting_service";
import { BaseResponseError } from "../error/BaseResponseError";
import { BonusDepartmentService } from "~/server/service/bonus_department_service";
import { BonusPositionService } from "~/server/service/bonus_position_service";
import { BonusSeniorityService } from "~/server/service/bonus_seniority_service";
import { BonusSettingService } from "~/server/service/bonus_setting_service";
import { InsuranceRateSettingService } from "~/server/service/insurance_rate_setting_service";

export const parametersRouter = createTRPCRouter({
	createBankSetting: publicProcedure
		.input(createBankSettingInput)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			let newdata = await bankService.createBankSetting(input);
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
		.input(updateBankSettingInput)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			let newdata = await bankService.updateBankSetting(input);
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
		.input(createAttendanceSettingInput)
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			let newdata = await attendanceService.createAttendanceSetting(
				input
			);
			await attendanceService.rescheduleAttendanceSetting();
			return newdata;
		}),

	updateAttendanceSetting: publicProcedure
		.input(updateAttendanceSettingInput)
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			await attendanceService.updateAttendanceSetting(input);
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
		const insuranceRateService = container.resolve(InsuranceRateSettingService);
		let insuranceRateSetting =
			await insuranceRateService.getCurrentInsuranceRateSetting();
		if (insuranceRateSetting == null) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}
		return insuranceRateSetting;
	}),

	getAllInsuranceRateSetting: publicProcedure.query(async () => {
		const insuranceRateService = container.resolve(InsuranceRateSettingService);
		let insuranceRateSetting =
			await insuranceRateService.getAllInsuranceRateSetting();
		if (insuranceRateSetting.length == 0) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}
		return insuranceRateSetting;
	}),

	// createAttendanceSetting: publicProcedure
	// 	.input(createAttendanceSettingInput)
	// 	.mutation(async ({ input }) => {
	// 		const attendanceService = container.resolve(
	// 			AttendanceSettingService
	// 		);
	// 		let newdata = await attendanceService.createAttendanceSetting(
	// 			input
	// 		);
	// 		await attendanceService.rescheduleAttendanceSetting();
	// 		return newdata;
	// 	}),

	// updateAttendanceSetting: publicProcedure
	// 	.input(updateAttendanceSettingInput)
	// 	.mutation(async ({ input }) => {
	// 		const attendanceService = container.resolve(
	// 			AttendanceSettingService
	// 		);
	// 		await attendanceService.updateAttendanceSetting(input);
	// 		await attendanceService.rescheduleAttendanceSetting();
	// 	}),

	// deleteAttendanceSetting: publicProcedure
	// 	.input(z.object({ id: z.number() }))
	// 	.mutation(async ({ input }) => {
	// 		const attendanceService = container.resolve(
	// 			AttendanceSettingService
	// 		);
	// 		await attendanceService.deleteAttendanceSetting(input.id);
	// 		await attendanceService.rescheduleAttendanceSetting();
	// 	}),

	createBonusDepartment: publicProcedure.input(createBonusDepartmentInput).mutation(async ({ input }) => {
		const bonusDepartmentService = container.resolve(
			BonusDepartmentService
		);
		let newdata = await bonusDepartmentService.createBonusDepartment(
			input
		);
		return newdata;
	}),

	getCurrentBonusDepartment: publicProcedure.query(async () => {
		const bonusDepartmentService = container.resolve(BonusDepartmentService);
		let bonusDepartment = await bonusDepartmentService.getCurrentBonusDepartment();
		if (bonusDepartment == null) {
			throw new BaseResponseError("BonusDepartment does not exist");
		}
		return bonusDepartment;
	}),

	getAllBonusDepartment: publicProcedure.query(async () => {
		const bonusDepartmentService = container.resolve(BonusDepartmentService);
		let bonusDepartment = await bonusDepartmentService.getAllBonusDepartment();
		if (bonusDepartment == null) {
			throw new BaseResponseError("BonusDepartment does not exist");
		}
		return bonusDepartment;
	}),

	updateBonusDepartment: publicProcedure
		.input(updateBonusDepartmentInput)
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

	createBonusPosition: publicProcedure.input(createBonusPositionInput).mutation(async ({ input }) => {
		const bonusPositionService = container.resolve(
			BonusPositionService
		);
		let newdata = await bonusPositionService.createBonusPosition(
			input
		);
		return newdata;
	}),

	getCurrentBonusPosition: publicProcedure.query(async () => {
		const bonusPositionService = container.resolve(BonusPositionService);
		let bonusPosition = await bonusPositionService.getCurrentBonusPosition();
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
		.input(updateBonusPositionInput)
		.mutation(async ({ input }) => {
			const bonusPositionService = container.resolve(
				BonusPositionService
			);
			let newdata = await bonusPositionService.updateBonusPosition(
				input
			);
			return newdata;
		}),

	deleteBonusPositon: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bonusPositionService = container.resolve(
				BonusPositionService
			);
			await bonusPositionService.deleteBonusPosition(input.id);
		}),
	createBonusSeniority: publicProcedure.input(createBonusSeniorityInput).mutation(async ({ input }) => {
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
		let bonusSeniority = await bonusSeniorityService.getCurrentBonusSeniority();
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
		.input(updateBonusSeniorityInput)
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

	createBonusSetting: publicProcedure.input(createBonusSettingInput).mutation(async ({ input }) => {
		const bonusSettingService = container.resolve(
			BonusSettingService
		);
		let newdata = await bonusSettingService.createBonusSetting(
			input
		);
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
		.input(updateBonusSettingInput)
		.mutation(async ({ input }) => {
			const bonusSettingService = container.resolve(
				BonusSettingService
			);
			let newdata = await bonusSettingService.updateBonusSetting(
				input
			);
			return newdata;
		}),

	deleteBonusSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bonusSettingService = container.resolve(
				BonusSettingService
			);
			await bonusSettingService.deleteBonusSetting(input.id);
		}),
});
