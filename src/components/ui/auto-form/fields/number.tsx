import { AutoFormInputComponentProps } from "../types";
import AutoFormInput from "./input";

export default function AutoFormNumber({
  fieldProps,
  isRequired,
  ...props
}: AutoFormInputComponentProps) {
  return (
    <AutoFormInput
      fieldProps={{
        type: "number",
        ...fieldProps,
      }}
      isRequired={true}
      {...props}
    />
  );
}
