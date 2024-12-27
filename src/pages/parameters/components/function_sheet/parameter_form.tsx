import { type z } from "zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import { type DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import CustomForm from "~/components/ui/custom-form";
import { type FormConfig } from "~/components/ui/custom-form/types";
import { type FunctionMode } from "../context/data_table_context";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	formConfig?: FormConfig<SchemaType>;
	formSubmit?: (data: z.infer<SchemaType>) => void;
	defaultValue?: DefaultValues<z.infer<SchemaType>>;
	mode: FunctionMode;
	closeSheet: () => void;
}

export function ParameterForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	formConfig,
	formSubmit,
	defaultValue,
	mode,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const { t } = useTranslation(["common"]);

	const functions = useContext(parameterToolbarFunctionsContext);
	const createFunction = functions.createFunction!;
	const updateFunction = functions.updateFunction!;

	const [openDialog, setOpenDialog] = useState(false);

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		if (mode === "create") {
			createFunction.mutate(data);
		} else if (mode === "update") {
			updateFunction.mutate({
				...data,
				id: data.id,
			});
		}
		closeSheet();
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValue,
	});

	const formId = "parameter_form";

	return (
		<>
			<CustomForm
				formSchema={formSchema}
				formConfig={formConfig}
				form={form}
				onSubmit={(v) => {
					onSubmit(v);
				}}
				formId={formId}
			>
				<div className="flex w-full justify-end gap-4 py-4">
					<Button
						type="button"
						variant={"outline"}
						onClick={() => {
							closeSheet();
						}}
					>
						{t("button.cancel")}
					</Button>

					{/* TODO: handle form submit validation */}
					<Button
						type="button"
						variant={"outline"}
						onClick={() => setOpenDialog(true)}
					>
						{t(`button.${mode}`)}
					</Button>
				</div>
			</CustomForm>

			<Dialog
				open={openDialog}
				onOpenChange={setOpenDialog}
				aria-hidden={false}
			>
				<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{t("others.check_data")}</DialogTitle>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								disabled={form.formState.isSubmitting}
								type="submit"
								form={formId}
							>
								{t("button.save")}
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
