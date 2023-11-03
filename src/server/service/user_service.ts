import * as bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { User } from "../database/entity/user";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";

@injectable()
export class UserService {
	constructor() {}

	async createUser(
		emp_id: string,
		password: string,
		auth_level: number,
		start_date: Date | null,
		end_date: Date | null
	): Promise<User> {
		const now = new Date();
		check_date(start_date, end_date, now);

		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);

		const newUser = await User.create({
			emp_id: emp_id,
			hash: hash,
			auth_level: auth_level,
			start_date: start_date ?? now,
			end_date: end_date,
			create_date: now,
			create_by: "system",
			update_date: now,
			update_by: "system",
		});

		return newUser;
	}

	async getUser(emp_id: string): Promise<User | null> {
		const now = new Date();
		const user = await User.findOne({
			where: {
				emp_id: emp_id,
				start_date: {
					[Op.lt]: now,
				},
				end_date: {
					[Op.or]: [{ [Op.gt]: now }, { [Op.eq]: null }],
				},
			},
		});
		return user;
	}

	async getUserList(): Promise<User[] | null> {
		const now = new Date();
		const user = await User.findAll({
			where: {
				start_date: {
					[Op.lt]: now,
				},
				end_date: {
					[Op.or]: [{ [Op.gt]: now }, { [Op.eq]: null }],
				},
			},
		});
		return user;
	}

	async updateUser(
		emp_id: string,
		password: string | null = null,
		auth_level: number | null = null,
		start_date: Date | null = null,
		end_date: Date | null = null
	): Promise<void> {
		const user = await this.getUser(emp_id);
		if (user == null) {
			throw new BaseResponseError("User does not exist");
		}

		let hash: string | null = null;

		if (password != null) {
			const salt = await bcrypt.genSalt();
			hash = await bcrypt.hash(password, salt);
		}

		const now = new Date();
		const affectedCount = await User.update(
			{
				hash: hash ?? user.hash,
				auth_level: auth_level ?? user.auth_level,
				start_date: start_date ?? user.start_date,
				end_date: end_date ?? user.end_date,
				update_date: now,
				update_by: "system",
			},
			{ where: { emp_id: emp_id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteUser(emp_id: string): Promise<void> {
		const now = new Date();
		this.updateUser(emp_id, null, null, null, now);
	}
}
