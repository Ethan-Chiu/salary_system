import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../form";
import { Input } from "../../input";
import { AutoFormInputComponentProps } from "../types";

export default function AutoFormInput({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
  Translate,
}: AutoFormInputComponentProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;
  return (
    <FormItem>
      {showLabel && (
        <FormLabel>
          {Translate?Translate(label):label}
          {isRequired && <span className="text-destructive"> *</span>}
        </FormLabel>
      )}
      <FormControl>
        <Input type="text" {...fieldPropsWithoutShowLabel} />
      </FormControl>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
