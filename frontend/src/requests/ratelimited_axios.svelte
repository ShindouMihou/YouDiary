<script context="module">
    import axios_http from "axios";
    import rateLimit from "axios-rate-limit";

    // The actual ratelimit is 2 per second, but to be safe, we should request below that.
    export const axios = rateLimit(axios_http.create(), {
        maxRequests: 2,
        perMilliseconds: 750,
    });
</script>
