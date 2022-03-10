<script>
    import { Beaker, Code, Exclamation, Home, Icon, Refresh, SaveAs } from "svelte-hero-icons";
    import { marked } from "marked";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { axios } from "../../../requests/ratelimited_axios.svelte";
    import emoji from 'node-emoji';
    import hljs from 'highlight.js';
    import {encode, trim} from 'url-safe-base64';

    // The host credential information.
    let hostname;
    let bucket;

    // The current value of the textarea.
    let value = "";

    // The amount of words calculated from value.
    let words = 0;

    // The current text mode: 0 = raw, 1 = markdown.
    let mode = 0;

    // This is a lock to prevent saving too much.
    let lock = false;

    // The file name that is being used.
    const file = $page.params.name;

    // The error message if any.
    let error;

    /**
     * Updates the word count based on the value provided.
     * @param value The value provided.
     */
    function updateWords(value) {
        if (value === "") {
            words = 0;
            return;
        }

        words = value.trim().split(" ").length;
    }

    /**
     * Translates :emojis: into their emoji form, credits to 
     * https://github.com/markedjs/marked/issues/233#issuecomment-323943368.
     * 
     * @param markdown  The markdown to translate.
     */
    function emojis(markdown) {
        const replacer = (match) => emoji.emojify(match);
        markdown = markdown.replace(/(:.*:)/g, replacer);

        return markdown;
    }

    /**
     * Switches between markdown mode and raw mode.
     */
    function switchMode() {
        if (mode === 0) {
            mode = 1;
            document.querySelector("#text").classList.add("hidden");
            document.querySelector("#markdown").classList.remove("hidden");
        } else {
            mode = 0;
            document.querySelector("#text").classList.remove("hidden");
            document.querySelector("#markdown").classList.add("hidden");
        }
    }

    /**
     * Saves the content into the database.
     */
    async function save() {
        try {
            if (lock) {
                return;
            }

            lock = true;
            document.querySelector("#text").disabled = true;
            const response = await axios.put(
                `${hostname}/${file}/?bucket=${bucket}`,
                {
                    content: value
                }
            );

            setTimeout(() => {
                lock = false;
                document.querySelector("#text").disabled = false;
            }, 250);
        } catch (err) {
            return;
        }
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

            const response = await axios.get(
                `${hostname}/${trim(btoa(file))}.json?bucket=${bucket}`,
                {
                    responseType: "json",
                }
            );

            if (response.status != 200) {
                return;
            }

            if (response.data.content == null) {
                return;
            }

            value = response.data.content.replace(/&gt;+/g, '>');
            updateWords(value);
            document.onkeyup = event => {
                if (event.ctrlKey && event.key === 's') {
                    event.preventDefault();
                    save();
                }
            };
        } catch (err) {
            if (err.message.includes('404')) {
                return;
            }

            error = err.message;

            setTimeout(() => {
                error = null;
            }, 2500);
            return;
        }
    });
</script>

<svelte:head>
    <title>YourDiary | {file}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/atom-one-dark.min.css">
</svelte:head>

<div class="min-h-screen bg-neutral-900 text-white opensans flex" id="loading">
    <div class="m-auto">
        <Icon src={Beaker} solid class="h-12 w-12 animate-bounce" />
    </div>
    <a href="/" alt="Home" class="hidden" id="red_home"> </a>
</div>
<div
    class="min-h-screen bg-neutral-900 text-white opensans hidden"
    id="content"
>
    <div class="px-6 md:px-12 flex flex-col w-full">
        <div class="w-full py-6">
            <h2 class="text-neutral-500 font-bold text-lg uppercase p-0 m-0 border-b-0 leading-none">{file}</h2>
        </div>
        {#if lock}
        <div class="fixed top-5 z-50">
            <div class="p-4 align-middle flex flex-row gap-2 items-center m-auto bg-neutral-800 rounded-sm">
                <Icon src={Refresh} class="h-6 w-6 animate-spin"/>
                <p>Saving...</p>
            </div>
        </div>
        {/if}
        {#if error != null}
        <div class="fixed top-5 z-50">
            <div class="p-4 align-middle flex flex-row gap-2 items-center m-auto bg-red-800 rounded-sm">
                <Icon src={Exclamation} class="h-6 w-6 text-white"/>
                <p>{error}</p>
            </div>
        </div>
        {/if}
        <div class="fixed bottom-5 right-5 z-50 bg-neutral-900 p-4 rounded shadow shadow-black">
            <div class="flex flex-row justify-between gap-4">
                <div class="flex flex-row gap-2 text-neutral-500 align-middle items-center">
                    <h4 class="text-neutral-500 font-bold text-lg uppercase m-0">
                        {words} words
                    </h4>
                    <button on:click={switchMode} aria-label="Markdown/Raw Mode">
                        <Icon src={Beaker} solid={mode === 0 ? false : true} class="h-6 w-6" />
                    </button>
                    <button on:click={save} aria-label="Save">
                        <Icon src={SaveAs} solid class="h-6 w-6" />
                    </button>
                    <a href="/dashboard" class="text-neutral-500 underline-none">
                        <Icon src={Home} solid class="h-6 w-6"/>
                    </a>
                </div>
            </div>
        </div>
        <div class="hidden text-2xl min-h-screen resize-none py-2 markdown" id="markdown">
            {@html marked(emojis(value), {
                smartypants: true,
                gfm: true,
                highlight: (code, lang) => {
                    if (lang == '') {
                        return hljs.highlightAuto(code).value;
                    }

                    return hljs.highlight(lang, code).value;
                }
            })}
        </div>
        <textarea
            class="text-neutral-50 bg-neutral-900 outline-none text-base placeholder:text-neutral-600 min-h-screen resize-none selection:text-black selection:bg-white"
            bind:value
            placeholder="You are who defines the limitations of what you can write."
            on:input={(event) => updateWords(event.target.value)}
            id="text"
        />
    </div>
</div>
