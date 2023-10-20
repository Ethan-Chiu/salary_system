import { LessThan, MoreThan } from "typeorm";
import { dataSource } from "../database/client";
import { User } from "../database/entity/user";
import bcrypt from "bcrypt";

export class UserService {
	async findUserByEmpId(emp_id: string) {
		const now = new Date();
		const user = await dataSource.manager.findOne(User, {
			where: {
				emp_id: emp_id,
				start_date: LessThan(now),
				end_date: MoreThan(now) || undefined,
			},
		});
		return user;
	}

	async updateHash(userId: number, password: string) {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		await dataSource.manager.update(User, userId, {
			hash: hash,
		});
	}
}
