import Arweave from 'arweave';
import { EncryptionService } from './encryptionService';
import path from 'path';
import { readFileSync } from 'fs';

export class EncryptedArweaveService {
    private arweave: Arweave;
    private wallet: any;
    private encryptionService: EncryptionService;

    constructor(walletPath: string, encryptionKey: string) {
        this.arweave = new Arweave({
            host: 'arweave.net',
            port: 443,
            protocol: 'https'
        });
        
        // this.wallet = require(walletPath);
        // Read the wallet file directly instead of using require
        const resolvedWalletPath = path.resolve(walletPath);
        this.wallet = JSON.parse(readFileSync(resolvedWalletPath, 'utf-8'));
        this.encryptionService = new EncryptionService(encryptionKey);
    }

    async uploadEncryptedJson(data: any): Promise<string> {
        try {
            // Encrypt the data
            const encryptedData = this.encryptionService.encrypt(data);

            // Create transaction
            const transaction = await this.arweave.createTransaction({
                data: encryptedData
            }, this.wallet);

            // Add tags to identify this as encrypted data
            transaction.addTag('Content-Type', 'application/encrypted+json');
            transaction.addTag('Encryption', 'AES');

            // Sign transaction
            await this.arweave.transactions.sign(transaction, this.wallet);

            // Submit transaction
            const response = await this.arweave.transactions.post(transaction);

            if (response.status === 200) {
                return transaction.id;
            } else {
                throw new Error('Failed to upload to Arweave');
            }
        } catch (error) {
            console.error('Error uploading to Arweave:', error);
            throw error;
        }
    }

    async fetchAndDecryptJson(transactionId: string): Promise<any> {
        try {
            // Get transaction data
            const data = await this.arweave.transactions.getData(transactionId, {
                decode: true,
                string: true
            });

            // Decrypt the data
            return this.encryptionService.decrypt(data as string);
        } catch (error: any) {
            console.error('Error fetching from Arweave:', error);
            throw error;
        }
    }
}