import * as z from "zod";
import { Button } from "~/components/ui/button";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";
import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import { FunctionMode } from "./data_table_functions";
import GeneralTable from "./general_table";
import { Input } from "~/components/ui/input";
import { FieldConfig } from "~/components/ui/auto-form/types";
import { ControllerProps, FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomForm from "~/components/ui/custom-form";
import { formatDate } from "~/lib/utils/format_date";
import { isDate } from "date-fns";
import { FileUploader, recoverData } from "~/pages/test";
import { inverse_translate } from "public/locales/utils";
import { isDateType } from "~/lib/utils/check_type";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	defaultValue?: any;
	mode: FunctionMode;
	closeSheet: () => void;
}

const LoginFormSchema = z.object({
	userid: z.string(),
	password: z.string().min(1, { message: "others.enter_password" }),
});

interface FormConfig<T extends z.AnyZodObject> {
  schema: T,
  form_fields: {
    name: FieldPath<z.infer<T>>
    label?: string,
    placeholder?: string,
    description?: string,
    render?: ControllerProps<z.infer<T>, FieldPath<z.infer<T>>>["render"] 
  }[]
  display_fields?: {
    label?: string,
    placeholder?: string,
    description?: string,
    render: () => React.ReactNode
  }[]
}

const formConfig: FormConfig<typeof LoginFormSchema> = {
  schema: LoginFormSchema,
  form_fields: [
    {
      name: "userid",
      render: ({ field }) => <Input {...field} />,
    }
  ]
}
  


export function ParameterForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	defaultValue,
	mode,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const { t } = useTranslation(["common"]);
	const functions = useContext(parameterToolbarFunctionsContext);

	const updateFunction = functions.updateFunction!;
	const batchCreateFunction = functions.batchCreateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const { isLoading, isError, data, error } =
		mode === "create" ? queryFutureFunction() : queryFutureFunction();

	const isList = Array.isArray(data);

	const [selectedData, setSelectedData] = useState(defaultValue ?? null);
	const [withoutDeafultValue, setWithoutDeafultValue] = useState(false);

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openDialog, setOpenDialog] = useState(false);

	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
      userid: "",
			password: "",
		},
	});

	const onSubmit = useCallback(
		async (data: z.infer<typeof LoginFormSchema>) => {
			if (mode === "create") {
				createFunction.mutate(data);
			} else if (mode === "update") {
				updateFunction.mutate({
					...data,
					id: data.id,
				});
			}
			// closeSheet();
			setSelectedData(null);
			console.log(data);
		},
		[]
	);
		} else {
			// TODO: Error element with toast
		}
		// closeSheet();
		setSelectedData(null);
	}

	const handleSubmit = () => {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			setOpenDialog(true);
		}
	};

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (!data) {
		return <p>{t("others.no_data")}</p>;
	}

	// Select one entry
	if (selectedData === null && !withoutDeafultValue) {
		const dataList = isList ? data.flat() : [data];
		const noIDData: any[] = dataList.map((item: any) => {
			const { ["id"]: id, ...rest } = item;
			return rest;
		});

		return (
			<CompViewAllDatas
				dataNoID={noIDData}
				mode={mode}
				onBatchCreate={(data: any) => {
					console.log(functions);
					batchCreateFunction.mutate(data);
				}}
				onUpdate={(index: number) => {
					const dataList = isList ? data : [data];
					setSelectedData(dataList[index]);
				}}
				onDelete={(index: number) => {
					deleteFunction.mutate({
						id: data[index].id,
					});
				}}
				clearDeafultValue={() => {
					setWithoutDeafultValue(true);
					setSelectedData(null);
				}}
			/>
		);
	}

	// Create or update an entry
	return (
		<>
      <CustomForm
        formSchema={LoginFormSchema}
        onSubmit={onSubmit}
      >
					<Button
						disabled={form.formState.isSubmitting}
						type="button"
						onClick={() => {
							setOpenDialog(true);
						}}
					>
						{t("button.login")}
					</Button>
			<AutoForm
				className="mb-10 ml-5 mr-5 mt-5"
				_defaultValues={selectedData}
				values={formValues}
				onValuesChange={setFormValues}
				onSubmit={handleSubmit}
				formSchema={formSchema}
				fieldConfig={fieldConfig}
			>
				<div>
					<div className="flex justify-between">
						<Button
							type="button"
							variant={"outline"}
							onClick={() => {
								if (mode === "update") {
									isList
										? setSelectedData(null)
										: closeSheet();
								}
								if (mode === "create") {
									closeSheet();
								}
							}}
						>
							{t("button.cancel")}
						</Button>

					<Dialog open={openDialog} onOpenChange={setOpenDialog}>
						<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>
									{t("others.check_data")}
								</DialogTitle>
							</DialogHeader>
							<GeneralTable data={form.getValues()} />
							<DialogFooter>
								<DialogClose asChild>
									<Button
										disabled={form.formState.isSubmitting}
										type="submit"
										form="parameter_form"
									>
										{t("button.save")}
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
      </CustomForm>
		</>
	);
}

const CompViewAllDatas = ({
	dataNoID,
	mode,
	onBatchCreate,
	onUpdate,
	onDelete,
	clearDeafultValue,
}: {
	dataNoID: any[];
	mode: FunctionMode;
	onBatchCreate: (data: any) => void;
	onUpdate: (index: number) => void;
	onDelete: (index: number) => void;
	clearDeafultValue: () => void;
}) => {
	const { t } = useTranslation(["common"]);
	const [filterValue, setFilterValue] = useState<string>("");
	const [filteredDataList, setFilteredDataList] = useState(dataNoID);


	// Batch create
	const [batchCreateOpen, setBatchCreateOpen] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [data, setData] = useState<any[]>([]);


	useEffect(() => {
		const filteredData = dataNoID?.filter((data) => {
			return Object.values(data).some((value: any) =>
				value ? value.toString().includes(filterValue) : false
			);
		});
		setFilteredDataList(filteredData);
	}, [dataNoID, filterValue]);

	return (
		<>
			<div className="flex h-[4rem] items-center justify-between">
				<Input
					className="w-1/10 absolute left-4 top-4"
					placeholder={t("others.filter_setting")}
					onChange={(e) => setFilterValue(e.target.value)}
				></Input>
				{mode == "create" && (
					<>
						<div className="absolute right-4 top-4">
							<Button
								className="mr-4"
								onClick={() => {
									setBatchCreateOpen(true);
								}}
							>
								{t("button.batch_create")}
							</Button>
							<Button onClick={clearDeafultValue}>
								{t("button.no_default_value")}
							</Button>
						</div>

						<Dialog open={batchCreateOpen} onOpenChange={setBatchCreateOpen}>
							<DialogContent className="sm:max-w-[1000px]">
								<DialogHeader>
									<DialogTitle>Batch Create Via Excel Upload</DialogTitle>
								</DialogHeader>
								<FileUploader 
									onUpload={async(files: File[]) => console.log(files)}
									files={files}
									setFiles={setFiles}
									data={data}
									setData={setData}
								/>
								<div>
									<div style={{ overflowX: 'auto', maxHeight: '600px', border: '1px solid #ddd' }}>
										<table style={{ borderCollapse: 'collapse', width: '100%' }}>
											<thead>
												<tr>
													{data[0] && data[0].map((header: any, index: number) => (
														<th key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
															{inverse_translate(header)}
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												{data.slice(1).map((row: any, rowIndex: number) => (
													<tr key={rowIndex}>
														{row.map((cell: any, cellIndex: number) => (
															<td key={cellIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>
																{
																	isDateType(cell) ? formatDate("day", cell) : cell
																}
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
								{data && data.length > 0 && (
									<DialogFooter>
										<DialogClose asChild>
											<Button
												onClick={() => {
													console.log(onBatchCreate)
													console.log(recoverData(data));
													onBatchCreate(recoverData(data));
													setBatchCreateOpen(false);
												}}
											>	
												{t("button.save")}
											</Button>
										</DialogClose>
									</DialogFooter>
								)}
							</DialogContent>
						</Dialog>
					</>
				)}
			</div>
			<div>
				{filteredDataList.length != 0 && filteredDataList[0] ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap text-center"></TableHead>
								{Object.keys(filteredDataList[0]).map(
									(key: string) => {
										return (
											<TableHead
												key={key}
												className="whitespace-nowrap text-center"
											>
												{t(`table.${key}`)}
											</TableHead>
										);
									}
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredDataList.map(
								(data: any, index: number) => {
									return (
										<TableRow key={data.id}>
											<TableCell className="items-center">
												{mode === "create" && (
													<Copy
														size={18}
														className="cursor-pointer"
														onClick={() => {
															onUpdate(index);
														}}
													/>
												)}
												{mode === "update" && (
													<PenSquare
														size={18}
														className="cursor-pointer"
														onClick={() => {
															onUpdate(index);
														}}
													/>
												)}
												{mode === "delete" && (
													<Trash2
														size={18}
														className="cursor-pointer"
														onClick={() => {
															onDelete(index);
														}}
													/>
												)}
											</TableCell>
											{Object.keys(data).map((key) => {
												return (
													<TableCell
														key={key}
														className="whitespace-nowrap text-center font-medium"
													>
														{isDate(data[key])
															? formatDate(
																	"day",
																	data[key]
															  )
															: data[key]}
														{/* {data[key]} */}
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
					<div className="m-4 text-center">
						{" "}
						{t("table.no_data")}{" "}
					</div>
				)}
			</div>
		</>
	);
};
