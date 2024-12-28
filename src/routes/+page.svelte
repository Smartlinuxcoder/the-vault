<script>
    import { onMount } from 'svelte';
    import Crypto from '$lib/crypto'; // Assuming the class is in lib/crypto.js
    
    let crypto;
    let message = '';
    let encrypted = '';
    let decrypted = '';
    let error = '';
    let encryptionKeys;
    let iv;

    // Store for persisting keys between encryptions
    let encryptionKey;

    onMount(async () => {
        try {
            crypto = new Crypto();
            // Generate encryption keys on component mount
            encryptionKeys = await crypto.generateEncryptionKeys();
            
            // Derive an AES key for encryption/decryption
            const sharedBits = await window.crypto.subtle.deriveBits(
                {
                    name: "ECDH",
                    public: encryptionKeys.publicKey
                },
                encryptionKeys.privateKey,
                256
            );

            // Import the derived bits as an AES key
            encryptionKey = await window.crypto.subtle.importKey(
                "raw",
                sharedBits,
                "AES-GCM",
                false,
                ["encrypt", "decrypt"]
            );
        } catch (err) {
            error = `Initialization failed: ${err.message}`;
            console.error('Initialization failed:', err);
        }
    });

    async function handleEncrypt() {
        try {
            error = '';
            if (!message) {
                throw new Error('Please enter a message to encrypt');
            }
            if (!encryptionKey) {
                throw new Error('Encryption key not initialized');
            }

            const result = await crypto.encrypt(message, encryptionKey);
            // Store the IV for decryption
            iv = result.iv;
            // Convert the encrypted data to base64 for display
            encrypted = btoa(
                String.fromCharCode.apply(null, 
                    new Uint8Array(result.encrypted)
                )
            );
        } catch (err) {
            error = err.message;
            console.error('Encryption failed:', err);
        }
    }

    async function handleDecrypt() {
        try {
            error = '';
            if (!encrypted) {
                throw new Error('No encrypted message to decrypt');
            }
            if (!encryptionKey) {
                throw new Error('Decryption key not initialized');
            }

            // Convert base64 back to ArrayBuffer
            const encryptedData = new Uint8Array(
                atob(encrypted)
                    .split('')
                    .map(char => char.charCodeAt(0))
            ).buffer;

            decrypted = await crypto.decrypt(encryptedData, encryptionKey, iv);
        } catch (err) {
            error = err.message;
            console.error('Decryption failed:', err);
        }
    }

    function clearAll() {
        message = '';
        encrypted = '';
        decrypted = '';
        error = '';
    }
</script>

<div class="p-4">
    <div class="space-y-4">
        <!-- Message Input -->
        <div class="flex flex-col space-y-2">
            <label for="message" class="text-sm font-medium text-gray-700">
                Message to Encrypt
            </label>
            <div class="flex space-x-2">
                <input 
                    id="message"
                    bind:value={message} 
                    placeholder="Enter message" 
                    class="flex-1 border text-black p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                    on:click={handleEncrypt}
                    disabled={!message}
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Encrypt
                </button>
            </div>
        </div>

        <!-- Encrypted Message -->
        {#if encrypted}
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                    Encrypted Message
                </label>
                <div class="p-3 bg-gray-100 rounded break-all text-black">
                    {encrypted}
                </div>
                <button 
                    on:click={handleDecrypt}
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Decrypt
                </button>
            </div>
        {/if}

        <!-- Decrypted Message -->
        {#if decrypted}
            <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                    Decrypted Message
                </label>
                <div class="p-3 bg-gray-100 rounded text-black">
                    {decrypted}
                </div>
            </div>
        {/if}

        <!-- Error Message -->
        {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span class="block sm:inline">{error}</span>
            </div>
        {/if}

        <!-- Clear Button -->
        {#if message || encrypted || decrypted}
            <button 
                on:click={clearAll}
                class="mt-4 text-gray-600 hover:text-gray-800 underline focus:outline-none"
            >
                Clear All
            </button>
        {/if}
    </div>
</div>