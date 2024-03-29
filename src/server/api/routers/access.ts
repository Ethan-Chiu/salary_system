import { container } from "tsyringe";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { accessiblePages } from "../types/access_page_type";
import { AccessService } from "~/server/service/access_service";

export const accessRouter = createTRPCRouter({
	accessByRole: userProcedure
		.output(accessiblePages)
		.query(async ({ ctx }) => {
			const accessService = container.resolve(AccessService);

			const role = ctx.session?.user.role ?? null;

			return accessService.getAccessByRole(role);
		}),
});
