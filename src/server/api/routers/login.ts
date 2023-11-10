import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import * as bcrypt from "bcrypt";
import { UserService } from "~/server/service/user_service";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";

export const loginRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.mutation(async (opts) => {
			const { input } = opts;

			const userService = container.resolve(UserService);
			const user = await userService.getUser(input.emp_id);

			if (!user) {
				throw new BaseResponseError("User does not exist");
			} else {
				const match = await bcrypt.compare(input.password, user.hash);
				if (!match) {
					throw new BaseResponseError("Wrong password");
				} else {
					await userService.updateUser(input.emp_id, input.password);
				}
			}

			return user;
		}),

	changePassword: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.updateUser(input.emp_id, input.password);
		}),

	createUser: publicProcedure
		.input(
			z.object({
				emp_id: z.string(),
				password: z.string(),
				auth_level: z.number(),
				start_date: z.date().nullable(),
				end_date: z.date().nullable(),
			})
		)
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.createUser(
				input.emp_id,
				input.password,
				input.auth_level,
				input.start_date,
				input.end_date
			);

			return user;
		}),

	deleteUser: publicProcedure
		.input(z.object({ emp_id: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.deleteUser(input.emp_id);
		}),
});
