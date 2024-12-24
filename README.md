# lit-ar-enc-dec

A TypeScript package for encrypted data storage on Arweave using Lit Protocol.

## Installation

```bash
npm install lit-ar-enc-dec
```

## Usage

```typescript
import { EncryptedArweaveService } from 'lit-ar-enc-dec';
// path to wallet.json and encryption key
const arweaveService = new EncryptedArweaveService('wallet.json', 'test-encryption-key-32-chars-long!!');

// upload data
const transactionId = await arweaveService.uploadEncryptedJson(data);
// wait for transaction to be mined and propagated before fetching
// fetch and decrypt data
const decryptedData = await arweaveService.fetchAndDecryptJson(transactionId);

console.log('Decrypted data:', decryptedData);
```
