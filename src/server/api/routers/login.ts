import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import * as bcrypt from "bcrypt";
import { UserService } from "~/server/service/userService";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseError";

export const loginRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.mutation(async (opts) => {
			const { input } = opts;

			const userService = container.resolve(UserService);
			let user = await userService.findUserByEmpId(input.emp_id);
			console.log("user", user)

			if (!user) {
				throw new BaseResponseError("Failed to find available account");
			} else {
				const match = await bcrypt.compare(input.password, user.hash);
				if (!match) {
					throw new BaseResponseError("Wrong password");
				} else {
					await userService.updateHash(user.id, input.password);
				}
			}

			return user;
		}),

	changePassword: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.mutation(async ({ input }) => {
			const userService = container.resolve(UserService);
			let user = await userService.findUserByEmpId(input.emp_id);

			if (!user) {
				throw new BaseResponseError("Failed to find available account");
			} else {
				await userService.updateHash(user.id, input.password);
			}

			return user;
		}),
});
