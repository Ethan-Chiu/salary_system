import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { dataSource } from "~/server/database/client";
import { AttendanceSetting } from "~/server/database/entity/SALARY/attendance_setting";
import { BankSetting } from "~/server/database/entity/SALARY/bank_setting";
import { InsuranceRateSetting } from "~/server/database/entity/SALARY/insurance_rate_setting";

export const seedRouter = createTRPCRouter({
	seed: publicProcedure
		.query(async () => {
            try {
                await dataSource.manager
                    .createQueryBuilder()
                    .delete()
                    .from(BankSetting)
                    .execute()
            } catch {
                return { succeed: false }
            }

            const bankSetting: BankSetting = new BankSetting()
            bankSetting.bank_code = "900"
	        bankSetting.bank_name = "bbb_bank"
	        bankSetting.org_code = "0667"
            bankSetting.org_name = "ooo_org_name"
            bankSetting.start_date = new Date()

            try {
                await dataSource.manager.save(bankSetting)
            } catch(e) {
                console.log("bank setting seed failed")
                console.log(e)
                return {
                    succeed: false,
                };
            }
            
            try {
                await dataSource.manager
                    .createQueryBuilder()
                    .delete()
                    .from(AttendanceSetting)
                    .execute()
            } catch {
                return { succeed: false }
            }

            console.log("attendance setting seed")
            const attSetting: AttendanceSetting= new AttendanceSetting()
            attSetting.personal_leave_dock = 0.1
            attSetting.sick_leave_dock = 0.2
            attSetting.rate_of_unpaid_leave = 0.3
            attSetting.unpaid_leave_compensatory_1 = 0.4
            attSetting.unpaid_leave_compensatory_2 = 0.5
            attSetting.unpaid_leave_compensatory_3 = 0.6
            attSetting.unpaid_leave_compensatory_4 = 0.7
            attSetting.unpaid_leave_compensatory_5 = 0.8
            attSetting.overtime_by_local_workers_1 = 0.9
            attSetting.overtime_by_local_workers_2 = 1.0
            attSetting.overtime_by_local_workers_3 = 1.1
            attSetting.local_worker_holiday = 1.2
            attSetting.overtime_by_foreign_workers_1 = 1.3
            attSetting.overtime_by_foreign_workers_2 = 1.4
            attSetting.overtime_by_foreign_workers_3 = 1.5
            attSetting.foreign_worker_holiday = 1.6
            attSetting.start_date = new Date()
            attSetting.end_date = new Date()

            try {
                await dataSource.manager.save(attSetting)
            } catch(e) {
                console.log("attendance setting seed failed")
                console.log(e)
                return {
                    succeed: false,
                };
            }


            console.log("insurance rate setting seed")
            try {
                await dataSource.manager
                    .createQueryBuilder()
                    .delete()
                    .from(InsuranceRateSetting)
                    .execute()
            } catch {
                return { succeed: false }
            }
            const insurSetting: InsuranceRateSetting = new InsuranceRateSetting()
            insurSetting.min_wage_rate = 0.1
	        insurSetting.l_i_accident_rate = 0.2
	        insurSetting.l_i_employment_premium_rate = 0.3
            insurSetting.l_i_occupational_hazard_rate = 0.4
            insurSetting.l_i_wage_replacement_rate = 0.5
            insurSetting.h_i_standard_rate = 0.6
            insurSetting.h_i_avg_dependents_count = 7
            insurSetting.v2_h_i_supp_premium_rate = 0.8
            insurSetting.v2_h_i_dock_tsx_thres = 0.9
            try {
                await dataSource.manager.save(insurSetting)
            } catch(e) {
                console.log("insurance rate setting seed failed")
                console.log(e)
                return {
                    succeed: false,
                };
            }

            return {
				succeed: true,
			};
		}),
});