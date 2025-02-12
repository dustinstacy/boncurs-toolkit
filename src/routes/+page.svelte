<script lang="ts">
	import { calculateValues } from '../utils/calculations';
	import Form from '../components/Form.svelte';
	import Table from '../components/Table.svelte';
	import type { FormData, ConvertedFormData, TableData } from '../../types';

	let formData: FormData = {
		selectedCurve: '-',
		reserveBalance: 0,
		reserveRatio: 0,
		initialCost: 0,
		scalingFactor: 0
	};

	// Declare tableData object as reactive
	let tableData: TableData = {
		tokens: [] as number[],
		purchaseCosts: [] as bigint[],
		saleReturns: [] as bigint[]
	};

	// Function to handle form submission with the data passed from the child component
	function onSubmit(eventData: FormData) {
		formData = eventData;

		let convertedReserveBalance = convertEtherToWei(formData.reserveBalance);
		let convertedInitialCost = convertEtherToWei(formData.initialCost);
		let convertedScalingFactor = BigInt(formData.scalingFactor);
		let convertedReserveRatio = BigInt(formData.reserveRatio);

		let convertedFormData: ConvertedFormData = {
			selectedCurve: formData.selectedCurve,
			reserveBalance: convertedReserveBalance,
			reserveRatio: convertedReserveRatio,
			initialCost: convertedInitialCost,
			scalingFactor: convertedScalingFactor
		};

		// Call calculateValues to get purchase costs and sale returns
		const { purchaseCosts, saleReturns, tokens } = calculateValues(convertedFormData);

		// Pass the results to the Table component
		tableData = { tokens, purchaseCosts, saleReturns };
	}

	function convertEtherToWei(number: number): bigint {
		return BigInt(Math.round(number * 1e18));
	}
</script>

<div class="page">
	<header>
		<!-- @dev Implement Header component in the future -->
		<h1>Boncurs Tools</h1>
	</header>

	<div class="body">
		<Form {onSubmit} />
		<!-- @dev Implement Graph component in the future -->
		<div class="graph">
			<h2>Graph</h2>
			<!-- Placeholder for Graph -->
			<div style="height: 400px;">Graph will go here</div>
		</div>
		<Table {tableData} />
	</div>

	<footer>
		<!-- @dev Implement Footer component in the future -->
		<p>Footer Content</p>
	</footer>
</div>

<style>
	@import '../app.css';
</style>
