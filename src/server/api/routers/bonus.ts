import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeeBonusService } from "~/server/service/employee_bonus_servise";
import { BonusTypeEnum } from "../types/bonus_type_enum";

export const bonusRouter = createTRPCRouter({
    getAllBonus: publicProcedure
        .input(z.object({}))
        .query(async () => {
            const bonusService = container.resolve(EmployeeBonusService);
            const result = await bonusService.getAllEmployeeBonus();
            return result;
        }),
    createAllEmpBonus: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
        }))
        .mutation(async ({ input }) => {
            const bonusService = container.resolve(EmployeeBonusService);
            const 
            const result = await bonusService.createEmployeeBonus(input);
            return result;
        })
    getEmpBonus: publicProcedure
        .input(z.object({ emp_no: z.string() }))
})