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
import { get } from "http";
import { updateBonusDepartmentAPI } from "../types/parameters_input_type";
// 改Enum
export const bonusRouter = createTRPCRouter({
    getAllEmpBonus: publicProcedure
        .input(z.object({}))
        .query(async () => {
            const bonusService = container.resolve(EmployeeBonusService);
            const result = await bonusService.getAllEmployeeBonus();
            return result;
        }),
    getCandidateEmpBonus: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
        }))
        .query(async ({ input }) => {
            const empBonusService = container.resolve(EmployeeBonusService);
            const result = await empBonusService.getCandidateEmployeeBonus(input.period_id, input.bonus_type);
            return result;
        }),
    createAllEmpBonus: publicProcedure
        .input(z.object({
            period_id: z.number(),
            bonus_type: BonusTypeEnum,
        }))
        .mutation(async ({ input }) => {
            const empBonusService = container.resolve(EmployeeBonusService);
            const all_emp_no_list = (await EmployeeData.findAll({ attributes: ['emp_no','work_status'], 
            })).filter((emp) => emp.work_status != "離職人員").map((emp) => emp.emp_no);
            const result = await empBonusService.createEmployeeBonusByEmpNoList(input.period_id, input.bonus_type, all_emp_no_list);
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
            return result;
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
            return result;
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
            return result;
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
            return result;
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
            return result;
        }),
    updateBonusWorkType: publicProcedure
        .input(z.object({
            id: z.number(),
            work_type: z.string(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusWorkTypeService = container.resolve(BonusWorkTypeService);
            const result = await bonusWorkTypeService.updateBonusWorkType(input);
            return result;
        }),
    updateBonusSeniority: publicProcedure
        .input(z.object({
            id: z.number(),
            seniority: z.number(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusSeniorityService = container.resolve(BonusSeniorityService);
            const result = await bonusSeniorityService.updateBonusSeniority(input);
            return result;
        }),
    updateBonusDepartment: publicProcedure
        .input(z.object({
            id: z.number(),
            department: z.string(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusDepartmentService = container.resolve(BonusDepartmentService);
            const result = await bonusDepartmentService.updateBonusDepartment(input);
            return result;
        }),
    updateBonusPositionType: publicProcedure
        .input(z.object({
            id: z.number(),
            position_type: z.string(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusPositionTypeService = container.resolve(BonusPositionTypeService);
            const result = await bonusPositionTypeService.updateBonusPositionType(input);
            return result;
        }),
    updateBonusPosition: publicProcedure
        .input(z.object({
            id: z.number(),
            position: z.number(),
            multiplier: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusPositionService = container.resolve(BonusPositionService);
            const result = await bonusPositionService.updateBonusPosition(input);
            return result;
        }),
    deleteBonusWorkType: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusWorkTypeService = container.resolve(BonusWorkTypeService);
            const result = await bonusWorkTypeService.deleteBonusWorkType(input.id);
            return result;
        }),
    deleteBonusSeniority: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusSeniorityService = container.resolve(BonusSeniorityService);
            const result = await bonusSeniorityService.deleteBonusSeniority(input.id);
            return result;
        }),
    deleteBonusDepartment: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusDepartmentService = container.resolve(BonusDepartmentService);
            const result = await bonusDepartmentService.deleteBonusDepartment(input.id);
            return result;
        }),
    deleteBonusPositionType: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusPositionTypeService = container.resolve(BonusPositionTypeService);
            const result = await bonusPositionTypeService.deleteBonusPositionType(input.id);
            return result;
        }),
    deleteBonusPosition: publicProcedure
        .input(z.object({
            id: z.number(),
        }))
        .mutation(async ({ input }) => {
            const bonusPositionService = container.resolve(BonusPositionService);
            const result = await bonusPositionService.deleteBonusPosition(input.id);
            return result;
        }),
})