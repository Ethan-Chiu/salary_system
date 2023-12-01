import { RootLayout } from "~/components/layout/root_layout";
import {
	CardFunction,
	CardFunctionIcon,
} from "~/components/functions/card_function";
import type { CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import LongHorizontalTable from "../LongHorizontalTable";
import { Button } from "~/components/ui/button";
import { SingleParameterSettings } from "../ParameterForm";
import { bankSchema } from "../Schemas/bankSchema";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from 'next/router';
import FadeLoader from "react-spinners/FadeLoader";

const container = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const stagger = {
	hidden: { opacity: 0, y: -100 },
	visible: { opacity: 1, y: 0 },
};

const Modify: NextPageWithLayout = () => {
    const router = useRouter();
	const getAllBankSetting =
		api.parameters.getAllBankSetting.useQuery();
	const updateBankSetting =
		api.parameters.updateBankSetting.useMutation({
			onSuccess: () => {
				getAllBankSetting.refetch();
			},
		});
	const deleteBankSetting = 
		api.parameters.deleteBankSetting.useMutation({
			onSuccess: () => {
				getAllBankSetting.refetch();
			}
		})

	const [createForm, setCreateForm] = useState(0);

	function SelectData() {
		if (getAllBankSetting.isFetched)
			return !createForm ? (
				<>
					<p style={{ fontSize: "20px", fontWeight: "bold" }}>
						{"All Data"}
					</p>
					{getAllBankSetting.data?.map(
						(bankData, index) => (
							<div
								style={{ cursor: "pointer" }}
								onClick={() => {
									setCreateForm(index + 1);
									console.log(bankData);
								}}
							>
								<LongHorizontalTable
									tableData={bankData}
								/>
							</div>
						)
					)}
				</>
			) : (
				<SingleParameterSettings
					formSchema={bankSchema(
						getAllBankSetting.data![createForm - 1]
					)}
					original_data={
						getAllBankSetting.data![createForm - 1]
					}
					updateFunction={(d: any) => {
						updateBankSetting.mutate(d);
					}}
					deleteFunction={(d: any) => {
						deleteBankSetting.mutate(d);
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
			<Header title="Bank Setting" showOptions className="mb-4" />
			<BackArrow />
			<SelectData />
		</>
	);


	function BackArrow() {
		return <>
			<LucideIcons.ArrowLeft
				style={{ cursor: "pointer" }}
				onClick={() => {
					if(createForm)
						setCreateForm(0);
					else
						router.push("/modify")
				}}
			/>
			<br />
			</>
	}
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

Modify.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="Bank Setting">
				{page}
			</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Modify;


