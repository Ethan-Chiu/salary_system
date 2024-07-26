import { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { OvertimeTable } from "./test_overtime";
import { LIDTable } from "./test_LIdeduction";
import { Separator } from "~/components/ui/separator";
import { HIDTable } from "./test_HIdeduction";
import { GSTable } from "./test_GrossSalary";
import { LDTable } from "./test_LeaveDeduction";
import { GIDTable } from "./test_GroupInsuranceDeduction";

import { OvertimeTable as EHR_OT } from "./tables/overtime_table";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { FATable } from "./test_FullAttendance";

export function SelectTable(props: { updateStateFunction: Function }) {
	return (
		<div className="m-4">
			<Select onValueChange={(value) => props.updateStateFunction(value)}>
				<SelectTrigger className="w-[180px]">
					<SelectValue defaultValue={"OT"} placeholder={"加班費"}/>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Table</SelectLabel>
						<SelectItem value="OT">加班費</SelectItem>
						<SelectItem value="LID">勞保扣除額</SelectItem>
						<SelectItem value="HID">健保扣除額</SelectItem>
						<SelectItem value="GS">應發底薪</SelectItem>
						<SelectItem value="LD">請假扣款</SelectItem>
						<SelectItem value="FA">全勤獎金</SelectItem>
						<SelectItem value="GID">團保費代扣</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

export function SelectEMP(props: { updateStateFunction: Function }) {
	return (
		<div className="m-4">
			<Select onValueChange={(value) => props.updateStateFunction(value)}>
				<SelectTrigger className="w-[180px]">
					<SelectValue defaultValue={"F103007"} placeholder={"F103007"}/>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>員工</SelectLabel>
						<SelectItem value="F103007">F103007</SelectItem>
						<SelectItem value="U094001">U094001</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

const TEST: NextPageWithLayout = () => {
	// const EMP = "F103007";
	const [EMP, setEMP] = useState("F103007");
	const [chosenTable, setChosenTable] = useState("OT");
	return (
		<>
			<Header title={"TEST"} showOptions />
			<div className="m-4 flex">
				<SelectTable updateStateFunction={setChosenTable} />
				<SelectEMP updateStateFunction={setEMP} />
			</div>
			<div className="m-6">
			{chosenTable === "OT" ? (
				<OvertimeTable EMP={EMP}  />
			) : chosenTable === "LID" ? (
				<LIDTable EMP={EMP}  />
			) : chosenTable === "HID" ? (
				<HIDTable EMP={EMP} />
			) : chosenTable === "GS" ? (
				<GSTable EMP={EMP} />
			) : chosenTable === "LD" ? (
				<LDTable EMP={EMP} period={113} />
			) : chosenTable === "FA" ? (
				<FATable EMP={EMP} period={113} />	
			) : chosenTable === "GID" ? (
				<GIDTable EMP={EMP} period={113} />	
			) : (
				<></>
			)}
			</div>
			
			{/* <EHR_OT period={113} emp_no_list={["F103007"]}/> */}

			{/* <OvertimeTable />
		<Separator />

		<LIDTable />
		<Separator />

		<HIDTable EMP = {EMP}/>
		<Separator />

		<GSTable EMP = {EMP}/>
		<Separator />

		<LDTable EMP = {EMP} period = {113} />
		<Separator /> */}
		</>
	);
};

TEST.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="Test">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TEST;
