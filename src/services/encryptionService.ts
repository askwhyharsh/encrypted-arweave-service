import CryptoJS from 'crypto-js';

export class EncryptionService {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    encrypt(data: any): string {
        const jsonString = JSON.stringify(data);
        return CryptoJS.AES.encrypt(jsonString, this.secretKey).toString();
    }

    decrypt(encryptedData: string): any {
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    }
} 