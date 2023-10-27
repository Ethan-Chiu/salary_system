import * as bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { Database } from "../database/client";
import { User } from "../database/entity/user";
import { Op } from "sequelize";

@injectable()
export class UserService {
	constructor(private db: Database) {}

	async findUserByEmpId(emp_id: string): Promise<User | null> {
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

	async updateHash(userId: number, password: string): Promise<void> {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);

		const affectedCount = await User.update(
			{ hash: hash },
			{ where: { id: userId } }
		);
		if (affectedCount[0] != 1) {
			// handle error
		}
	}
}
