import { Header } from "~/components/header";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "~/components/ui/button";
import { ParameterForm } from "./ParameterForm";
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
import { getSchema } from "./Schemas/schemas";

const Template = (props: any) => {
	const router = useRouter();

	const headerTitle = props.headerTitle;

	const queryFunction = props.queryFunction;
	const updateFunction = props.updateFunction;
	const deleteFunction = props.deleteFunction;
	const createFunction = props.createFunction;

	const [createForm, setCreateForm] = useState(0);

	const ViewAllDatas = () => {
		return (
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
											{Object.keys(data).map((key) => {
												return (
													<TableCell className="text-center font-medium">
														{data[key]}
													</TableCell>
												);
											})}
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
		);
	};

	const UpdateData = () => {
		return (
			<ParameterForm
				mode = {"update"}
				formSchema={getSchema(props.table_name)!("update")}
				original_data={queryFunction.data![createForm - 1]}
				updateFunction={(d: any) => {
					updateFunction
						? updateFunction.mutate(d)
						: console.log("update function not exist");
				}}
				deleteFunction={(d: any) => {
					deleteFunction
						? deleteFunction.mutate(d)
						: console.log("delete function not exist");
				}}
				returnPage={(n: number) => {
					setCreateForm(n);
				}}
			/>
		);
	};

	const CreateData = () => {
		return (
			<ParameterForm
				mode={"create"}
				formSchema={getSchema(props.table_name)!("create")}
				createFunction={(d: any) => {
					createFunction
						? createFunction.mutate(d)
						: console.log("create function not exist");
				}}
				returnPage={(n: number) => {
					setCreateForm(n);
				}}
			/>
		);
	};

	function SelectData() {
		if (queryFunction.isFetched)
			return (
				<>
					{createForm === 0 && <ViewAllDatas />}
					{createForm === -1 && <CreateData />}
					{createForm > 0 && <UpdateData />}
				</>
			);
		return <Loader></Loader>;
	}

	return (
		<>
			<Header title={headerTitle} showOptions className="mb-4" />
			<div className="grid grid-cols-5">
				<Button
					onClick={() => {
						if (createForm) setCreateForm(0);
						else router.push("/modify");
					}}
					className={createForm ? "hidden" : ""}
					disabled={false}
					variant={"ghost"}
				>
					{Translate("previous_page")}
				</Button>
				<Button
					onClick={() => {
						setCreateForm(-1);
					}}
					className={createForm !== 0 ? "hidden" : "col-start-5"}
					disabled={false}
					variant={"ghost"}
				>
					{Translate("create")}
				</Button>
			</div>
			<br />
			<SelectData />
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
