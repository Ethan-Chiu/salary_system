import { z } from "zod";
import { container } from "tsyringe";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import {
	attendanceInput,
	createBankSettingInput,
	insuranceInput,
	updateBankSettingInput,
} from "../input_type/parameters_input";
import { BankSettingService } from "~/server/service/bank_setting_service";

export const parametersRouter = createTRPCRouter({
	getBankSetting: publicProcedure.query(async () => {
		const bankService = container.resolve(BankSettingService);
		let bankSetting = await bankService.getBankSettingList();
		return bankSetting;
	}),

	createBankSetting: publicProcedure
		.input(createBankSettingInput)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			let newdata = await bankService.createBankSetting(
				input.bank_code,
				input.bank_name,
				input.org_code,
				input.org_name,
				input.start_date,
				input.end_date
			);
			return newdata;
		}),

	updateBankSetting: publicProcedure
		.input(updateBankSettingInput)
		.mutation(async ({ input }) => {
			const bankService = container.resolve(BankSettingService);
			let newdata = await bankService.updateBankSetting(
				input.id,
				input.bank_code,
				input.bank_name,
				input.org_code,
				input.org_name,
				input.start_date,
				input.end_date
			);
			return newdata;
		}),

	deleteBankSetting: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async (opts) => {
			const { input } = opts;
			const bankService = container.resolve(BankSettingService);
			await bankService.deleteBankSetting(input.id);
		}),

	attendanceGetData: publicProcedure.query(async () => {
		// const now = new Date()
		// const attendanceData = await dataSource.manager.find(AttendanceSetting
		//     ,{
		//     where:{
		//         start_date: LessThanOrEqual(now),
		//         // end_date: MoreThan(now) || IsNull()
		//         end_date:  (IsNull() ||  MoreThanOrEqual(now))
		//     }
		// });
		// console.log((attendanceData[0] as any)['end_date'])
		// return {
		//     attendanceData: attendanceData,
		// };
	}),

	attendanceAddData: publicProcedure
		.input(attendanceInput)
		.mutation(async ({ input }) => {
			// const now = new Date()
			// const overlap_data = await dataSource.manager.find(AttendanceSetting,{
			//     where:{
			//         start_date: LessThanOrEqual(input.start_date),
			//         end_date: MoreThanOrEqual(input.start_date)
			//     }
			// });
			// if (overlap_data != null){
			//     return {
			//         error : 'invalid input'
			//     }
			// }
			// const old_attendanceData = await dataSource.manager.find(AttendanceSetting,{
			//     where:{
			//         start_date: LessThanOrEqual(now),
			//         end_date:  IsNull()
			//     }
			// });
			// for (const o of old_attendanceData){
			//     if (o != null){
			//         o.end_date=input.start_date
			//     }
			// }
			// const error = dataSource.manager.insert(AttendanceSetting,input)
			// return {
			//     error: error
			// };
		}),

	insuranceGetData: publicProcedure.query(async () => {
		// const now = new Date()
		// const insuranceData = await dataSource.manager.find(InsuranceRateSetting,{
		//     where:{
		//         start_date: LessThanOrEqual(now),
		//         end_date: (MoreThanOrEqual(now) || IsNull())
		//     }
		// });
		// return {
		//     insuranceDate: insuranceData,
		// };
	}),

	insuranceAddData: publicProcedure
		.input(insuranceInput)
		.mutation(async ({ input }) => {
			// const now = new Date()
			// const overlap_data = await dataSource.manager.find(InsuranceRateSetting,{
			//     where:{
			//         start_date: LessThanOrEqual(input.start_date),
			//         end_date: MoreThanOrEqual(input.start_date)
			//     }
			// });
			// if (overlap_data != null){
			//     return {
			//         error : 'invalid input'
			//     }
			// }
			// const old_attendanceData = await dataSource.manager.find(InsuranceRateSetting,{
			//     where:{
			//         start_date: LessThanOrEqual(now),
			//         end_date:  IsNull()
			//     }
			// });
			// for (const o of old_attendanceData){
			//     if (o != null){
			//         o.end_date=input.start_date
			//     }
			// }
			// const error = dataSource.manager.insert(InsuranceRateSetting,input)
			// return {
			//     error: error
			// };
		}),
});
