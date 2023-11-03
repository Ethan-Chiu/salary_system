import { z } from "zod";
import { container } from "tsyringe";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { attendanceInput, bankInput, insuranceInput } from "../input_type/parameters_input";
import { BankService } from "~/server/service/bankService";

export const parametersRouter = createTRPCRouter({
	bankGetData: publicProcedure
		.query(async() => {
            const bankService = container.resolve(BankService);
            let bankData = await bankService.getData();
            return bankData
		}),

    bankAddData: publicProcedure
        .input(bankInput)
        .mutation(async (opts) => {
            const { input } = opts;
            const bankService = container.resolve(BankService);
            let newdata = await bankService.addData(input);
            return newdata
            // const error = dataSource.manager.insert(BankSetting,input)
            // return {
            //     error: error
            // };
        }),

    attendanceGetData: publicProcedure
        .query(async () => {
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

    insuranceGetData: publicProcedure
        .query(async () => {
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
