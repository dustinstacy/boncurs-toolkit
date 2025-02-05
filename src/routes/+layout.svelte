<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<header>Headie</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>Footie</p>
	</footer>
</div>

<style>
	@import './styles.css';
</style>
