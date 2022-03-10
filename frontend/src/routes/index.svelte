<script>
    import { onMount } from "svelte";
    import Error from "../components/error.svelte";
    import { Beaker, Icon } from "svelte-hero-icons";
    import { axios } from "../requests/ratelimited_axios.svelte";

    // The host credentials if present.
    let hostname;
    let bucket;

    // The error message if any.
    let error = null;

    /**
     * Attempts to store the data onto the local storage if 
     * all the credentials and host accepts.
     */
    async function store() {
        try {
            if (hostname == null || bucket == null) {
                error = "One of the fields is missing.";
                return;
            }

            const response = await axios.get(`${hostname}/?bucket=${bucket}`);
            if (response.status != 200) {
                error = `The hostname returned a ${response.status} code, is it possible that the bucket is wrong?`;
                return;
            }

            if (response.data.containers == null) {
                error = `Invalid hostname.`;
                return;
            }

            error = null;
            localStorage.setItem("hostname", hostname);
            localStorage.setItem("bucket", bucket);
            document.querySelector("#red_dashboard").click();
        } catch (err) {
            error = `${err.message}`;
        }
    }

    onMount(async () => {
        bucket = localStorage.getItem("bucket");
        hostname = localStorage.getItem("hostname");
        document.querySelector("#loading").classList.add("hidden");
        document.querySelector("#content").classList.remove("hidden");

        if (bucket != null && hostname != null) {
            const response = await axios.get(`${hostname}/?bucket=${bucket}`);

            if (response.status != 200) {
                return;
            }

            if (response.data.containers == null) {
                return;
            }

            document.querySelector("#red_dashboard").click();
        }
    });
</script>

<svelte:head>
    <title>YourDiary | Buckets</title>
</svelte:head>

<div class="min-h-screen bg-neutral-900 text-white opensans flex" id="loading">
    <div class="m-auto">
        <Icon src={Beaker} solid class="h-12 w-12 animate-bounce" />
    </div>
    <a href="/dashboard" class="hidden" id="red_dashboard"> </a>
</div>
<div
    class="min-h-screen bg-neutral-900 text-white opensans hidden"
    id="content"
>
    <div class="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div class="p-12 flex flex-col my-auto">
            <div class="w-full">
                <h2 class="text-neutral-500 py-2 font-bold text-3xl uppercase">
                    YouDiary
                </h2>
            </div>
            {#if error != null}
                <div class="w-full py-2" id="errors">
                    <Error message={error} />
                </div>
            {/if}
            <div class="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="http://localhost:2312"
                    class="text-input"
                    bind:value={hostname}
                />
                <input
                    type="text"
                    placeholder="Bucket"
                    class="text-input"
                    bind:value={bucket}
                />
                <button class="basic-button w-full md:w-64" on:click={store}
                    >Login</button
                >
            </div>
        </div>
        <div
            class="food border border-y-0 border-r-0 bg-blue-500 border-white min-h-screen hidden md:block"
        />
    </div>
</div>
