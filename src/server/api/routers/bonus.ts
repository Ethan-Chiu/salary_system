import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { EmployeeBonusService } from "~/server/service/employee_bonus_servise";
import { BonusTypeEnum } from "../types/bonus_type_enum";
import { EmployeeData } from "~/server/database/entity/SALARY/employee_data";
import { BonusWorkTypeService } from "~/server/service/bonus_work_type_service";
import { BonusSeniorityService } from "~/server/service/bonus_seniority_service";
import { BonusDepartmentService } from "~/server/service/bonus_department_service";
import { BonusPositionTypeService } from "~/server/service/bonus_position_type_service";
import { BonusPositionService } from "~/server/service/bonus_position_service";

export const bonusRouter = createTRPCRouter({
    getAllEmpBonus: publicProcedure
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
            const all_emp_no_list = (await EmployeeData.findAll({
                attributes: ['emp_no', 'work_status'],
            })).filter((emp) => emp.work_status != "離職人員").map((emp) => emp.emp_no);
            const result = await bonusService.createEmployeeBonusByEmpNoList(input.period_id, input.bonus_type, all_emp_no_list);
            return result;
        }),
    createBonusWorkType: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
            work_type: z.string(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusWorkTypeService = container.resolve(BonusWorkTypeService);
            const result = await bonusWorkTypeService.createBonusWorkType(input);
        }),
    createBonusSeniority: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
            seniority: z.number(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusSeniorityService = container.resolve(BonusSeniorityService);
            const result = await bonusSeniorityService.createBonusSeniority(input);
        }),
    createBonusDepartment: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
            department: z.string(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusDepartmentService = container.resolve(BonusDepartmentService);
            const result = await bonusDepartmentService.createBonusDepartment(input);
        }),
    createBonusPositionType: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
            position_type: z.string(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusPositionTypeService = container.resolve(BonusPositionTypeService);
            const result = await bonusPositionTypeService.createBonusPositionType(input);
        }),
    createBonusPosition: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
            position: z.number(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusPositionService = container.resolve(BonusPositionService);
            const result = await bonusPositionService.createBonusPosition(input);
        }),
})