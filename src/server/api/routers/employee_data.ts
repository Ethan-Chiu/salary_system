import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";

export const employeeDataRouter = createTRPCRouter({
	getEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);

		return;
	}),
});
