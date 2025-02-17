<script lang="ts">
	import type { FormData } from '../../types';

	export let onSubmit: (eventData: FormData) => void; // Callback prop

	let selectedCurve = '-';
	let initialCost = 0;
	let scalingFactor = 0;
	let reserveBalance = 0;
	let tokenCount = 0;
	let step = 0;

	// Form submission handler
	function handleSubmit() {
		const formData: FormData = {
			selectedCurve,
			initialCost,
			scalingFactor,
			reserveBalance,
			tokenCount,
			step
		};
		onSubmit(formData); // Call the parent function with the form data
	}

	// Min/Max values for inputs
	///@dev More specific to each curve
	const initialCostMin = 0.000000001;
	const initialCostMax = 1000000000;
	const scalingFactorMin = 1;
	const scalingFactorMax = 1000000;

	function updateFormValues() {
		if (selectedCurve !== '-') {
			initialCost = 0.001;
			scalingFactor = 10000;
			tokenCount = 100;
			step = 1;
		} else {
			initialCost = 0;
			scalingFactor = 0;
			tokenCount = 0;
			step = 0;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="selector">
		<label for="curve-type">Curve type:</label>
		<select id="curve-type" bind:value={selectedCurve} on:change={updateFormValues}>
			<option value="-">-</option>
			<option value="Boncurs">Boncurs</option>
			<!-- <option value="Exponential">Exponential</option> -->
			<option value="Linear">Linear</option>
			<option value="Exponential Token Based">Exponential Token Based</option>
			<option value="Linear Token Based">Linear Token Based</option>
		</select>
	</div>
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
	<div class="selector">
		<label for="token-count">Token Count:</label>
		<input
			id="token-count"
			type="number"
			bind:value={tokenCount}
			min="0"
			step="1"
			placeholder="Enter Token Count"
		/>
	</div>
	<div class="selector">
		<label for="step">Step:</label>
		<input id="step" type="number" bind:value={step} min="0" step="1" placeholder="Enter Step" />
	</div>

	<button type="submit">Submit</button>
</form>

<style>
	@import './Form.css';
</style>
