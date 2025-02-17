// Define the structure of the form data
export type FormData = {
	selectedCurve: string;
	initialCost: number;
	scalingFactor: number;
	reserveBalance: number;
	tokenCount: number;
	step: number;
};

export type ConvertedFormData = {
	selectedCurve: string;
	initialCost: bigint;
	scalingFactor: bigint;
	reserveBalance: bigint;
	tokenCount: number;
	step: number;
};

export type TableData = { tokens: number[]; purchaseCosts: bigint[]; saleReturns: bigint[] };
