import React, { useState, type PropsWithChildren } from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";
import periodContext from "./period_context";

export default function PeriodContextProvider({ children }: PropsWithChildren) {
	const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);

	return (
		<periodContext.Provider
			value={{
				selectedPeriod,
				setSelectedPeriod,
			}}
		>
			{children}
		</periodContext.Provider>
	);
}
