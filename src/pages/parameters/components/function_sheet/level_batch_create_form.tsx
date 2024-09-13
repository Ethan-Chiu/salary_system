import AutoForm from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";
import { PenSquare, Trash2 } from "lucide-react";

import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import { FunctionMode } from "./data_table_functions";
import GeneralTable from "./general_table";
import { LoadingSpinner } from "~/components/loading";
import { FieldConfig } from "~/components/ui/auto-form/types";
import isDate from "date-fns/isDate";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	defaultValue?: any;
	mode: FunctionMode;
	closeSheet: () => void;
}

export function LevelBatchCreateForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	defaultValue,
	mode,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const functions = useContext(parameterToolbarFunctionsContext);

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const { isLoading, isError, data, error } = queryFunction();

	const isList = Array.isArray(data);
	const onlyOne = !(isList && data.length > 1);

	const [selectedData, setSelectedData] = useState((defaultValue) ?? (isList ? null : data));

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openDialog, setOpenDialog] = useState(false);
	const { t } = useTranslation(["common"]);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape).map(([key, value]) => {
				if (value instanceof z.ZodDefault)
					return [key, value._def.defaultValue()];
				return [key, undefined];
			})
		);
	}

	function submitForm() {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			if (mode === "create") {
				createFunction.mutate({
					...parsedValues.data,
				});
			} else if (mode === "update") {
				updateFunction.mutate({
					...parsedValues.data,
					id: selectedData.id,
				});
			}
		} else {
			// TODO: Error element with toast
		}
		closeSheet();
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


    const schema = z.object({
        levels: z.array(
			z.object({
				level: zc.number(),
			})
        ),
      });
      
      type FormValues = z.infer<typeof schema>;
      
      function DynamicForm() {
        const { control, handleSubmit, register, reset } = useForm<FormValues>({
          resolver: zodResolver(schema),
          defaultValues: {
            rows: [], // Initial row
          },
        });
      
        const { fields, append, remove } = useFieldArray({
          control,
          name: "rows",
        });
      
        const onSubmit = (data: FormValues) => {
          console.log("Form Data:", data);
        };
        return (
            <>
            <br/>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div className="flex items-center gap-8" key={field.id}>
                    {/* Name Input */}
                    <div className="flex-grow">
                      <Label> {t("table.level")} </Label>
                    </div>
                    {/* Age Input */}
                    <div className="flex-grow">
                      <Input
                        type="number"
                        {...register(`rows.${index}.age` as const)}
                        placeholder="Age"
                      />
                      <Input
                        type="number"
                        {...register(`rows.${index}.name` as const)}
                        placeholder="Name"
                      />
                    </div>
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}

<div>
					<div className="flex justify-between">
						<Button
							type="button"
							variant={"outline"}
							onClick={() => {
									closeSheet();
							}}
						>
							{t("button.cancel")}
						</Button>

						<Button type="submit">
							{t("button.batch_create")}
						</Button>
					</div>
				</div>

                {/* Add Row Button */}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => append({ name: "", age: 0 })}
                >
                  Add Row
                </button>
              </div>
              {/* Submit Button */}
              <div className="mt-4">
                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </div>
            </form>
            </>
          );
        }



	// Create or update an entry
	return (
		<>
            <DynamicForm />
			{/* Submit change dialog */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{t("others.check_data")}</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<GeneralTable data={formValues} />
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={submitForm} type="submit">
								{t("button.save")}
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}