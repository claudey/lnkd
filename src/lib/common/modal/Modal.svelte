<script context="module">
	import { writable } from "svelte/store";

	let open = writable(false);
	export const openModal = () => {
		open.set(true)
	}

	export const closeModal = () => open.set(false);
</script>

<script>
	import { fly } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let isOpen = false;

	let modalClosed = () => dispatch("modalClosed");

	$: if (isOpen) open.set(true);
</script>

{#if $open}
<div class="fixed z-20 inset-0 overflow-y-auto">
	<div
		class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
	>
		<!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
		<div class="fixed inset-0 transition-opacity" aria-hidden="true">
			<div class="absolute inset-0 bg-gray-800 opacity-75" />
		</div>

		<!-- This element is to trick the browser into centering the modal contents. -->
		<span
			class="hidden sm:inline-block sm:align-middle sm:h-screen"
			aria-hidden="true">&#8203;</span
		>
		<!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
		<div
			class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full"
			in:fly={{ y: -100, delay: 200 }}
			out:fly={{ y: -200 }}
			on:outroend={modalClosed}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-headline"
		>
			<slot close={closeModal} />
		</div>
	</div>
</div>
{/if}
