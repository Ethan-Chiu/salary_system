import React from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";

const periodContext = React.createContext<{
	selectedPeriod: Period | null;
	setSelectedPeriod: (period: Period) => void;
	selectedPayDate: string | null;
	setSelectedPayDate: (date: string) => void;
}>({
	selectedPeriod: null,
	setSelectedPeriod: (_: Period) => undefined,
	selectedPayDate: null,
	setSelectedPayDate: (_: string) => undefined,
});

export default periodContext;
