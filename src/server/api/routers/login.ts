import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { UserService } from "~/server/service/userService";

export const loginRouter = createTRPCRouter({
	login: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.query(async ({ input }) => {
			const userService = new UserService();
			let user = await userService.findUserByEmpId(input.emp_id);

			if (!user) {
				throw new BaseError("Failed to find available account");
			} else {
				const match = await bcrypt.compare(input.password, user.hash);
				if (!match) {
					throw new BaseError("Wrong password");
				} else {
					await userService.updateHash(user.id, input.password);
				}
			}

			return user;
		}),

	changePassword: publicProcedure
		.input(z.object({ emp_id: z.string(), password: z.string() }))
		.query(async ({ input }) => {
			const userService = new UserService();
			let user = await userService.findUserByEmpId(input.emp_id);

			if (!user) {
				throw new BaseError("Failed to find available account");
			} else {
				await userService.updateHash(user.id, input.password);
			}

			return user;
		}),
});
