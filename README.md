# encrypted-arweave

A TypeScript package for encrypted data storage using CryptoJS and Arweave.

## Installation

```bash
npm install encrypted-arweave
```

## Usage

```typescript
import { EncryptedArweaveService } from 'encrypted-arweave';
// path to wallet.json and encryption key
const arweaveService = new EncryptedArweaveService('wallet.json', 'test-encryption-key-32-chars-long!!');

// upload data
const transactionId = await arweaveService.uploadEncryptedJson(data);
// wait for transaction to be mined and propagated before fetching
// fetch and decrypt data
const decryptedData = await arweaveService.fetchAndDecryptJson(transactionId);

console.log('Decrypted data:', decryptedData);
```
