<script>
    let publicKey = "";
    let privateKey = "";

    async function generateKeys() {
        try {
            const keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "ECDSA",
                    namedCurve: "P-256"
                },
                true,
                ["sign", "verify"]
            );

            const publicKeyExported = await window.crypto.subtle.exportKey(
                "spki",
                keyPair.publicKey
            );
            
            const privateKeyExported = await window.crypto.subtle.exportKey(
                "pkcs8",
                keyPair.privateKey
            );

            publicKey = btoa(String.fromCharCode(...new Uint8Array(publicKeyExported)));
            privateKey = btoa(String.fromCharCode(...new Uint8Array(privateKeyExported)));
        } catch (error) {
            console.error('Error generating keys:', error);
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Copied to clipboard!'))
            .catch(err => console.error('Failed to copy:', err));
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#302d41] p-4">
    <div class="container mx-auto max-w-3xl">
        <div class="backdrop-blur-lg bg-[#1e1e2e]/70 border border-[#6e6c7e]/20 rounded-xl shadow-xl p-6">
            <h2 class="text-2xl font-bold mb-2 text-[#cdd6f4]">Elliptic Curve Key Generator</h2>
            <p class="text-[#a6adc8] mb-6">Generate ECDSA P-256 keypairs for this website!</p>
            <p class="text-[#a6adc8] mb-6">Client-side and on the browser!</p>
            
            <button 
                on:click={generateKeys}
                class="w-full bg-gradient-to-r from-[#89b4fa] to-[#cba6f7] hover:from-[#74c7ec] hover:to-[#f5c2e7] 
                       text-[#1e1e2e] font-medium py-2.5 px-4 rounded-lg transition-all duration-300 
                       shadow-lg hover:shadow-[#89b4fa]/25 mb-6"
            >
                Generate New Keypair
            </button>

            {#if publicKey}
                <div class="mb-6 space-y-2">
                    <label class="block text-sm font-medium text-[#cdd6f4]">
                        Public Key (Base64)
                    </label>
                    <div class="flex gap-2">
                        <input 
                            type="text"
                            readonly
                            value={publicKey}
                            class="flex-1 p-2.5 rounded-lg bg-[#313244]/50 border border-[#6e6c7e]/50 
                                   text-[#cdd6f4] focus:ring-2 focus:ring-[#89b4fa] focus:border-[#89b4fa]"
                        />
                        <button 
                            on:click={() => copyToClipboard(publicKey)}
                            class="px-4 py-2 bg-[#45475a]/50 hover:bg-[#45475a] text-[#cdd6f4] 
                                   rounded-lg transition-all duration-200 border border-[#6e6c7e]/50"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            {/if}

            {#if privateKey}
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-[#cdd6f4]">
                        Private Key (Base64)
                    </label>
                    <div class="bg-[#f9e2af]/10 border-l-4 border-[#f9e2af] p-4 mb-4">
                        <p class="text-[#f9e2af]">Keep this private key secure and never share it!</p>
                    </div>
                    <div class="flex gap-2">
                        <input 
                            type="password"
                            readonly
                            value={privateKey}
                            class="flex-1 p-2.5 rounded-lg bg-[#313244]/50 border border-[#6e6c7e]/50 
                                   text-[#cdd6f4] focus:ring-2 focus:ring-[#89b4fa] focus:border-[#89b4fa]"
                        />
                        <button 
                            on:click={() => copyToClipboard(privateKey)}
                            class="px-4 py-2 bg-[#45475a]/50 hover:bg-[#45475a] text-[#cdd6f4] 
                                   rounded-lg transition-all duration-200 border border-[#6e6c7e]/50"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>