<script>
    import { Exclamation, Icon } from "svelte-hero-icons";

    export let message;
</script>

<div class="w-full flex flex-row gap-2 items-center bg-red-600 text-white font-bold p-4">
    <Icon src={Exclamation} class="h-6 w-6 text-white"/>
    <h2>{message}</h2>
</div>
