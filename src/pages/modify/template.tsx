import { Header } from "~/components/header";
import * as TABLE_NAMES from "../table_names";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import LongHorizontalTable from "./LongHorizontalTable";
import { Button } from "~/components/ui/button";
import { SingleParameterSettings } from "./ParameterForm";
import { attendanceConfig, attendanceSchema } from "./Schemas/attendanceSchema";
import Link from "next/link";
import { useRouter } from 'next/router';
import FadeLoader from "react-spinners/FadeLoader";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
  } from "~/components/ui/table"
import { Translate } from "../develop_parameters/utils/translation";



const Template = (props: any) => {
    const router = useRouter();

    const headerTitle = props.headerTitle

    const queryFunction = props.queryFunction;
    const updateFunction = props.updateFunction;
    const deleteFunction = props.deleteFunction;

	const [createForm, setCreateForm] = useState(0);

	function SelectData() {
		if (queryFunction.isFetched)
			return !createForm ? (
				<>
					{/* <p style={{ fontSize: "20px", fontWeight: "bold" }}>
						{"All Data"}
					</p> */}
					{(queryFunction.data)?
						<Table>
						<TableHeader>
						  <TableRow>
						  	<TableHead className="whitespace-nowrap text-center">{""}</TableHead>	
						  	{Object.keys(queryFunction.data[0]).map((key: string) => {
								return <TableHead className="whitespace-nowrap text-center">{Translate(key)}</TableHead>	
							})}
						  </TableRow>
						</TableHeader>
						<TableBody>
						  {queryFunction.data?.map((data: any, index: number) => {
							return <TableRow key={data.id} >
								<TableCell className="items-center">
									<LucideIcons.PenSquare size={18} className="cursor-pointer" onClick={() => {setCreateForm(index+1)}}/>
								</TableCell>
								{Object.keys(data).map(key => {
									return <TableCell className="font-medium text-center">{data[key]}</TableCell>
								})}
							</TableRow>
						  })}
						</TableBody>
						{/* <TableFooter>
						  <TableRow>
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">$2,500.00</TableCell>
						  </TableRow>
						</TableFooter> */}
					  </Table>:
					<></>
					}
				</>
			) : (
				<SingleParameterSettings
					formSchema={attendanceSchema(
						queryFunction.data![createForm - 1]
					)}
					formConfig={
						attendanceConfig(
							queryFunction.data![createForm - 1]
					)}
					original_data={
						queryFunction.data![createForm - 1]
					}
					updateFunction={(d: any) => {
						updateFunction.mutate(d);
					}}
                    deleteFunction={(d: any) => {
                        (deleteFunction) ? deleteFunction.mutate(d) : console.log("delete function not exist");
                    }}
					returnPage={(n: number) => {
						setCreateForm(0);
					}}
				/>
			);
		return <Loader></Loader>;
	}

	return (
		<>
			<Header title={headerTitle} showOptions className="mb-4" />
			{/* <LucideIcons.ArrowLeft
				style={{ cursor: "pointer" }}
				onClick={() => {
					if(createForm)
						setCreateForm(0);
					else
						router.push("/modify");
				}}
			/> */}
			<br />
			<SelectData />
			<br />
			<br />
			<br />
		</>
	);
};

function Loader() {
	const loaderStyle = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "70vh",
	};
	return (
		<>
			<div style={loaderStyle}>
				<FadeLoader color="#000000" />
			</div>
		</>
	);
}

export default Template;