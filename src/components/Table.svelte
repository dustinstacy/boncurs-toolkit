<script lang="ts">
	export let tableData: { tokens: number[]; purchaseCosts: bigint[]; saleReturns: bigint[] };

	function formatWeiToEther(wei: bigint, decimals: number = 18): string {
		// Convert to string and handle Wei scaling manually
		const weiString = wei.toString();

		// Ensure the string is at least 19 digits (1 digit for the whole number, 18 for decimals)
		const etherString = weiString.padStart(decimals + 1, '0'); // Add leading zeros if needed

		// Split into integer and decimal parts
		const integerPart = etherString.slice(0, etherString.length - decimals);
		const decimalPart = etherString.slice(etherString.length - decimals);

		return `${integerPart}.${decimalPart}`;
	}
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
