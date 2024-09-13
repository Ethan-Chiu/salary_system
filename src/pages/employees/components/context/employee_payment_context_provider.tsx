import React, { useState, type PropsWithChildren, useEffect } from "react";
import employeePaymentContext from "./employee_payment_context";

interface EmployeePaymentContextProviderProps {
	refetchFunction: () => void;
}

const EmployeePaymentContextProvider: React.FC<PropsWithChildren<EmployeePaymentContextProviderProps>> = ({ refetchFunction, children }) => {
	const [refetch, setRefetch] = useState<(()=>void)>(refetchFunction);

	useEffect(() => {
		setRefetch(() => {
			refetchFunction
		})
	}, [refetchFunction]);

	return (
		<employeePaymentContext.Provider
			value={{
				refetch,
				setRefetch,
			}}
		>
			{children}
		</employeePaymentContext.Provider>
	);
}

export default EmployeePaymentContextProvider;