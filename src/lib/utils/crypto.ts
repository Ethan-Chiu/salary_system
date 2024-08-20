import crypto from 'crypto';

export class CryptoHelper {
    private static readonly algorithm = 'aes-256-cbc';
    private static readonly key = process.env.CRYPTO_KEY ? Buffer.from(process.env.CRYPTO_KEY, 'hex') : crypto.randomBytes(32);
    private static readonly iv = process.env.CRYPTO_IV ? Buffer.from(process.env.CRYPTO_IV, 'hex') : crypto.randomBytes(16);

    static encrypt(text: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    static decrypt(encryptedText: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    static getEncryptionKey(): string {
        return this.key.toString('hex');
    }

    static getEncryptionIV(): string {
        return this.iv.toString('hex');
    }
}