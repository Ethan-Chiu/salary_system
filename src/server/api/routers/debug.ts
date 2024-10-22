import { container } from "tsyringe";
import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	userProcedure,
} from "~/server/api/trpc";
import { Database } from "~/server/database/client";
import { RolesEnum } from "../types/role_type";
import { accessiblePages } from "../types/access_page_type";
import { AccessService } from "~/server/service/access_service";
import { HolidaysTypeService } from "~/server/service/holidays_type_service";
import { Transaction } from "~/server/database/entity/SALARY/transaction";
import { BonusDepartment } from "~/server/database/entity/SALARY/bonus_department";
import { BonusPosition } from "~/server/database/entity/SALARY/bonus_position";
import { BonusPositionType } from "~/server/database/entity/SALARY/bonus_position_type";
import { BonusSeniority } from "~/server/database/entity/SALARY/bonus_seniority";
import { BonusWorkType } from "~/server/database/entity/SALARY/bonus_work_type";
import { SalaryIncomeTax } from "~/server/database/entity/SALARY/salary_income_tax";
import { EmployeeBonus } from "~/server/database/entity/SALARY/employee_bonus";
import { EmployeeData } from "~/server/database/entity/SALARY/employee_data";
import { InsuranceRateSetting } from "~/server/database/entity/SALARY/insurance_rate_setting";
import { EmployeePayment } from "~/server/database/entity/SALARY/employee_payment";
import { EmployeeTrust } from "~/server/database/entity/SALARY/employee_trust";
// import { EmployeeDataMut } from "~/server/database/entity/SALARY/employee_data_mut";
import { TrustMoney } from "~/server/database/entity/SALARY/trust_money";
import { Level } from "~/server/database/entity/SALARY/level";
import { LevelRange } from "~/server/database/entity/SALARY/level_range";
import { AttendanceSetting } from "~/server/database/entity/SALARY/attendance_setting";
import { AccessSetting } from "~/server/database/entity/SALARY/access_setting";
import { BankSetting } from "~/server/database/entity/SALARY/bank_setting";
import { BasicInfo } from "~/server/database/entity/SALARY/basic_info";
import { BonusSetting } from "~/server/database/entity/SALARY/bonus_setting";
import { EmployeeAccount } from "~/server/database/entity/SALARY/employee_account";

export const debugRouter = createTRPCRouter({
	syncDb: publicProcedure
		.input(
			z.object({
				force: z.boolean().nullable(),
				alter: z.boolean().nullable(),
			})
		)
		.query(async ({ input }) => {
			const database = container.resolve(Database).connection;

			try {
				if (input.force) {
					await database.sync({ force: true });
				} else if (input.alter) {
					await database.sync({ alter: true });
				}
				await database.sync();

				return {
					msg: "All models were synchronized successfully.",
				};
			} catch (e) {
				return {
					msg: `error ${(e as Error).message}`,
				};
			}
		}),
	syncTransaction: publicProcedure
		.input(
			z.object({
				force: z.boolean().nullable(),
				alter: z.boolean().nullable(),
			})
		)
		.query(async ({ input }) => {
			try {
				if (input.force) {
					await Transaction.sync({ force: true });
				} else if (input.alter) {
					await Transaction.sync({ alter: true });
				}
				await Transaction.sync();

				return {
					msg: "All models were synchronized successfully.",
				};
			} catch (e) {
				return {
					msg: `error ${(e as Error).message}`,
				};
			}
		}),
	syncTables: publicProcedure
		.input(
			z.object({
				force: z.boolean().nullable(),
				alter: z.boolean().nullable(),
			})
		)
		.query(async ({ input }) => {
			const table_list = [
				// AccessSetting,
				// AttendanceSetting,
				// BankSetting,
				// BasicInfo,
				// BonusDepartment,
				// BonusPosition,
				// BonusPositionType,
				// BonusSeniority,
				// BonusWorkType,
				// BonusSetting,
				// EmployeeAccount,
				// EmployeeBonus,
				// EmployeePayment,
				// EmployeeTrust,
				// InsuranceRateSetting,
				LevelRange,
				// Level,
				// TrustMoney,
			];
			const promises = table_list.map(async (model) => {
				try {
					if (input.force) {
						await model.sync({ force: true });
					} else if (input.alter) {
						await model.sync({ alter: true });
					}
					await model.sync();

				} catch (e) {
					return {
						msg: `error ${(e as Error).message}`,
					};
				}
			})
			await Promise.all(promises)
			return {
				msg: "All models were synchronized successfully.",
			};
		}),
	validate: publicProcedure.query(async () => {
		const database = container.resolve(Database).connection;
		try {
			await database.authenticate();
			return { msg: "Connection has been established successfully." };
		} catch (error) {
			return {
				msg: `Unable to connect to the database: ${(error as Error).message
					}`,
			};
		}
	}),
	protect: protectedProcedure.query(({ ctx }) => {
		return ctx;
	}),
	resolveUser: userProcedure.query(({ ctx }) => {
		return ctx;
	}),
	createAccessSetting: publicProcedure
		.input(
			z.object({
				role: RolesEnum,
				access: accessiblePages,
			})
		)
		.mutation(async ({ input }) => {
			const accessService = container.resolve(AccessService);
			await accessService.createAccessData(input.role, input.access);
		}),

	createHolidaysType: publicProcedure
		.input(
			z.object({
				pay_id: z.number(),
				holidays_name: z.string(),
				multiplier: z.number(),
				pay_type: z.number(),
				start_date: z.string(),
				end_date: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const holidaysTypeService = container.resolve(HolidaysTypeService);
			await holidaysTypeService.createHolidaysType(input);
		}),
});
