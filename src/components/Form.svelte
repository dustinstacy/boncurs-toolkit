<script lang="ts">
	import type { FormData } from '../../types';

	export let onSubmit: (eventData: FormData) => void; // Callback prop

	let selectedCurve = '-';
	let reserveBalance = 0;
	let reserveRatio = 0;
	let initialCost = 0;
	let scalingFactor = 0;

	// Form submission handler
	function handleSubmit() {
		const formData: FormData = {
			selectedCurve,
			reserveBalance,
			reserveRatio,
			initialCost,
			scalingFactor
		};
		onSubmit(formData); // Call the parent function with the form data
	}

	// Min/Max values for inputs
	///@dev More specific to each curve
	const reserveBalanceMin = 0.000000001;
	const reserveBalanceMax = 100000000;
	const reserveRatioMin = 1;
	const reserveRatioMax = 1000000;
	const initialCostMin = reserveBalanceMin;
	const initialCostMax = reserveBalanceMax;
	const scalingFactorMin = 1;
	const scalingFactorMax = 1000000;

	function updateFormValues() {
		if (selectedCurve === 'Exponential') {
			reserveBalance = 1;
			reserveRatio = 500000;
			initialCost = 0;
			scalingFactor = 0;
		} else if (selectedCurve !== '-') {
			initialCost = 0.001;
			scalingFactor = 10000;
			reserveRatio = 0;
			reserveBalance = 0;
		} else {
			reserveBalance = 0;
			reserveRatio = 0;
			initialCost = 0;
			scalingFactor = 0;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<h3>Curve type:</h3>
	<div class="selector">
		<select id="curve-type" bind:value={selectedCurve} on:change={updateFormValues}>
			<option value="-">-</option>
			<option value="Boncurs">Boncurs</option>
			<!-- <option value="Exponential">Exponential</option> -->
			<option value="Linear">Linear</option>
			<option value="Exponential Token Based">Exponential Token Based</option>
			<option value="Linear Token Based">Linear Token Based</option>
		</select>
	</div>

	<!-- {#if selectedCurve === 'Exponential'} -->
	<!-- <div class="selector">
			<label for="initial-reserve-balance">Initial Reserve Balance (in Ether):</label>
			<input
				id="initial-reserve-balance"
				type="number"
				bind:value={reserveBalance}
				min={reserveBalanceMin}
				max={reserveBalanceMax}
				step="any"
				placeholder="Enter Initial Reserve Balance"
			/>
		</div>
		<div class="selector">
			<label for="reserve-ratio">Reserve Ratio (in ppm):</label>
			<input
				id="reserve-ratio"
				type="number"
				bind:value={reserveRatio}
				min={reserveRatioMin}
				max={reserveRatioMax}
				step="any"
				placeholder="Enter Reserve Ratio"
			/>
		</div> -->
	{#if selectedCurve !== '-'}
		<div class="selector">
			<label for="initial-cost">Initial Cost:</label>
			<input
				id="initial-cost"
				type="number"
				bind:value={initialCost}
				min={initialCostMin}
				max={initialCostMax}
				step="any"
				placeholder="Enter Initial Cost"
			/>
		</div>
		<div class="selector">
			<label for="scaling-factor">Scaling Factor:</label>
			<input
				id="scaling-factor"
				type="number"
				bind:value={scalingFactor}
				min={scalingFactorMin}
				max={scalingFactorMax}
				step="any"
				placeholder="Enter Scaling Factor"
			/>
		</div>
	{/if}

	<button type="submit">Submit</button>
</form>

<style>
	@import './Form.css';
</style>
