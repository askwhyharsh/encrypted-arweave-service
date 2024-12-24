import { EncryptedArweaveService } from '../src/services/arweaveService';
import path from 'path';
import { describe, test, expect, beforeAll } from '@jest/globals';

describe('ArweaveService', () => {
    let arweaveService: EncryptedArweaveService;
    const testData = {
        "financial_profile": [
            {"Attribute": "EBITDA/Revenues", "value": 0.1},
            {"Attribute": "Net Interest Income/Earning Assets", "value": 0.15},
        ]
    };
    
    beforeAll(() => {
        // Initialize service with wallet path and a test encryption key
        const walletPath = path.resolve(__dirname, '../../wallet.json');
        const encryptionKey = 'test-encryption-key-32-chars-long!!';
        arweaveService = new EncryptedArweaveService(walletPath, encryptionKey);
    });

    test('should encrypt and upload JSON', async () => {
        console.log('Starting encryption and upload test with data:', JSON.stringify(testData, null, 2));
        
        // Act
        const transactionId = await arweaveService.uploadEncryptedJson(testData);
        
        console.log('Upload complete. Transaction ID:', transactionId);

        // Assert
        expect(transactionId).toBeDefined();
        expect(typeof transactionId).toBe('string');
        expect(transactionId.length).toBeGreaterThan(0);
    }, 30000); // Increased timeout for Arweave transaction

    test('should fetch and decrypt JSON', async () => {
        // Arrange
        console.log('Starting fetch and decrypt test...');
        const transactionId = await arweaveService.uploadEncryptedJson(testData);
        console.log('Test data uploaded. Transaction ID:', transactionId);

        console.log('Waiting for transaction to be mined and propagated...');
        // Increase wait time to 20 seconds
        await new Promise(resolve => setTimeout(resolve, 20000));
        
        // Add retry logic
        let retries = 3;
        let decryptedData;
        
        while (retries > 0) {
            try {
                console.log(`Attempting to fetch and decrypt data (${retries} retries left)...`);
                decryptedData = await arweaveService.fetchAndDecryptJson(transactionId);
                break; // If successful, exit the loop
            } catch (error: any) {
                console.log(`Attempt failed: ${error.message}`);
                retries--;
                if (retries > 0) {
                    console.log('Waiting before retry...');
                    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds between retries
                } else {
                    throw error; // If all retries failed, throw the error
                }
            }
        }

        console.log('Decrypted data:', JSON.stringify(decryptedData, null, 2));

        // Assert
        expect(decryptedData).toBeDefined();
        expect(decryptedData).toHaveProperty('financial_profile');
        expect(Array.isArray(decryptedData.financial_profile)).toBeTruthy();
        expect(decryptedData.financial_profile[0]).toHaveProperty('Attribute');
        expect(decryptedData.financial_profile[0]).toHaveProperty('value');
        expect(decryptedData).toEqual(testData);
    }, 60000); // Increased timeout to 60 seconds to accommodate retries
}); 