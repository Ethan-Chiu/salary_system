import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class Period {
	// id can be undefined during creation when using `autoIncrement`
	declare period_id: number;
	declare period_name: string;
	declare start_date: string;
	declare end_date: string | null;
	declare status: string;
	declare issue_date: string;
	// declare PERIOD_ID: CreationOptional<number>;
	// declare PERIOD_NAME: string;
	// declare START_DATE: Date;
	// declare END_DATE: Date | null;
	// declare STATUS: string;
	// declare ISSUE_DATE: Date;
	// declare CLOSE_START_DATE: Date;
	// declare CLOSE_END_DATE: Date;
	// declare ATTENDANCE_DATE: Date;
	// declare OVERTIME_TAX: number;
	// declare MEAL_ALLOWANCE: number;

	// timestamps!
	// createdAt can be undefined during creation
	// declare create_date: CreationOptional<Date>;
	// declare create_by: string;
	// // updatedAt can be undefined during creation
	// declare update_date: CreationOptional<Date>;
	// declare update_by: string;
	constructor(
		period_id: number,
		period_name: string,
		start_date: string,
		end_date: string | null,
		status: string,
		issue_date: string
	) {
		this.period_id = period_id;
		this.period_name = period_name;
		this.start_date = start_date;
		this.end_date = end_date;
		this.status = status;
		this.issue_date = issue_date;
	}
}
