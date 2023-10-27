import { LessThan, MoreThan } from "typeorm";
import { User } from "../database/entity/user";
import * as bcrypt from "bcrypt";
import {injectable} from "tsyringe";
import { Database } from "../database/client";

@injectable()
export class UserService {
	constructor(private db: Database) {}

	async findUserByEmpId(emp_id: string) {
		const now = new Date();
		const user = await this.db.dataSource.manager.findOne(User, {
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
		const hash= await bcrypt.hash(password, salt);
		await this.db.dataSource.manager.update(User, userId, {
			hash: hash,
		});
	}
}
