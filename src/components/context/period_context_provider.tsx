import React, { useState, type PropsWithChildren, useEffect } from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";
import periodContext from "./period_context";
import { SessionStorage } from "~/utils/session_storage";

export default function PeriodContextProvider({ children }: PropsWithChildren) {
	const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
	const [selectedPayDate, setSelectedPayDate] = useState<string | null>(null);

	useEffect(() => {
		const sessionPeriod = SessionStorage.getSelectedPeriod();
		const sessionPayDate = SessionStorage.getSelectedPayDate();
		if (sessionPeriod) {
			setSelectedPeriod(sessionPeriod);
		}
		if (sessionPayDate) {
			setSelectedPayDate(sessionPayDate);
		}
	}, []);

	return (
		<periodContext.Provider
			value={{
				selectedPeriod,
				setSelectedPeriod,
				selectedPayDate,
				setSelectedPayDate,
			}}
		>
			{children}
		</periodContext.Provider>
	);
}
