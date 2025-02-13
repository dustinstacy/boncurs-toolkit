<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';
	import { formatWeiToEther } from '../utils/calculations';

	let { tableData } = $props();

	let chart: Chart;

	// Function to update the chart
	function updateChart() {
		if (tableData && tableData.tokens && tableData.purchaseCosts) {
			// Convert bigint to number (since Chart.js can't handle bigint)
			const purchaseCostsNumbers = tableData.purchaseCosts.map((cost: bigint) => Number(cost));

			// If the chart already exists, we update the chart data and redraw
			if (chart) {
				chart.data.labels = tableData.tokens;
				chart.data.datasets[0].data = purchaseCostsNumbers;
				chart.update();
			} else {
				// Create the chart if it does not exist yet
				chart = new Chart('myChart', {
					type: 'line', // Line chart
					data: {
						labels: tableData.tokens, // X-axis labels
						datasets: [
							{
								label: 'Purchase Costs',
								data: purchaseCostsNumbers, // Y-axis data
								borderColor: 'purple', // Line color
								fill: false, // Do not fill the area under the line
								tension: 0.1 // Line curve
							}
						]
					},
					options: {
						responsive: true,
						scales: {
							x: {
								title: {
									display: true,
									text: 'Tokens'
								}
							},
							y: {
								title: {
									display: true,
									text: 'Purchase Costs'
								},
								beginAtZero: true,
								ticks: {
									// Custom tick formatting using formatWeiToEther
									callback: function (tickValue: number | string) {
										// Convert to BigInt, scaling appropriately
										let tickAsBigInt: bigint = BigInt(Math.round(tickValue as number));
										let formattedTick = formatWeiToEther(tickAsBigInt);
										return formattedTick.slice(0, 9); // Display only the first 7 characters
									}
								}
							}
						}
					}
				});
			}
		}
	}

	// Initial chart creation when the component is mounted
	onMount(() => {
		updateChart();
	});

	// Update the chart whenever tableData changes using $effect
	$effect(() => {
		updateChart();
	});

	// Cleanup the chart when the component is destroyed
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div class="graph">
	<canvas id="myChart"></canvas>
</div>

<style>
	@import './Graph.css';
</style>
