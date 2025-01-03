export type FunctionsItem = {
	creatable: boolean;
	updatable: boolean;
	deletable: boolean;
};

export interface DataWithFunctions {
	functions: FunctionsItem;
}
