import * as bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { User } from "../database/entity/SALARY/user";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { z } from "zod";
import {
	createUserService,
	updateUserService,
} from "../api/types/parameters_input_type";

@injectable()
export class UserService {
	constructor() {}

	async createUser({
		emp_id,
		password,
		auth_l,
		start_date,
		end_date,
	}: z.infer<typeof createUserService>): Promise<User> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);

		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);

		const newUser = await User.create({
			emp_id: emp_id,
			hash: hash,
			auth_l: auth_l,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});

		return newUser;
	}

	async getUser(emp_id: string): Promise<User | null> {
		const current_date_string = get_date_string(new Date());
		const user = await User.findOne({
			where: {
				emp_id: emp_id,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
			},
		});
		return user;
	}

	async getUserList(): Promise<User[] | null> {
		const current_date_string = get_date_string(new Date());
		const user = await User.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
			},
		});
		return user;
	}

	async updateUser({
		emp_id,
		password,
		auth_l,
		start_date,
		end_date,
	}: z.infer<typeof updateUserService>): Promise<void> {
		const user = await this.getUser(emp_id!);
		if (user == null) {
			throw new BaseResponseError("User does not exist");
		}

		let hash: string | null = null;

		if (password != null) {
			const salt = await bcrypt.genSalt();
			hash = await bcrypt.hash(password, salt);
		}

		const affectedCount = await User.update(
			{
				hash: select_value(hash, user.hash),
				auth_l: select_value(auth_l, user.auth_l),
				start_date: select_value(start_date, user.start_date),
				end_date: select_value(end_date, user.end_date),
				update_by: "system",
			},
			{ where: { emp_id: emp_id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteUser(emp_id: string): Promise<void> {
		const destroyedRows = await User.destroy({
			where: { emp_id: emp_id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
