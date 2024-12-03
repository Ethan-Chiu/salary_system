import { EmployeeDataService } from "~/server/service/employee_data_service";
import { paysetFE, type PaysetFEType } from "~/server/api/types/payset_type";
import { type Payset } from "../entity/UMEDIA/payset";
import { injectable } from "tsyringe";

@injectable()
export class PaysetMapper {
  constructor(
    private readonly employeeDataService: EmployeeDataService
  ) {}

	async getPaysetFE(payset_list: Payset[]): Promise<PaysetFEType[]> {
		const PaysetFE_list = await Promise.all(
			payset_list.map(async (payset) => {
				const employee_data =
					await this.employeeDataService.getEmployeeDataByEmpNo(
						payset.emp_no
					);

				const work_day = payset.work_day ?? 30;
				return paysetFE.parse({
					...payset,
					department: employee_data!.department,
					emp_no: payset.emp_no,
					emp_name: employee_data!.emp_name,
					position: employee_data!.position,
					work_day: work_day,
				});
			})
		);

		return PaysetFE_list;
	}
}
