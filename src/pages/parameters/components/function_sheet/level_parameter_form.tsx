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
import { levelRangeSchema } from "../../schemas/configurations/level_range_schema";
import { SelectLevelField } from "./form_fields/select_level_field";

interface LevelParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	defaultValue?: any;
	mode: FunctionMode;
	closeSheet: () => void;
}

export function LevelParameterForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	defaultValue,
	mode,
	closeSheet,
}: LevelParameterFormProps<SchemaType>) {
	const { t } = useTranslation(["common"]);
	const functions = useContext(parameterToolbarFunctionsContext);

	const createFunction = functions.createFunction!;
	const updateFunction = functions.updateFunction!;

	const [openDialog, setOpenDialog] = useState(false);

	const onSubmit = useCallback(
		async (data: z.infer<typeof levelRangeSchema>) => {
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

	const form = useForm<z.infer<typeof levelRangeSchema>>({
		resolver: zodResolver(levelRangeSchema),
		defaultValues: {
			...defaultValue,
		},
	});

	return (
		<>
			<CustomForm
				formSchema={levelRangeSchema}
				formConfig={[
          {
            key: "level_start",
            config: {
              render: SelectLevelField
            }
          }
        ]}
				form={form}
				onSubmit={void onSubmit}
			>
				<Button
					type="button"
					variant={"outline"}
					onClick={() => {
						closeSheet();
					}}
				>
					{t("button.cancel")}
				</Button>

				<Button type="submit" variant={"outline"}>
					{t("button.submit")}
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
