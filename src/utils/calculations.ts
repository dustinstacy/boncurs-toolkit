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
export function calculateValues(formData: ConvertedFormData): TableData {
	const tokens = [];
	const purchaseCosts = [];
	const saleReturns = [];
	const SUPPLY_MAX: bigint = BigInt(1000); ///@dev Variablize this in the future

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
	const { initialCost, scalingFactor } = formData;
	if (supply == BigInt(0)) {
		return initialCost;
	} else if (scalingFactor == BASIS_POINTS) {
		return ((supply + BigInt(1)) * initialCost * scalingFactor) / BASIS_POINTS;
	}

	let { initialCostAdjustment } = getInitialCostAdjustment(initialCost, scalingFactor);
	let rawCost = ((supply + BigInt(1)) * initialCost * scalingFactor) / BASIS_POINTS;
	return scalingFactor > BASIS_POINTS ? rawCost - initialCostAdjustment : rawCost;
}

///@dev Implement these functions in the future
function calculateExponentialTokenBasedPurchaseCost(
	formData: ConvertedFormData,
	supply: bigint
): bigint {
	let amount = BigInt(1);
	let one = BigInt(1);
	let two = BigInt(2);
	let six = BigInt(6);
	let { initialCost, scalingFactor } = formData;

	if (supply == BigInt(0)) {
		if (amount == one) {
			return initialCost;
		} else {
			let sum = ((amount - one) * amount * (two * (amount - one) + one)) / six;
			return (sum * initialCost) / scalingFactor + initialCost * amount;
		}
	} else {
		let sum1 = ((supply - one) * supply * (two * (supply - one) + one)) / six;
		let sum2 =
			((supply - one + amount) * (supply + amount) * (two * (supply - one + amount) + one)) / six;
		let totalSum = sum2 - sum1;
		let scaledTotal = (totalSum * initialCost) / scalingFactor;
		let initialCostAdjumsent = initialCost * amount;
		let totalCost = scaledTotal + initialCostAdjumsent;
		return totalCost;
	}
}

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
