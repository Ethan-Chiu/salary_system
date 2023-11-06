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
import { type ReactElement, useState, useEffect, } from "react";

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
import * as TABLE_NAMES from "./table_names"

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
			createSettingItem("create_by", new Date()),
			createSettingItem("test1", "A", ["A", "B", "C", "D", "E"]),
			createSettingItem("test2", "X", ["X", "Y", "Z"]),
			createSettingItem("test3", "test"),
			createSettingItem("test4", 123),
			createSettingItem("test5", new Date()),
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
		table_content: [
			createBankRow(1, "900", "土地銀行", "001", "新竹分公司", new Date(), new Date())
		],
	},
	{
		table_name: TABLE_NAMES.TABLE_INSURANCE,
		table_type: "typical",
		table_content: [
			createSettingItem("test1", "A", ["A", "B", "C", "D", "E"]),
			createSettingItem("test2", "test"),
			createSettingItem("test3", "X", ["X", "Y", "Z"]),
			createSettingItem("test4", 123),
			createSettingItem("勞健保測試", new Date()),
			createSettingItem("create_by", new Date()),
		],
	},
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

	const getBankSetting = API_PARAMETERS.getBankSetting.useQuery();
	const updateBankSetting = api.parameters.updateBankSetting.useMutation({
		onSuccess: () => {
			getBankSetting.refetch();
		},
	});
	const createBankSetting = api.parameters.createBankSetting.useMutation({
		onSuccess: () => {
			getBankSetting.refetch();
		},
	});
	const deleteBankSetting = api.parameters.deleteBankSetting.useMutation({
		onSuccess: () => {
			getBankSetting.refetch();
		},
	});

	// const attendanceData = API_PARAMETERS.attendanceGetData.useQuery();
	// const insuranceData = API_PARAMETERS.insuranceGetData.useQuery();

	function updateDatas(
		t_name: string,
		new_content: SettingItem[] | BankRow[]
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

	if (
		true
		// attendanceData.isFetched &&
		// getBankSetting.isFetched
		// insuranceData.isFetched
	) {
		// updateDatas("請假加班", Object.keys(attendanceData.data ?? {}).map((key) => { return { name: (Translate(key) as string),value: ((attendanceData.data as any)[key]==null?"NULL":(attendanceData.data as any)[key]) }; }));
		// console.log((getBankSetting.data ?? []).map((bank: any) => {return {id:	bank.id,bank_code: bank.bank_code,bank_name: bank.bank_name,org_code: bank.org_code,org_name: bank.org_name,start_date: new Date(bank.start_date), end_date: new Date(bank.end_date)};}))
		// updateDatas("銀行", (getBankSetting.data ?? []).map((bank: any) => {return {id:	bank.id,bank_code: bank.bank_code,bank_name: bank.bank_name,org_code: bank.org_code,org_name: bank.org_name,start_date:bank.start_date,end_date:bank.end_date};}))
		return HTMLElement();
	} else {
		const loaderStyle = {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "70vh",
		};
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
						<div className="col-span-4 text-center" title={filterDisable?"The table filter is disabled because the parameter filter is currently using":""}>
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
						<Input placeholder="Find Parameter" onChange={
							(e) => {
								if(e.target.value!=="")	{
									setFilterDisable(true)
									resetFilterTables(true);
								}
								else	setFilterDisable(false);
								setParameterGlobalFilter(e.target.value);
							}
						}/>
					</div>
				</div>

				<Accordion
					type={single ? "single" : "multiple"}
					collapsible
					className="w-full"
				>
					{datas.map((data, index) => {
						if (!filterTables[index]) return <></>;
						if (data.table_type == "typical") {
							if(data.table_content.map((x, index) => {
								return x.name.toLowerCase().includes(parameterGlobalFilter.toLowerCase());
							}).filter(x => x).length === 0)	return <></>
							const parameterTable = (
								<ParameterTable
									defaultData={data.table_content}
									table_name={data.table_name}
									table_type={data.table_type}
									index={find_index(data.table_name)}
									globalFilter={parameterGlobalFilter}
								/>
							);
							return parameterTable;
						} else if (data.table_type == "bank") {
							const bankTable = (
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
									}}
								/>
							);
							return bankTable;
						}
					})}
				</Accordion>
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
		flex: "1",
		height: "100%",
		width: "100%",
		borderRadius: "0.375rem",
		border: "1px solid #CCCCCC",
		padding: "0.25rem 0.5rem",
		fontSize: "0.875rem",
		display: "flex",
		align: 'center',
	},
	optionContainer: {
		// display: "flex",
		alignItems: "center",
		maxHight: "80px",
	},
	chips: {
		height: '15px', // Set your desired height for the selected options
		display: 'flex', // Center vertically
		alignItems: 'center', // Center vertically
		marginTop: '4px', // Add space at the top
		background: "#808080"
	},
	checkbox: {
		backgroundColor: "#808080"
	},
	option: {
		cursor: 'pointer',
		transition: 'background-color 1s', // Add a smooth transition effect
		// Set the default background color for options
		backgroundColor: '#ffffff',
		color: "#000000",
	}
}
