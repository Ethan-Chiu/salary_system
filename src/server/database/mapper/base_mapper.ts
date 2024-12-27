import { type ZodTypeDef, type ZodType } from "zod";
import { deleteProperties } from "./helper_function";
import { type Model, type CreationAttributes } from "sequelize";

export class BaseMapper<
	EncOutput_DB extends Model,
	DecOutput extends object,
	EncInput,
	DecInput
> {
	constructor(
		private name: string,
		private encoder: ZodType<
			CreationAttributes<EncOutput_DB>,
			ZodTypeDef,
			EncInput
		>,
		private decoder: ZodType<DecOutput, ZodTypeDef, DecInput>,
		private deleteProperties: string[] = []
	) {}

	async encode(data: EncInput): Promise<CreationAttributes<EncOutput_DB>> {
		const encoded_result = this.encoder.safeParse(data);

		if (!encoded_result.success) {
			throw new Error(
				`Parse failed in Mapper: ${this.name}, Error: ${encoded_result.error.message}`
			);
		}

		return encoded_result.data;
	}

	async decode(data: DecInput | null): Promise<DecOutput> {
    if (!data) {
      throw new Error(`Decoding null data in Mapper: ${this.name}`);
    }

		const decoded_result = this.decoder.safeParse(data);

		if (!decoded_result.success) {
			throw new Error(
				`Parse failed in Mapper: ${this.name}, Error: ${decoded_result.error.message}`
			);
		}

		return deleteProperties(decoded_result.data, this.deleteProperties);
	}

	async decodeList(dataList: DecInput[]): Promise<DecOutput[]> {
		const decoded = await Promise.all(
			dataList.map(async (e) => this.decode(e))
		);
		return decoded;
	}
}
