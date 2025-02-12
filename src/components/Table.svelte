<script lang="ts">
	import { formatWeiToEther } from '../utils/calculations';
	let { tableData } = $props();
</script>

<div class="table">
	<h2>Token Purchase and Sale Information</h2>
	<table>
		<thead>
			<tr>
				<th>Supply (Token #)</th>
				<th>Purchase Cost</th>
				<th>Sale Return</th>
			</tr>
		</thead>
		<tbody>
			{#each tableData.tokens as token, index}
				<tr>
					<td>{token + 1}</td>
					<td>{formatWeiToEther(tableData.purchaseCosts[index])}</td>
					<td>{formatWeiToEther(tableData.saleReturns[index])}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	@import './Table.css';
</style>
