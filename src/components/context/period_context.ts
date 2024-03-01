import React from "react";
import { type Period } from "~/server/database/entity/UMEDIA/period";

const periodContext = React.createContext<{
	selectedPeriod: Period | null;
	setSelectedPeriod: (period: Period) => void;
}>({
	selectedPeriod: null,
	setSelectedPeriod: (_: Period) => undefined,
});

export default periodContext;
