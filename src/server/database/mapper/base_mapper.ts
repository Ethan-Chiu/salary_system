import { injectable } from "tsyringe";
import { type ZodType, type z } from "zod";
import { deleteProperties } from "./helper_function";
import { type Model, type CreationAttributes } from "sequelize";

@injectable()
export class BaseMapper<DB extends Model, DEC extends object> {
	constructor(
		private encoder: ZodType<CreationAttributes<DB>>,
		private decoder: ZodType<DEC>,
		private deleteProperties: string[] = []
	) {}

	async encode(
		data: z.input<typeof this.encoder>
	): Promise<CreationAttributes<DB>> {
		const encoded = this.encoder.parse(data);

		return encoded;
	}

	async decode(data: z.input<typeof this.decoder>): Promise<DEC> {
		const decoded = this.decoder.parse(data);

		return deleteProperties(decoded, this.deleteProperties);
	}

	async decodeList(dataList: z.input<typeof this.decoder>[]): Promise<DEC[]> {
		const decoded = await Promise.all(
			dataList.map(async (e) => this.decode(e))
		);
		return decoded;
	}
}
