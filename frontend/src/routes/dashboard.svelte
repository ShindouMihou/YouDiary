<script>
    import { onMount } from "svelte";
    import { axios } from "../requests/ratelimited_axios.svelte";
    import {
        Beaker,
        Check,
        Icon,
        Logout,
        Plus,
X,
    } from "svelte-hero-icons";
    import Container from "../components/container.svelte";
    import Confirmdelete from "../components/confirmdelete.svelte";
    import Error from "../components/error.svelte";
    import sanitize from "sanitize-filename";

    // The host credentials.
    let hostname;
    let bucket;

    // The error message if any.
    let error;

    // The array of containers that 
    let containers = [];

    // Are we on creating mode?
    let createMode = false;

    // The current redirect route.
    let freeRedirect = "/";

    // These are methods to help Svelte understand
    // what we are deleting and are we on deleting mode?
    let deleteMode = false;
    let deletingName = null;


    /**
     * Logs the user out of the bucket by removing their credential 
     * information from the local storage.
     */
    function destroy() {
        localStorage.removeItem("hostname");
        localStorage.removeItem("bucket");

        document.querySelector("#red_home").click();
    }

    /**
     * Displays the delete confirmation menu.
     */
    function createDiary() {
        createMode = !createMode;
    }

    /**
     * Redirect to the specified redirect location using a sketchy 
     * technique that tricks Svelte into redirecting.
     */
    function upsert() {
        const freeRad = document.querySelector("#free_red");
        freeRad.click();
    }

    /**
     * Updates the free redirection path.
     * @param value The new redirection name path, only works for diaries.
     */
    function updateFreeRedirect(value) {
        freeRedirect = encodeURI(`/diary/${sanitize(value)}`);
    }


    onMount(async () => {
        try {
            bucket = localStorage.getItem("bucket");
            hostname = localStorage.getItem("hostname");

            if (bucket == null || hostname == null) {
                document.querySelector("#red_home").click();
                return;
            }

            document.querySelector("#loading").classList.add("hidden");
            document.querySelector("#content").classList.remove("hidden");

            const response = await axios.get(`${hostname}/?bucket=${bucket}`, {
                responseType: "json",
            });

            if (response.status != 200) {
                document.querySelector("#red_home").click();
                return;
            }

            if (response.data.containers == null) {
                document.querySelector("#red_home").click();
                return;
            }

            containers = response.data.containers;
            window.showDeleteConfirmation = (event) => {
                if (deleteMode) {
                    return;
                }

                deleteMode = true;
                deletingName = event.dataset.container;
            };

            window.hideDeleteConfirmation = (event) => {
                if (!deleteMode) {
                    return;
                }

                deleteMode = false;
                deletingName = null;
            };

            window.deleteConfirmation = async (event) => {
                try {
                    if (!(deleteMode && deletingName)) {
                        return;
                    }

                    const response = await axios.delete(
                        `${hostname}/${deletingName}/?bucket=${bucket}`
                    );

                    containers = containers.filter(object => object !== deletingName);
                    deleteMode = false;
                    deletingName = null;
                } catch (err) {
                    console.error(err);
                    error = err.message;
                }
            };

        } catch (err) {
            if (err.message.includes('400')) {
                localStorage.removeItem("hostname");
                localStorage.removeItem("bucket");

                document.querySelector("#red_home").click();
                return;
            }
            
            document.querySelector("#red_home").click();
            return;
        }
    });
</script>

<div class="min-h-screen bg-neutral-900 text-white opensans flex" id="loading">
    <div class="m-auto">
        <Icon src={Beaker} solid class="h-12 w-12 animate-bounce" />
    </div>
    <a href="/" alt="Home" class="hidden" id="red_home"> </a>
    <a href={freeRedirect} alt="Free Redirect" class="hidden" id="free_red"> </a>
</div>
<div
    class="min-h-screen bg-neutral-900 text-white opensans hidden"
    id="content"
>
    <div class="p-12 min-h-screen">
        <div class="flex flex-col my-auto">
            <div class="w-full flex flex-row gap-4">
                <h2 class="text-neutral-500 font-bold text-lg uppercase">
                    YouDiary
                </h2>
                <button on:click={destroy} data-tippy-content="Logout">
                    <Icon
                        src={Logout}
                        class="h-6 w-6 text-neutral-500 hover:opacity-80 duration-[250ms]"
                    />
                </button>
                <button on:click={createDiary} id="createButton" data-tippy-content="New">
                    <Icon
                        src={Plus}
                        class="h-6 w-6 text-neutral-500 hover:opacity-80 duration-[250ms]"
                    />
                </button>
            </div>
            <div class="flex flex-col gap-2 py-4">
                {#if error != null}
                <Error message={error}></Error>
                {/if}
                {#if deleteMode}
                    <Confirmdelete name={deletingName} />
                {/if}
                {#if createMode}
                    <div
                        class="w-full p-4 bg-neutral-800 text-white flex flex-row justify-between"
                    >
                        <input
                            type="text"
                            on:input={(event) =>
                                updateFreeRedirect(event.target.value)}
                            placeholder="Name"
                            class="font-bold p-1 bg-neutral-800 rounded-sm outline-none w-full"
                        />
                        <div class="flex flex-row gap-2">
                            <button on:click={createDiary} data-tippy-content="Cancel">
                                <Icon
                                    src={X}
                                    class="h-6 w-6 text-red-600 hover:opacity-80 duration-[250ms]"
                                    solid
                                />
                            </button>
                            <button on:click={upsert} data-tippy-content="Confirm">
                                <Icon
                                    src={Check}
                                    class="h-6 w-6 text-green-600 hover:opacity-80 duration-[250ms]"
                                    solid
                                />
                            </button>
                        </div>
                    </div>
                {/if}
                {#each containers as container}
                    <Container name={container} />
                {/each}
            </div>
        </div>
    </div>
</div>
