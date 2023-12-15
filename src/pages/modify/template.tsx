import { Header } from "~/components/header";
import * as TABLE_NAMES from "../table_names";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import LongHorizontalTable from "./LongHorizontalTable";
import { Button } from "~/components/ui/button";
import { SingleParameterSettings } from "./ParameterForm";
import { attendanceSchema } from "./Schemas/attendanceSchema";
import Link from "next/link";
import { useRouter } from 'next/router';
import FadeLoader from "react-spinners/FadeLoader";

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
					<p style={{ fontSize: "20px", fontWeight: "bold" }}>
						{"All Data"}
					</p>
					{queryFunction.data?.map(
						(anyData: any, index: number) => (
							<div
								style={{ cursor: "pointer" }}
								onClick={() => {
									setCreateForm(index + 1);
									console.log(anyData);
								}}
							>
								<LongHorizontalTable
									tableData={anyData}
								/>
							</div>
						)
					)}
				</>
			) : (
				<SingleParameterSettings
					formSchema={attendanceSchema(
						queryFunction.data![createForm - 1],
						false
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
			<LucideIcons.ArrowLeft
				style={{ cursor: "pointer" }}
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