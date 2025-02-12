import type { ConvertedFormData, TableData } from '../../types';

// Standard values for calculations
const BASIS_POINTS: bigint = BigInt(10000);

export function formatWeiToEther(wei: bigint, decimals: number = 18): string {
	// Convert to string and handle Wei scaling manually
	const weiString = wei.toString();

	// Ensure the string is at least 19 digits (1 digit for the whole number, 18 for decimals)
	const etherString = weiString.padStart(decimals + 1, '0'); // Add leading zeros if needed

	// Split into integer and decimal parts
	const integerPart = etherString.slice(0, etherString.length - decimals);
	const decimalPart = etherString.slice(etherString.length - decimals);

	return `${integerPart}.${decimalPart}`.slice(0, -9);
}

// Function to calculate purchase costs and sale returns based on the selected curve
///@dev Extract this to a separate file in the future
export function calculateValues(formData: ConvertedFormData): TableData {
	const tokens = [];
	const purchaseCosts = [];
	const saleReturns = [];
	const SUPPLY_MAX: bigint = BigInt(100); ///@dev Variablize this in the future

	// Loop through the supply values
	for (let supply: bigint = BigInt(0); supply <= SUPPLY_MAX; supply++) {
		let purchaseCost: bigint, saleReturn: bigint;

		// Calculate purchase cost and sale return based on selected curve
		switch (formData.selectedCurve) {
			case 'Boncurs':
				purchaseCost = calculateBoncursPurchaseCost(formData, supply);
				saleReturn = calculateBoncursSaleReturn(formData, supply);
				break;
			case 'Exponential':
				///@dev Implement this in the future
				purchaseCost = calculateExponentialPurchaseCost(formData, supply);
				saleReturn = purchaseCost; // for simplicity, we assume purchaseCost = saleReturn
				break;
			case 'Linear':
				///@dev Implement this in the future
				purchaseCost = calculateLinearPurchaseCost(formData, supply);
				saleReturn = purchaseCost;
				break;
			case 'Exponential Token Based':
				///@dev Implement this in the future
				purchaseCost = calculateExponentialTokenBasedPurchaseCost(formData, supply);
				saleReturn = purchaseCost;
				break;
			case 'Linear Token Based':
				///@dev Implement this in the future
				purchaseCost = calculateLinearTokenBasedPurchaseCost(formData, supply);
				saleReturn = purchaseCost;
				break;
			default:
				purchaseCost = BigInt(0);
				saleReturn = BigInt(0);
				break;
		}

		// Update reserve balance
		formData.reserveBalance += purchaseCost;

		// Push the results to the arrays
		tokens.push(Number(supply));
		purchaseCosts.push(purchaseCost);
		saleReturns.push(saleReturn);
	}

	///@dev format the results to Ether
	return { purchaseCosts, saleReturns, tokens };
}

function calculateBoncursPurchaseCost(formData: ConvertedFormData, supply: bigint): bigint {
	if (supply == BigInt(0)) {
		return formData.initialCost;
	}

	let value = (formData.reserveBalance * formData.scalingFactor) / BigInt(supply);
	return value / BASIS_POINTS;
}

function calculateBoncursSaleReturn(formData: ConvertedFormData, supply: bigint): bigint {
	if (supply == BigInt(0)) {
		return formData.initialCost;
	}
	return formData.reserveBalance / supply;
}

///@dev Implement these functions in the future
function calculateExponentialPurchaseCost(formData: ConvertedFormData, supply: bigint): bigint {
	console.log('Calculating Exponential Purchase Cost with data:', formData);
	return BigInt(0);
}

///@dev Implement these functions in the future
function calculateLinearPurchaseCost(formData: ConvertedFormData, supply: bigint): bigint {
	console.log('Calculating Linear Purchase Cost with data:', formData);
	return BigInt(0);
}

///@dev Implement these functions in the future
function calculateExponentialTokenBasedPurchaseCost(
	formData: ConvertedFormData,
	supply: bigint
): bigint {
	console.log('Calculating Exponential Token Based Purchase Cost with data:', formData);
	return BigInt(0);
}

///@dev Implement these functions in the future
function calculateLinearTokenBasedPurchaseCost(
	formData: ConvertedFormData,
	supply: bigint
): bigint {
	const amount = BigInt(1);
	const { initialCost, scalingFactor } = formData;
	// Linear Token Based: simple linear cost with scaling factor
	if (supply == BigInt(0) && amount == BigInt(1)) {
		return initialCost;
	}

	// Case for no scaling (pure linear case)
	if (scalingFactor == BASIS_POINTS) {
		return initialCost * (amount * supply + (amount * (amount + BigInt(1))) / BigInt(2));
	}

	const { scaledInitialCost, initialCostAdjustment } = getInitialCostAdjustment(
		initialCost,
		scalingFactor
	);

	// Calculate the raw cost and the total adjustment based on amount
	let rawCost = scaledInitialCost * (amount * supply + (amount * (amount + BigInt(1))) / BigInt(2));
	let initialAdjustmentTotal = initialCostAdjustment * amount;

	// If scaling factor is greater, subtract the adjustment, otherwise add it to the raw cost
	return scalingFactor > BASIS_POINTS
		? rawCost - initialAdjustmentTotal
		: rawCost + initialAdjustmentTotal;
}

function getInitialCostAdjustment(
	initialCost: bigint,
	scalingFactor: bigint
): { scaledInitialCost: bigint; initialCostAdjustment: bigint } {
	let scaledInitialCost = (initialCost * scalingFactor) / BASIS_POINTS;
	let initialCostAdjustment =
		scalingFactor > BASIS_POINTS
			? scaledInitialCost - initialCost
			: initialCost - scaledInitialCost;
	return { scaledInitialCost, initialCostAdjustment };
}
