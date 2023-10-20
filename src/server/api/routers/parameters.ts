import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { dataSource } from "~/server/database/client";
import { BankSetting } from "~/server/database/entity/bank_setting";
import {AttendanceSetting} from "~/server/database/entity/attendance_setting";
import {InsuranceRateSetting} from "~/server/database/entity/insurance_rate_setting";
import { bankInput } from "../input_type/parameters_input";

export const parametersRouter = createTRPCRouter({
	bankGetData: publicProcedure
		.query(async() => {
			const bank_data = await dataSource.manager.find(BankSetting);
            
			return {
				bankData: bank_data,
			};
		}),
    
    bankAddData: publicProcedure
        .input(bankInput)
        .query(async ({ input }) => {
            const error = dataSource.manager.insert(BankSetting,input)
            return {
                error: error
            };
        }),

    attendanceGetData: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
        const attendanceData = await dataSource.manager.find(AttendanceSetting);

        return {
            attendanceData: attendanceData,
        };
    }),

    attendanceAddData: publicProcedure
        .input(bankInput)
        .query(async ({ input }) => {
            const error = dataSource.manager.insert(BankSetting,input)
            return {
                error: error
            };
        }),

    insuranceGetData: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
        const insuranceData = await dataSource.manager.find(InsuranceRateSetting);

        return {
            insuranceDate: insuranceData,
        };
    }),
    

});
