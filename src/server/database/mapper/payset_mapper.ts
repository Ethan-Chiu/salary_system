import { EmployeeDataService } from "~/server/service/employee_data_service";
import { container } from "tsyringe";
import { PaysetFE, PaysetFEType } from "~/server/api/types/payset_type";
import { Payset } from "../entity/UMEDIA/payset";

export class PaysetMapper {
	async getPaysetFE(
		payset_list: Payset[]
	): Promise<PaysetFEType[]> {
		const employee_data_service = container.resolve(EmployeeDataService);
		const PaysetFE_list = await Promise.all(
			payset_list.map(async (payset) => {
				const employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						payset.emp_no
					);

				const work_day =
					payset.work_day ?? 30;
				return PaysetFE.parse({
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
