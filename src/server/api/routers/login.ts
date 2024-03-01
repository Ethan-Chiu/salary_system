import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as bcrypt from "bcrypt";
import { UserService } from "~/server/service/user_service";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { createUserAPI } from "../types/parameters_input_type";
import { get_date_string } from "~/server/service/helper_function";

export const loginRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ emp_no: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.getUser(input.emp_no);

			if (!user) {
				throw new BaseResponseError("User does not exist");
			} else {
				const match = await bcrypt.compare(input.password, user.hash);
				if (!match) {
					throw new BaseResponseError("Wrong password");
				} else {
					await userService.updateUser({
						emp_no: input.emp_no,
						password: input.password,
					});
				}
			}

			return user;
		}),

	changePassword: publicProcedure
		.input(z.object({ emp_no: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.updateUser({
				emp_no: input.emp_no,
				password: input.password,
			});
		}),

	createUser: publicProcedure
		.input(createUserAPI)
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			const user = await userService.createUser({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});

			return user;
		}),

	deleteUser: publicProcedure
		.input(z.object({ emp_no: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			await userService.deleteUser(input.emp_no);
		}),
});
