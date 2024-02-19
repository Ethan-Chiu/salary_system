import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class EmployeeData extends Model<
	InferAttributes<EmployeeData>,
	InferCreationAttributes<EmployeeData>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare emp_name: string;
    declare position: number;
    declare position_type: string;
    declare ginsurance_type: string;
    declare u_dep: string;
    declare work_type: string;
    declare work_status: string;
    declare accesible: boolean | null;
    declare sex_type: string;
    declare dependents: number;
    declare healthcare: number;
    declare registration_date: string;
    declare quit_date: string | null;
    declare licens_id: string | null;
    declare nbanknumber: string;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

EmployeeData.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        emp_no: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        emp_name: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        work_type: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        work_status: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        accesible: {
            type: DataTypes.BOOLEAN,
        },
        u_dep: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        position: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
        position_type: {
            type: DataTypes.STRING(2),
			allowNull: false,
        },
        sex_type: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        ginsurance_type: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        dependents: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        healthcare: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        registration_date: {
			type: DataTypes.STRING(32),
			allowNull: false,
		},
        nbanknumber: {
            type: DataTypes.STRING(32),
        },
        quit_date:{
            type: DataTypes.STRING(32),
			allowNull: true,
        },
        licens_id:{
            type: DataTypes.STRING(32),
        },
		create_date: {
			type: DataTypes.DATE,
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		update_date: {
			type: DataTypes.DATE,
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "U_EMPLOYEE_DATA",
        createdAt: 'create_date',
		updatedAt: 'update_date',
	}
)