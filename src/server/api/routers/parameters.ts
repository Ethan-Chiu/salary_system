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
import { attendanceInput, bankInput, insuranceInput } from "../input_type/parameters_input";
import { LessThan, MoreThan } from "typeorm";

export const parametersRouter = createTRPCRouter({
	bankGetData: publicProcedure
		.query(async() => {
            const now = new Date()
			const bank_data = await dataSource.manager.find(BankSetting,{   
                where:{
                    start_date: LessThan(now),
                    end_date: MoreThan(now) || undefined
                }
            });
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
        .query(async () => {
            const now = new Date()
            const attendanceData = await dataSource.manager.find(AttendanceSetting)
                // ,{
            //     // where:{
            //     //     start_date: LessThan(now),
            //     //     end_date: MoreThan(now) || undefined
            //     // }
            // });

            return {
                attendanceData: attendanceData,
            };
        }),

    attendanceAddData: publicProcedure
        .input(attendanceInput)
        .query(async ({ input }) => {
            const now = new Date()
            const overlap_data = await dataSource.manager.find(AttendanceSetting,{
                where:{
                    start_date: LessThan(input.start_date),
                    end_date: MoreThan(input.start_date) 
                }
            });
            if (overlap_data != undefined){
                return {
                    error : 'invalid input'
                }
            }
            const old_attendanceData = await dataSource.manager.find(AttendanceSetting,{
                where:{
                    start_date: LessThan(now),
                    end_date:  undefined
                }
            });
            for (const o of old_attendanceData){
                if (o != undefined){
                    o.end_date=input.start_date
                }
            }    
            const error = dataSource.manager.insert(AttendanceSetting,input)
            return {
                error: error
            };
        }),

    insuranceGetData: publicProcedure
        .query(async () => {
            const now = new Date()
            const insuranceData = await dataSource.manager.find(InsuranceRateSetting,{
                where:{
                    start_date: LessThan(now),
                    end_date: MoreThan(now) || undefined
                }
            });

            return {
                insuranceDate: insuranceData,
            };
        }),

    insuranceAddData: publicProcedure
        .input(insuranceInput)
        .query(async ({ input }) => {
            const now = new Date()
            const overlap_data = await dataSource.manager.find(InsuranceRateSetting,{
                where:{
                    start_date: LessThan(input.start_date),
                    end_date: MoreThan(input.start_date) 
                }
            });
            if (overlap_data != undefined){
                return {
                    error : 'invalid input'
                }
            }
            const old_attendanceData = await dataSource.manager.find(InsuranceRateSetting,{
                where:{
                    start_date: LessThan(now),
                    end_date:  undefined
                }
            });
            for (const o of old_attendanceData){
                if (o != undefined){
                    o.end_date=input.start_date
                }
            }    
            const error = dataSource.manager.insert(InsuranceRateSetting,input)
            return {
                error: error
            };
        }),

});
