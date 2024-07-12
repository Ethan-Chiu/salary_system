export class BonusType {
	// id can be undefined during creation when using `autoIncrement`
	declare id?: number;
	declare name?: string;
	constructor(
        id?: number,
        name?: string
	) {
        this.id = id
        this.name = name
	}
	static fromDB(data: any): BonusType {
		const {
           ID,
           NAME
		} = data;

		return new BonusType(
			ID,
            NAME
		);
	}
}
