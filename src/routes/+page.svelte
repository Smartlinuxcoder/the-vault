<script>
    import { goto } from '$app/navigation';

    let publicKey = "";
    let error = "";

    async function validateAndStore() {
        try {
            // Validate base64
            const binaryKey = Uint8Array.from(atob(publicKey), c => c.charCodeAt(0));
            
            // Try to import as SPKI public key
            await window.crypto.subtle.importKey(
                "spki",
                binaryKey,
                {
                    name: "ECDSA",
                    namedCurve: "P-256"
                },
                true,
                ["verify"]
            );

            // cookie for 30days
            document.cookie = `vault_pubkey=${encodeURIComponent(publicKey)};path=/;max-age=2592000;SameSite=Strict`;
            
            goto('/dashboard');
        } catch (err) {
            error = "Invalid public key format. Please use a valid ECDSA P-256 public key in base64 format.";
            console.error(err);
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#302d41] p-4">
    <div class="container mx-auto max-w-3xl">
        <div class="backdrop-blur-lg bg-[#1e1e2e]/70 border border-[#6e6c7e]/20 rounded-xl shadow-xl p-6">
            <h2 class="text-2xl font-bold mb-2 text-[#cdd6f4]">The Vault</h2>
            <p class="text-[#a6adc8] mb-6">Your encrypted cloud storage, secured by you.</p>

            <div class="mb-6 space-y-2">
                <label class="block text-sm font-medium text-[#cdd6f4]">
                    Your Public Key (Base64 SPKI format)
                </label>
                <input 
                    type="text"
                    bind:value={publicKey}
                    placeholder="Paste your public key here..."
                    class="w-full p-2.5 rounded-lg bg-[#313244]/50 border border-[#6e6c7e]/50 
                           text-[#cdd6f4] focus:ring-2 focus:ring-[#89b4fa] focus:border-[#89b4fa]"
                />
                {#if error}
                    <p class="text-[#f38ba8] text-sm">{error}</p>
                {/if}
            </div>

            <button 
                on:click={validateAndStore}
                class="w-full bg-gradient-to-r from-[#89b4fa] to-[#cba6f7] hover:from-[#74c7ec] hover:to-[#f5c2e7] 
                       text-[#1e1e2e] font-medium py-2.5 px-4 rounded-lg transition-all duration-300 
                       shadow-lg hover:shadow-[#89b4fa]/25"
            >
                Enter Vault
            </button>

            <div class="mt-6 p-4 bg-[#313244]/30 rounded-lg">
                <p class="text-[#a6adc8] text-sm">
                    Don't have a key pair? <a href="/keys" class="text-[#89b4fa] hover:text-[#74c7ec]">Generate one here</a>
                </p>
            </div>
        </div>
    </div>
</div>