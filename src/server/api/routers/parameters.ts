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
} from "../input_type/parameters_input";
import { BankSettingService } from "~/server/service/bank_setting_service";
import { AttendanceSettingService } from "~/server/service/attendance_setting_service";
import { BaseResponseError } from "../error/BaseResponseError";
import { BonusDepartmentService } from "~/server/service/bonus_department_service";

export const parametersRouter = createTRPCRouter({
	getBankSetting: publicProcedure.query(async () => {
		const bankService = container.resolve(BankSettingService);
		let bankSetting = await bankService.getBankSettingList();
		if (bankSetting == null || bankSetting!.length == 0) {
			throw new BaseResponseError("BankSetting does not exist");
		}
		return bankSetting;
	}),

	createBankSetting: publicProcedure
		.input(createBankSettingInput)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			let newdata = await bankService.createBankSetting(input);
			return newdata;
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

	getAttendanceSetting: publicProcedure.query(async () => {
		const attendanceService = container.resolve(AttendanceSettingService);
		let attendanceSetting = await attendanceService.getAttendanceSetting();
		if (attendanceSetting == null) {
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
			return newdata;
		}),

	updateAttendanceSetting: publicProcedure
		.input(updateAttendanceSettingInput)
		.mutation(async ({ input }) => {
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			let newdata = await attendanceService.updateAttendanceSetting(
				input
			);
			return newdata;
		}),

	deleteAttendanceSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const attendanceService = container.resolve(
				AttendanceSettingService
			);
			await attendanceService.deleteAttendanceSetting(input.id);
		}),

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
});
