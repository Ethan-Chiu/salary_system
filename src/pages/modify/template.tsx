import { Header } from "~/components/header";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "~/components/ui/button";
import { SingleParameterSettings } from "./ParameterForm";
import { attendanceSchema } from "./Schemas/schemas";
import Link from "next/link";
import { useRouter } from "next/router";
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
} from "~/components/ui/table";
import { Translate } from "../develop_parameters/utils/translation";

const Template = (props: any) => {
	const router = useRouter();

	const headerTitle = props.headerTitle;

	const queryFunction = props.queryFunction;
	const updateFunction = props.updateFunction;
	const deleteFunction = props.deleteFunction;

	const [createForm, setCreateForm] = useState(0);

	function SelectData() {
		if (queryFunction.isFetched)
			return !createForm ? (
				<>
					{queryFunction.data ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="whitespace-nowrap text-center">
										{""}
									</TableHead>
									{Object.keys(queryFunction.data[0]).map(
										(key: string) => {
											return (
												<TableHead className="whitespace-nowrap text-center">
													{Translate(key)}
												</TableHead>
											);
										}
									)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{queryFunction.data?.map(
									(data: any, index: number) => {
										return (
											<TableRow key={data.id}>
												<TableCell className="items-center">
													<LucideIcons.PenSquare
														size={18}
														className="cursor-pointer"
														onClick={() => {
															setCreateForm(
																index + 1
															);
														}}
													/>
												</TableCell>
												{Object.keys(data).map(
													(key) => {
														return (
															<TableCell className="text-center font-medium">
																{data[key]}
															</TableCell>
														);
													}
												)}
											</TableRow>
										);
									}
								)}
							</TableBody>
						</Table>
					) : (
						<></>
					)}
				</>
			) : (
				<SingleParameterSettings
					formSchema={attendanceSchema(
						queryFunction.data![createForm - 1]
					)}
					original_data={queryFunction.data![createForm - 1]}
					updateFunction={(d: any) => {
						updateFunction.mutate(d);
					}}
					deleteFunction={(d: any) => {
						deleteFunction
							? deleteFunction.mutate(d)
							: console.log("delete function not exist");
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
			<LucideIcons.ArrowLeft
				style={{ cursor: "pointer" }}
				className="hidden"
				onClick={() => {
					if(createForm)
						setCreateForm(0);
					else
						router.push("/modify");
				}}
			/>
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
