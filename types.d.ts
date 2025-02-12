// Define the structure of the form data
export type FormData = {
	selectedCurve: string;
	reserveBalance: number;
	reserveRatio: number;
	initialCost: number;
	scalingFactor: number;
};

export type ConvertedFormData = {
	selectedCurve: string;
	reserveBalance: bigint;
	reserveRatio: bigint;
	initialCost: bigint;
	scalingFactor: bigint;
};

export type TableData = { tokens: number[]; purchaseCosts: bigint[]; saleReturns: bigint[] };
