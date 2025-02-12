<script lang="ts">
	import Form from '../components/Form.svelte';
	import type { FormData } from '../../types';

	let formData: FormData = {
		selectedCurve: '-',
		initialReserveBalance: 1,
		reserveRatio: 500000,
		initialCost: 0.001,
		scalingFactor: 10000
	};

	// Function to handle form submission with the data passed from the child component
	function onSubmit(eventData: FormData): void {
		console.log('Form data submitted:', eventData);
		formData = eventData; // Store the submitted form data if needed
	}
</script>

<div class="page">
	<header>
		<h1>Boncurs Tools</h1>
	</header>

	<div class="body">
		<Form {onSubmit} />
		<div class="graph">
			<h2>Graph</h2>
			<!-- Placeholder for Graph -->
			<div style="height: 400px;">Graph will go here</div>
		</div>
		<div class="table">
			<h2>Table</h2>
			<!-- Placeholder for Table -->
			<table>
				<tbody>
					<tr><td>Row 1</td></tr>
					<tr><td>Row 2</td></tr>
					<tr><td>Row 3</td></tr>
				</tbody>
			</table>
		</div>
	</div>

	<footer>
		<p>Footer Content</p>
	</footer>
</div>

<style>
	@import '../app.css';
</style>
