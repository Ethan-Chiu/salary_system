import { type BonusWithType, EHRService } from "~/server/service/ehr_service";
import { type BonusFEType } from "~/server/api/types/bonus_type";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { EmployeeBonusMapper } from "./employee_bonus_mapper";
import { EmployeeBonusService } from "~/server/service/employee_bonus_service";
import { container, injectable } from "tsyringe";

@injectable()
export class BonusMapper {
	constructor(
		private readonly ehrService: EHRService,
		private readonly employeeDataService: EmployeeDataService,
		private readonly employeeBonusService: EmployeeBonusService,
		private readonly employeeBonusMapper: EmployeeBonusMapper
	) { }

	async getBonusFE(
		period_id: number,
		bonus_with_type_list: BonusWithType[],
		emp_no_list: string[]
	): Promise<BonusFEType[]> {
		const employeeDataList = await this.employeeDataService.getLatestEmployeeDataByEmpNoList(emp_no_list);
		const payset_list = await this.ehrService.getPaysetByEmpNoList(period_id, emp_no_list);
		const employee_bonus_list = await this.employeeBonusService.getEmployeeBonusByEmpNoListByType(period_id, "project_bonus", emp_no_list);

		const new_bonusFE_list: BonusFEType[] = await Promise.all(
			emp_no_list.map(async (emp_no) => {
				const employee_data = employeeDataList.find((e) => e.emp_no === emp_no);
				const payset = payset_list.find((p) => p.emp_no === emp_no);
				const employee_bonus = employee_bonus_list.find((e) => e.emp_no === emp_no);
				const project_bonus = employee_bonus ? employee_bonus.app_amount ?? -1 : 0;

				return {
					// ...employee_bonus,
					emp_no: emp_no,
					emp_name: employee_data!.emp_name,
					department: employee_data!.department,
					position: employee_data!.position,
					work_day: payset ? payset.work_day ?? 30 : 30,
					project_bonus: project_bonus,
					full_attendance_bonus:
						bonus_with_type_list.findLast(
							(bonus_with_type) =>
								bonus_with_type.emp_no === emp_no &&
								bonus_with_type.bonus_type_name === "全勤獎金"
						)?.amount ?? 0,
				};
			})
		);
		return new_bonusFE_list;
	}
}
