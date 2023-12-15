import { usePathname } from "next/navigation";
import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Checkbox } from "~/components/ui/checkbox";
import { Separator } from "~/components/ui/separator";
import * as LucideIcons from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "../_app";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { type ReactElement, useState, useEffect } from "react";

import { DATA, createDATA } from "./tables/datatype";
import { BankTable, BankRow, createBankRow } from "./tables/bank_table";
import {
	ParameterTable,
	SettingItem,
	createSettingItem,
} from "./tables/parameter_table";
import { Translate } from "./utils/translation";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import FadeLoader from "react-spinners/FadeLoader";
import Multiselect from "multiselect-react-dropdown";
import * as TABLE_NAMES from "../table_names";

import { getAttendanceFunctions, getBankFunctions, getBonusSettingFunctions, getBonusDepartmentFunctions, getBonusPositionFunctions, getBonusSeniorityFunctions, getInsuranceFunctions, getBonusPositionTypeFunctions } from "./apiFunctions";
import { BonusDepartmentRow, BonusDepartmentTable } from "./tables/bonus_department"
import { BonusPositionRow, BonusPositionTable } from "./tables/bonus_position";
import { BonusSeniorityRow, BonusSeniorityTable } from "./tables/bonus_seniority";
import { BonusPositionTypeRow, BonusPositionTypeTable} from "./tables/bonus_position_type";
import { getSchema } from "../modify/Schemas/getSchema";


const API_PARAMETERS = api.parameters;

let datas: DATA[] = [
	{
		table_name: TABLE_NAMES.TABLE_ATTENDANCE,
		table_type: "typical",
		table_content: [
			createSettingItem("test1", "A", ["A", "B", "C", "D", "E"]),
			createSettingItem("test2", "X", ["X", "Y", "Z"]),
			createSettingItem("test3", "test"),
			createSettingItem("test4", 123),
			createSettingItem("test5", new Date()),
		],
	},
	{
		table_name: TABLE_NAMES.TABLE_BANK_SETTING,
		table_type: "bank",
		table_content: [], 
		// createBankRow(1, "900", "土地銀行", "001", "新竹分公司", new Date(), new Date())
	},
	{
		table_name: TABLE_NAMES.TABLE_INSURANCE,
		table_type: "typical",
		table_content: [],
	},
	{
		table_name: TABLE_NAMES.TABLE_BONUS_SETTING,
		table_type: "typical",
		table_content: []
	},
	{
		table_name: TABLE_NAMES.TABLE_BONUS_DEPARTMENT,
		table_type: "bonus_department",
		table_content: []
	},
	{
		table_name: TABLE_NAMES.TABLE_BONUS_POSITION,
		table_type: "bonus_position",
		table_content: []
	},
	{
		table_name: TABLE_NAMES.TABLE_BONUS_POSITION_TYPE,
		table_type: "bonus_position_type",
		table_content: []
	},
	{
		table_name: TABLE_NAMES.TABLE_BONUS_SENIORITY,
		table_type: "bonus_seniority",
		table_content: []
	}
];

function find_index(key: string) {
	for (var i = 0; i < datas.length; i++) {
		if (key == datas[i]!.table_name) return i;
	}
	return -1;
}

const filterModes = ["search", "select"];
function getNextFilterMode(mode: string) {
	let newIndex = filterModes.findIndex((x) => x == mode);
	if (newIndex === filterModes.length - 1) {
		newIndex = 0;
	} else newIndex += 1;
	return filterModes[newIndex];
}

const PageParameters: NextPageWithLayout = () => {
	const pathname = usePathname();
	const [single, setSingle] = useState(true);

	const [filterMode, setFilterMode] = useState("select");
	const [filterDisable, setFilterDisable] = useState(false);
	const [filterTables, setFilterTables] = useState(
		Array.from({ length: datas.length }, () => true)
	);
	const resetFilterTables = (x: boolean) => {
		setFilterTables(Array.from({ length: datas.length }, () => x));
	};
	const changeFilterTables = (name: string) => {
		setFilterTables((prev) =>
			prev.map((x, index) => {
				if (datas[index]?.table_name === name) return !x;
				return x;
			})
		);
	};

	const [parameterGlobalFilter, setParameterGlobalFilter] = useState("");

	const getAttendanceSetting = api.parameters.getCurrentAttendanceSetting.useQuery();
	const updateAttendanceSetting = (getAttendanceFunctions("update", getAttendanceSetting) as any);
	const createAttendanceSetting = (getAttendanceFunctions("create", getAttendanceSetting) as any);
	
	const getInsuranceRateSetting = api.parameters.getCurrentInsuranceRateSetting.useQuery();
	const updateInsuranceRateSetting = (getInsuranceFunctions("update", getInsuranceRateSetting) as any);
	const createInsuranceRateSetting = (getInsuranceFunctions("create", getInsuranceRateSetting) as any);


	const getBankSetting = API_PARAMETERS.getCurrentBankSetting.useQuery();
	const updateBankSetting = (getBankFunctions("update", getBankSetting) as any);
	const createBankSetting = (getBankFunctions("create", getBankSetting) as any);
	const deleteBankSetting = (getBankFunctions("delete", getBankSetting) as any);

	const getBonusSetting = api.parameters.getCurrentBonusSetting.useQuery();
	const updateBonusSetting = (getBonusSettingFunctions("update", getBonusSetting) as any);
	const createBonusSetting = (getBonusSettingFunctions("create", getBonusSetting) as any);
	const deleteBonusSetting = (getBonusSettingFunctions("delete", getBonusSetting) as any);

	const getBonusDepartment = api.parameters.getCurrentBonusDepartment.useQuery();
	const updateBonusDepartment = (getBonusDepartmentFunctions("update", getBonusDepartment) as any);
	const createBonusDepartment = (getBonusDepartmentFunctions("create", getBonusDepartment) as any);
	const deleteBonusDepartment = (getBonusDepartmentFunctions("delete", getBonusDepartment) as any);

	const getBonusPosition = api.parameters.getCurrentBonusPosition.useQuery();
	const updateBonusPosition = (getBonusPositionFunctions("update", getBonusPosition) as any);
	const createBonusPosition = (getBonusPositionFunctions("create", getBonusPosition) as any);
	const deleteBonusPosition = (getBonusPositionFunctions("delete", getBonusPosition) as any);

	const getBonusPositionType = api.parameters.getCurrentBonusPositionType.useQuery();
	const updateBonusPositionType = (getBonusPositionTypeFunctions("update", getBonusPositionType) as any);
	const createBonusPositionType = (getBonusPositionTypeFunctions("create", getBonusPositionType) as any);
	const deleteBonusPositionType = (getBonusPositionTypeFunctions("delete", getBonusPositionType) as any);

	const getBonusSeniority = api.parameters.getCurrentBonusSeniority.useQuery();
	const updateBonusSeniority = (getBonusSeniorityFunctions("update", getBonusSeniority) as any);
	const createBonusSeniority = (getBonusSeniorityFunctions("create", getBonusSeniority) as any);
	const deleteBonusSeniority = (getBonusSeniorityFunctions("delete", getBonusSeniority) as any);


	const lastMonthDate = new Date();
  	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

	const testInsertAttendanceData = () =>
		createAttendanceSetting.mutate({
			start_date: lastMonthDate,
			end_date: null,
			personal_leave_dock: 0,
			sick_leave_dock: 0,
			rate_of_unpaid_leave: 0,
			unpaid_leave_compensatory_1: 0,
			unpaid_leave_compensatory_2: 0,
			unpaid_leave_compensatory_3: 0,
			unpaid_leave_compensatory_4: 0,
			unpaid_leave_compensatory_5: 0,
			overtime_by_foreign_workers_1: 0,
			overtime_by_foreign_workers_2: 0,
			overtime_by_foreign_workers_3: 0,
			overtime_by_local_workers_1: 0,
			overtime_by_local_workers_2: 0,
			overtime_by_local_workers_3: 0,
			local_worker_holiday: 0,
			foreign_worker_holiday: 0,
		});
	
	const testInsertBonusSettingData = () => {
		createBonusSetting.mutate({
			type: "123",
			fixed_multiplier: 123,
			criterion_date: new Date(),
			base_on: "test"
		})
	}
	

	function updateDatas(
		t_name: string,
		new_content: SettingItem[] | BankRow[] | BonusDepartmentRow[] | BonusPositionRow[] | BonusSeniorityRow[] | BonusPositionTypeRow[]
	) {
		const newDatas = datas.map((data) => {
			if (data.table_name === t_name) {
				return createDATA(
					data.table_name,
					data.table_type,
					new_content
				);
			}
			return data;
		});
		datas = newDatas;
	}
	

	function start_condition(l: any) {
		let condition = true;
		l.map((x: boolean) => (condition = condition && x));
		return condition;
	}

	if (
		start_condition([
			getBankSetting.isFetched,
			getAttendanceSetting.isFetched,
			getInsuranceRateSetting.isFetched,
			getBonusSetting.isFetched,
			getBonusDepartment.isFetched,
			getBonusPosition.isFetched,
			getBonusSeniority.isFetched,
		])
	) {	// updateAllDatas

		console.log(getBankSetting.data)
		updateDatas(
			TABLE_NAMES.TABLE_BANK_SETTING,
			(getBankSetting.data ?? []).map((bank: any) => {
				return {
					id: bank.id,
					bank_code: bank.bank_code,
					bank_name: bank.bank_name,
					org_code: bank.org_code,
					org_name: bank.org_name,
					start_date: new Date(bank.start_date),
					end_date: (bank.end_date !== null) ? new Date(bank.end_date): null,
				};
			})
		);

		console.log(getAttendanceSetting.data);
		updateDatas(
			TABLE_NAMES.TABLE_ATTENDANCE,
			Object.keys(getAttendanceSetting.data ?? {}).map((key) => {
				return {
					name: key as string,
					value:
						(key.includes("_date") || key.includes("At"))
							? 
							(
								((getAttendanceSetting.data as any)[key]) ? new Date((getAttendanceSetting.data as any)[key]) : null
							)
							: (getAttendanceSetting.data as any)[key],
				};
			})
		);

		console.log(getInsuranceRateSetting.data);
		updateDatas(
			TABLE_NAMES.TABLE_INSURANCE,
			Object.keys(getInsuranceRateSetting.data ?? {}).map((key) => {
				return {
					name: key as string,
					value:
						(key.includes("_date") || key.includes("At"))
							? 
							(
								((getInsuranceRateSetting.data as any)[key]) ? new Date((getAttendanceSetting.data as any)[key]) : null
							)
							: (getInsuranceRateSetting.data as any)[key],
				};
			})
		);


		console.log(getBonusSetting.data);
		updateDatas(
			TABLE_NAMES.TABLE_BONUS_SETTING,
			Object.keys(getBonusSetting.data ?? {}).map((key) => {
				return {
					name: key as string,
					value:
						(key.includes("_date") || key.includes("At"))
							? 
							(
								((getBonusSetting.data as any)[key]) ? new Date((getBonusSetting.data as any)[key]) : null
							)
							: (getBonusSetting.data as any)[key],
				};
			})
		);
		
		updateDatas(
			TABLE_NAMES.TABLE_BONUS_DEPARTMENT,
			(getBonusDepartment.data ?? []).map((bonusDepartment: any) => {
				return {
					id: bonusDepartment.id,
					department: bonusDepartment.department,
					multiplier: bonusDepartment.multiplier,
				};
			})
		);

		updateDatas(
			TABLE_NAMES.TABLE_BONUS_POSITION,
			(getBonusPosition.data ?? []).map((bonusPosition: any) => {
				return {
					id: bonusPosition.id,
					position: bonusPosition.position,
					multiplier: bonusPosition.multiplier,
				};
			})
		);
		
		updateDatas(
			TABLE_NAMES.TABLE_BONUS_POSITION_TYPE,
			(getBonusPositionType.data ?? []).map((bonusPositionType: any) => {
				return {
					id: bonusPositionType.id,
					position_type: bonusPositionType.position_type,
					multiplier: bonusPositionType.multiplier,
				};
			})
		);

		updateDatas(
			TABLE_NAMES.TABLE_BONUS_SENIORITY,
			(getBonusSeniority.data ?? []).map((bonusSeniority: any) => {
				return {
					id: bonusSeniority.id,
					seniority: bonusSeniority.seniority,
					multiplier: bonusSeniority.multiplier,
				};
			})
		);



		return HTMLElement();
	} else {
		const loaderStyle = {display: "flex",justifyContent: "center",alignItems: "center",height: "70vh",};
		return (
			<>
				<Header title="parameters" showOptions />
				<div style={loaderStyle}>
					<FadeLoader color="#000000" />
				</div>
			</>
		);
	}

	function HTMLElement() {
		return (
			<>
				{/* header */}
				<Header title="parameters" showOptions />

				{/* <div className="flex items-center py-6"> */}
				<div className="grid grid-cols-7 items-center gap-4 py-4">
					{filterMode === "search" ? (
						<div className="col-span-4 text-center">
							<Input
								placeholder="Filter tables"
								disabled={filterDisable}
								onChange={(event) => {
									const newFilterTables = datas.map(
										(data) => {
											return data.table_name.includes(
												event.target.value
											);
										}
									);
									setFilterTables(newFilterTables);
								}}
							/>
						</div>
					) : (
						<div
							className="col-span-4 text-center"
							title={
								filterDisable
									? "The table filter is disabled because the parameter filter is currently using"
									: ""
							}
						>
							<Multiselect
								disable={filterDisable}
								isObject={false}
								showCheckbox
								onKeyPressFn={function noRefCheck() {}}
								onRemove={(selectedList, removedItem) =>
									changeFilterTables(removedItem)
								}
								onSearch={() => {}}
								onSelect={(selectedList, selectedItem) => {
									changeFilterTables(selectedItem);
								}}
								selectedValues={datas
									.map((data, index) => {
										if (filterTables[index] === true) {
											return data.table_name;
										}
									})
									.filter((x) => x)}
								options={datas.map((data) => data.table_name)}
								style={multiselect_style}
							/>
						</div>
					)}
					<LucideIcons.ArrowUpDown
						className="ml-2 h-5 w-5 cursor-pointer hover:text-gray-500"
						onClick={() => {
							setFilterMode((x) => getNextFilterMode(x) ?? "");
							resetFilterTables(true);
						}}
					/>
					<div className="col-span-2 text-center">
						<Input
							placeholder="Find Parameter"
							onChange={(e) => {
								if (e.target.value !== "") {
									setFilterDisable(true);
									resetFilterTables(true);
								} else setFilterDisable(false);
								setParameterGlobalFilter(e.target.value);
							}}
						/>
					</div>
				</div>

				<Accordion
					type={single ? "single" : "multiple"}
					collapsible
					className="w-full"
				>
					{datas.map((data, index) => {
						if (!filterTables[index]) return <></>;
						switch (data.table_name) {
							case TABLE_NAMES.TABLE_ATTENDANCE:	return (
								<ParameterTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									globalFilter={parameterGlobalFilter}
									updateFunction = {(d:any) => {
										updateAttendanceSetting.mutate(d)
									}}
									createFunction = {(d:any) => {
										createAttendanceSetting.mutate(d)
									}}
								/>
							);
							case TABLE_NAMES.TABLE_BONUS_SETTING:	return (
								<ParameterTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									globalFilter={parameterGlobalFilter}
									updateFunction = {(d:any) => {
										updateBonusSetting.mutate(d)
									}}
									createFunction = {(d:any) => {
										createBonusSetting.mutate(d)
									}}
								/>
							);
							case TABLE_NAMES.TABLE_INSURANCE:	return (
								<ParameterTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									globalFilter={parameterGlobalFilter}
									updateFunction = {(d:any) => {
										updateInsuranceRateSetting.mutate(d)
									}}
									createFunction = {(d:any) => {
										createInsuranceRateSetting.mutate(d)
									}}
								/>
							);
							case TABLE_NAMES.TABLE_BONUS_DEPARTMENT:	return (
								<BonusDepartmentTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									updateFunction={(d: any) => {
										updateBonusDepartment.mutate(d);
									}}
									createFunction={(d: any) => {
										createBonusDepartment.mutate(d);
									}}
									deleteFunction={(d: any) => {
										deleteBonusDepartment.mutate(d);
										getBonusDepartment.refetch();
									}}
								/>
							)
							case TABLE_NAMES.TABLE_BONUS_POSITION:	return (
								<BonusPositionTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									updateFunction={(d: any) => {
										updateBonusPosition.mutate(d);
									}}
									createFunction={(d: any) => {
										createBonusPosition.mutate(d);
									}}
									deleteFunction={(d: any) => {
										deleteBonusPosition.mutate(d);
										getBonusPosition.refetch();
									}}
								/>
							)
							case TABLE_NAMES.TABLE_BONUS_POSITION_TYPE:	return (
								<BonusPositionTypeTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									updateFunction={(d: any) => {
										updateBonusPositionType.mutate(d);
									}}
									createFunction={(d: any) => {
										createBonusPositionType.mutate(d);
									}}
									deleteFunction={(d: any) => {
										deleteBonusPositionType.mutate(d);
										getBonusPositionType.refetch();
									}}
								/>
							)
							case TABLE_NAMES.TABLE_BONUS_SENIORITY:	return (
								<BonusSeniorityTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									updateFunction={(d: any) => {
										updateBonusSeniority.mutate(d);
									}}
									createFunction={(d: any) => {
										createBonusSeniority.mutate(d);
									}}
									deleteFunction={(d: any) => {
										deleteBonusSeniority.mutate(d);
										getBonusSeniority.refetch();
									}}
								/>
							)
							case TABLE_NAMES.TABLE_BANK_SETTING:	return (
								<BankTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									updateBankSetting={(d: any) => {
										updateBankSetting.mutate(d);
									}}
									createBankSetting={(d: any) => {
										createBankSetting.mutate(d);
									}}
									deleteBankSetting={(d: any) => {
										deleteBankSetting.mutate(d);
										getBankSetting.refetch();
									}}
								/>
							);
							
							default: return <></>
						}
					})}
				</Accordion>
				{/* <Button onClick={() => testInsertAttendanceData()}>
					Insert AttendanceDate
				</Button>
				<br/>
				<Button onClick={() => testInsertBonusSettingData()}>
					Insert Bonus Setting
				</Button> */}
				<br/>
			</>
		);
	}
};

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParameters;

const multiselect_style = {
	
	multiselectContainer: {
		width: "100%",
		align: "center",
	},
	searchBox: {
		// flex: "1",
		height: "100%",
		width: "100%",
		borderRadius: "0.375rem",
		border: "1px solid #CCCCCC",
		padding: "0.25rem 0.5rem",
		fontSize: "0.875rem",
		// display: "flex",
		align: "center",
	},
	optionContainer: {
		// display: "flex",
		alignItems: "center",
		maxHight: "80px",
	},
	chips: {
		height: "15px", // Set your desired height for the selected options
		// display: "flex", // Center vertically
		alignItems: "center", // Center vertically
		marginTop: "4px", // Add space at the top
		background: "#808080",
	},
	checkbox: {
		backgroundColor: "#808080",
	},
	option: {
		cursor: "pointer",
		transition: "background-color 1s", // Add a smooth transition effect
		// Set the default background color for options
		backgroundColor: "#ffffff",
		color: "#000000",
	},
};
