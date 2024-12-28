class Crypto {
    constructor() {
        // Initialize with standard algorithms and curves
        this.encryptionAlgorithm = {
            name: "AES-GCM",
            length: 256
        };
        this.signingAlgorithm = {
            name: "ECDSA",
            namedCurve: "P-256",
            hash: { name: "SHA-256" }
        };
    }

    /**
     * Generate a key pair for encryption
     * @returns {Promise<CryptoKeyPair>}
     */
    async generateEncryptionKeys() {
        return await window.crypto.subtle.generateKey(
            {
                name: "ECDH",
                namedCurve: "P-256"
            },
            true,
            ["deriveKey", "deriveBits"]
        );
    }

    /**
     * Generate a key pair for signing
     * @returns {Promise<CryptoKeyPair>}
     */
    async generateSigningKeys() {
        return await window.crypto.subtle.generateKey(
            this.signingAlgorithm,
            true,
            ["sign", "verify"]
        );
    }

    /**
     * Encrypt data
     * @param {ArrayBuffer|String} data - Data to encrypt
     * @param {CryptoKey} key - Encryption key
     * @returns {Promise<{encrypted: ArrayBuffer, iv: Uint8Array}>}
     */
    async encrypt(data, key) {
        try {
            // Convert string to ArrayBuffer if necessary
            const dataBuffer = (typeof data === 'string') 
                ? new TextEncoder().encode(data) 
                : data;

            // Generate a random IV
            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                dataBuffer
            );

            return {
                encrypted: encrypted,
                iv: iv
            };
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypt data
     * @param {ArrayBuffer} encryptedData - Data to decrypt
     * @param {CryptoKey} key - Decryption key
     * @param {Uint8Array} iv - Initialization vector used for encryption
     * @param {boolean} [asString=true] - Whether to return the result as a string
     * @returns {Promise<string|ArrayBuffer>}
     */
    async decrypt(encryptedData, key, iv, asString = true) {
        try {
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                encryptedData
            );

            if (asString) {
                return new TextDecoder().decode(decrypted);
            }
            return decrypted;
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Sign data
     * @param {ArrayBuffer|String} data - Data to sign
     * @param {CryptoKey} privateKey - Private key for signing
     * @returns {Promise<ArrayBuffer>}
     */
    async sign(data, privateKey) {
        try {
            const dataBuffer = (typeof data === 'string')
                ? new TextEncoder().encode(data)
                : data;

            return await window.crypto.subtle.sign(
                {
                    name: this.signingAlgorithm.name,
                    hash: this.signingAlgorithm.hash
                },
                privateKey,
                dataBuffer
            );
        } catch (error) {
            throw new Error(`Signing failed: ${error.message}`);
        }
    }

    /**
     * Verify a signature
     * @param {ArrayBuffer} signature - Signature to verify
     * @param {ArrayBuffer|String} data - Original data
     * @param {CryptoKey} publicKey - Public key for verification
     * @returns {Promise<boolean>}
     */
    async verify(signature, data, publicKey) {
        try {
            const dataBuffer = (typeof data === 'string')
                ? new TextEncoder().encode(data)
                : data;

            return await window.crypto.subtle.verify(
                {
                    name: this.signingAlgorithm.name,
                    hash: this.signingAlgorithm.hash
                },
                publicKey,
                signature,
                dataBuffer
            );
        } catch (error) {
            throw new Error(`Verification failed: ${error.message}`);
        }
    }

    /**
     * Export a public key
     * @param {CryptoKey} key - Key to export
     * @returns {Promise<ArrayBuffer>}
     */
    async exportPublicKey(key) {
        try {
            return await window.crypto.subtle.exportKey("spki", key);
        } catch (error) {
            throw new Error(`Key export failed: ${error.message}`);
        }
    }

    /**
     * Import a public key
     * @param {ArrayBuffer} keyData - Exported key data
     * @param {string} [usage="encrypt"] - Key usage: "encrypt" or "verify"
     * @returns {Promise<CryptoKey>}
     */
    async importPublicKey(keyData, usage = "encrypt") {
        try {
            const algorithm = usage === "encrypt" 
                ? { name: "ECDH", namedCurve: "P-256" }
                : this.signingAlgorithm;
            
            const usages = usage === "encrypt" 
                ? ["deriveKey", "deriveBits"]
                : ["verify"];

            return await window.crypto.subtle.importKey(
                "spki",
                keyData,
                algorithm,
                true,
                usages
            );
        } catch (error) {
            throw new Error(`Key import failed: ${error.message}`);
        }
    }
}

// Example usage:
async function example() {
    const crypto = new Crypto();

    try {
        // Generate keys for encryption
        const encryptionKeys = await crypto.generateEncryptionKeys();
        
        // Generate keys for signing
        const signingKeys = await crypto.generateSigningKeys();

        // Example data
        const data = "Hello, World!";

        // Sign the data
        const signature = await crypto.sign(data, signingKeys.privateKey);
        
        // Verify the signature
        const isValid = await crypto.verify(
            signature,
            data,
            signingKeys.publicKey
        );
        console.log("Signature valid:", isValid);

        // Export public key for sharing
        const exportedPublicKey = await crypto.exportPublicKey(
            encryptionKeys.publicKey
        );
        
        // Import the public key
        const importedPublicKey = await crypto.importPublicKey(
            exportedPublicKey,
            "encrypt"
        );

        console.log("Keys exported and imported successfully");

    } catch (error) {
        console.error("Error:", error);
    }
}

export default Crypto;