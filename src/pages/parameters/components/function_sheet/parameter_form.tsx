import * as z from "zod";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import { FunctionMode } from "./data_table_functions";
import { Input } from "~/components/ui/input";
import { FieldConfig } from "~/components/ui/auto-form/types";
import { ControllerProps, FieldPath, useForm } from "react-hook-form";
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
	schema: T;
	form_fields: {
		name: FieldPath<z.infer<T>>;
		label?: string;
		placeholder?: string;
		description?: string;
		render?: ControllerProps<z.infer<T>, FieldPath<z.infer<T>>>["render"];
	}[];
	display_fields?: {
		label?: string;
		placeholder?: string;
		description?: string;
		render: () => React.ReactNode;
	}[];
}

const formConfig: FormConfig<typeof LoginFormSchema> = {
	schema: LoginFormSchema,
	form_fields: [
		{
			name: "userid",
			render: ({ field }) => <Input {...field} />,
		},
	],
};

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
		},
		[]
	);

	return (
		<>
			<CustomForm formSchema={LoginFormSchema} onSubmit={onSubmit}>
				<Button
					type="button"
					variant={"outline"}
					onClick={() => {
						closeSheet();
					}}
				>
					{t("button.cancel")}
				</Button>

				<Dialog open={openDialog} onOpenChange={setOpenDialog}>
					<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>{t("others.check_data")}</DialogTitle>
						</DialogHeader>
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
