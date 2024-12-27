import { type z } from "zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import GeneralTable from "~/components/function_sheet/general_table";

interface StandardFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	formConfig?: FormConfig<SchemaType>;
	formSubmit?: (data: z.infer<SchemaType>) => void;
	defaultValue?: DefaultValues<z.infer<SchemaType>>;
	button_text: string;
	closeSheet: () => void;
}

export function StandardForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	formConfig,
	formSubmit,
	defaultValue,
	button_text,
	closeSheet,
}: StandardFormProps<SchemaType>) {
	const formId = "standard_form";
	const { t } = useTranslation(["common"]);
	const [openDialog, setOpenDialog] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValue,
	});
	const [formValues, setFormValues] = useState({});

	return (
		<>
			<CustomForm
				formSchema={formSchema}
				formConfig={formConfig}
				form={form}
				onSubmit={(v) => {
					formSubmit?.(v);
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
						onClick={() => {
							setOpenDialog(true);
							const values = form.getValues();
							const parsedValues = formSchema.safeParse(values);
							if (parsedValues.success) {
								setFormValues(parsedValues.data);
							}
						}}
					>
						{t(`button.${button_text}`)}
					</Button>
				</div>
			</CustomForm>

			<Dialog
				open={openDialog}
				onOpenChange={setOpenDialog}
				aria-hidden={false}
			>
				<DialogContent className="max-h-[80vh] overflow-y-scroll sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{t("others.check_data")}</DialogTitle>
					</DialogHeader>
					<GeneralTable data={formValues} />
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
