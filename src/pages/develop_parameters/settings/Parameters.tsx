import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";


export function BankSettings(formSchema: any) {
  return (
    <AutoForm
      // Pass the schema to the form
      formSchema={formSchema}
      // You can add additional config for each field
      // to customize the UI
      onSubmit={(data) => {console.log(data)}}
      fieldConfig={{
        // password: {
        //   // Use "inputProps" to pass props to the input component
        //   // You can use any props that the component accepts
        //   inputProps: {
        //     type: "password",
        //     placeholder: "••••••••",
        //   },
        // },
        // favouriteNumber: {
        //   // Set a "description" that will be shown below the field
        //   description: "Your favourite number between 1 and 10.",
        // },
        // acceptTerms: {
        //   inputProps: {
        //     required: true,
        //   },
        //   // You can use JSX in the description
        //   description: (
        //     <>
        //       I agree to the{" "}
        //       <a
        //         href="#"
        //         className="text-primary underline"
        //         onClick={(e) => {
        //           e.preventDefault();
        //           alert("Terms and conditions clicked.");
        //         }}
        //       >
        //         terms and conditions
        //       </a>
        //       .
        //     </>
        //   ),
        // },

        // birthday: {
        //   description: "We need your birthday to send you a gift.",
        // },

        // sendMeMails: {
        //   // Booleans use a checkbox by default, you can use a switch instead
        //   fieldType: "switch",
        // },
      }}
    >
      {/* 
      Pass in a AutoFormSubmit or a button with type="submit".
      Alternatively, you can not pass a submit button
      to create auto-saving forms etc.
      */}
      <AutoFormSubmit>Send now</AutoFormSubmit>

      {/*
      All children passed to the form will be rendered below the form.
      */}
      <p className="text-gray-500 text-sm">
        By submitting this form, you agree to our{" "}
        <a href="#" className="text-primary underline">
          terms and conditions
        </a>
        .
      </p>
    </AutoForm>
  );
}