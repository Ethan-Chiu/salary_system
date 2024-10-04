// import {
// 	DataTypes,
// 	Model,
// 	type InferAttributes,
// 	type InferCreationAttributes,
// 	type CreationOptional,
// 	Sequelize,
// } from "sequelize";
// export class EmployeeDataMut extends Model<
// 	InferAttributes<EmployeeDataMut>,
// 	InferCreationAttributes<EmployeeDataMut>
// > {
// 	// id can be undefined during creation when using `autoIncrement`
// 	declare id: CreationOptional<number>;
// 	declare emp_no: string;
// 	declare trust_date: string;
//     declare start_date: string;
//     declare end_date: string | null;
// 	// timestamps!
// 	// createdAt can be undefined during creation
// 	declare create_date: CreationOptional<Date>;
// 	declare create_by: string;
// 	// updatedAt can be undefined during creation
// 	declare update_date: CreationOptional<Date>;
// 	declare update_by: string;
// }

// export function initEmployeeDataMut(sequelize: Sequelize) {
// 	EmployeeDataMut.init(
// 		{
// 			id: {
// 				type: DataTypes.INTEGER.UNSIGNED,
// 				autoIncrement: true,
// 				primaryKey: true,
// 			},
// 			emp_no: {
// 				type: DataTypes.STRING(32),
// 				allowNull: false,
// 			},
// 			trust_date:{
//                 type: DataTypes.STRING(128),
//                 allowNull: false,
//             },
//             start_date: {
// 				type: DataTypes.STRING(128),
// 				allowNull: false,
// 			},
// 			end_date: {
// 				type: DataTypes.STRING(128),
// 				allowNull: true,
// 			},
// 			create_date: {
// 				type: DataTypes.DATE,
// 			},
// 			create_by: {
// 				type: DataTypes.STRING(128),
// 				allowNull: false,
// 			},
// 			update_date: {
// 				type: DataTypes.DATE,
// 			},
// 			update_by: {
// 				type: DataTypes.STRING(128),
// 				allowNull: false,
// 			},
// 		},
// 		{
// 			sequelize,
// 			tableName: "U_EMPLOYEE_DATA_MUT",
// 			createdAt: "create_date",
// 			updatedAt: "update_date",
// 		}
// 	);
// }