<script lang="ts">
	import { calculateValues } from '../utils/calculations';
	import Header from '../components/Header.svelte';
	import Form from '../components/Form.svelte';
	import Graph from '../components/Graph.svelte';
	import Table from '../components/Table.svelte';
	import type { FormData, ConvertedFormData, TableData } from '../../types';

	let formData: FormData = {
		selectedCurve: '-',
		initialCost: 0,
		scalingFactor: 0,
		reserveBalance: 0,
		tokenCount: 0,
		step: 0
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

		let convertedInitialCost = convertEtherToWei(formData.initialCost);
		let convertedScalingFactor = BigInt(formData.scalingFactor);
		let convertedReserveBalance = convertEtherToWei(formData.reserveBalance);

		let convertedFormData: ConvertedFormData = {
			selectedCurve: formData.selectedCurve,
			initialCost: convertedInitialCost,
			scalingFactor: convertedScalingFactor,
			reserveBalance: convertedReserveBalance,
			tokenCount: formData.tokenCount,
			step: formData.step
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
	<Header />
	<div class="body">
		<div class="column">
			<Form {onSubmit} />
		</div>
		<div class="column">
			<Graph {tableData} />
			<Table {tableData} />
		</div>
	</div>
</div>

<style>
	@import '../app.css';
</style>
