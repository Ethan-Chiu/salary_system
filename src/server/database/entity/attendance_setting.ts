import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseMeta } from "./utils/base_meta";

@Entity("U_ATTENDANCE_SETTING")
export class AttendanceSetting extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("float")
	personal_leave_dock: number;

	@Column("float")
	sick_leave_dock: number;

	@Column("float")
	rate_of_unpaid_leave: number;

	@Column("float")
	unpaid_leave_compensatory_1: number;

	@Column("float")
	unpaid_leave_compensatory_2: number;

	@Column("float")
	unpaid_leave_compensatory_3: number;

	@Column("float")
	unpaid_leave_compensatory_4: number;

	@Column("float")
	unpaid_leave_compensatory_5: number;

	@Column("float")
	overtime_by_local_workers_1: number;

	@Column("float")
	overtime_by_local_workers_2: number;

	@Column("float")
	overtime_by_local_workers_3: number;

	@Column("float")
	local_worker_holiday: number;

	@Column("float")
	overtime_by_foreign_workers_1: number;

	@Column("float")
	overtime_by_foreign_workers_2: number;

	@Column("float")
	overtime_by_foreign_workers_3: number;

	@Column("float")
	foreign_worker_holiday: number;

	@Column("date")
	start_date: Date;

	@Column("date", { nullable: true })
	end_date?: Date | null;
}
