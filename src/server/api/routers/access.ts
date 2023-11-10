import { container } from "tsyringe";
import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	userProcedure,
} from "~/server/api/trpc";
import { Database } from "~/server/database/client";
import { RolesEnum, RolesEnumType } from "../types/role_type";
import { accessiblePages } from "../types/access_page_type";

export const accessRouter = createTRPCRouter({
	accessByRole: publicProcedure
		.input(
			z.object({
				role: RolesEnum
			})
		)
        .output(
            accessiblePages
        )
		.query(async ({ input }) => {
			const database = container.resolve(Database).connection;

            const ret = accessiblePages.parse({});

            switch(input.role) {
                case RolesEnumType.Admin: {
                    ret.actions = true;
                    ret.report = true;
                    ret.roles = true;
                    ret.settings = true;
                    return ret;
                }
                case RolesEnumType.Operator: {
                    ret.actions = true;
                    ret.report = true;
                    ret.settings = true;
                    return ret;
                }
                case RolesEnumType.User: {
                    ret.report = true;
                    ret.settings = true;
                    return ret;
                }
                default: {
                    return ret;
                }
            }
		}),
	
});
