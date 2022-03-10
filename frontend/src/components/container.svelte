<script>
    import { Icon, X } from "svelte-hero-icons";

    export let name;
</script>

<div class="w-full p-4 bg-neutral-800 text-white flex flex-row justify-between container-next" data-container={name}>
    <a href="/diary/{name}" class="font-bold">{name}</a>
    <div class="flex flex-row gap-2">
        <button class="delete_container" data-container={name} onclick="showDeleteConfirmation(this)">
            <Icon src={X} class="h-6 w-6 text-red-600 hover:opacity-80 duration-[250ms]" solid></Icon>
        </button>
    </div>
</div>
