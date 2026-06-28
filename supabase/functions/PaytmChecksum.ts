import crypto from "node:crypto";

export class PaytmChecksum {
    static iv = "@@@@&&&&####$$$$";

    static encrypt(input: string, key: string): string {
        const cipher = crypto.createCipheriv("aes-128-cbc", key, PaytmChecksum.iv);
        let encrypted = cipher.update(input, "binary", "base64");
        encrypted += cipher.final("base64");
        return encrypted;
    }

    static decrypt(encrypted: string, key: string): string {
        const decipher = crypto.createDecipheriv("aes-128-cbc", key, PaytmChecksum.iv);
        let decrypted = decipher.update(encrypted, "base64", "binary");
        try {
            decrypted += decipher.final("binary");
        } catch (e) {
            console.error("Decryption error:", e);
        }
        return decrypted;
    }

    static generateSignature(params: any, key: string): Promise<string> {
        if (typeof params !== "object" && typeof params !== "string") {
            const error = "string or object expected, " + (typeof params) + " given.";
            return Promise.reject(error);
        }
        let paramString = params;
        if (typeof params !== "string") {
            paramString = PaytmChecksum.getStringByParams(params);
        }
        return PaytmChecksum.generateSignatureByString(paramString, key);
    }

    static verifySignature(params: any, key: string, checksum: string): boolean {
        if (typeof params !== "object" && typeof params !== "string") {
            return false;
        }
        let paramString = params;
        if (typeof params !== "string") {
            // Create a copy to prevent mutation of the original object
            const copyParams = { ...params };
            if (copyParams.hasOwnProperty("CHECKSUMHASH")) {
                delete copyParams.CHECKSUMHASH;
            }
            paramString = PaytmChecksum.getStringByParams(copyParams);
        }
        return PaytmChecksum.verifySignatureByString(paramString, key, checksum);
    }

    static async generateSignatureByString(params: string, key: string): Promise<string> {
        const salt = await PaytmChecksum.generateRandomString(4);
        return PaytmChecksum.calculateChecksum(params, key, salt);
    }

    static verifySignatureByString(params: string, key: string, checksum: string): boolean {
        const paytmHash = PaytmChecksum.decrypt(checksum, key);
        const salt = paytmHash.substring(paytmHash.length - 4);
        return paytmHash === PaytmChecksum.calculateHash(params, salt);
    }

    static generateRandomString(length: number): Promise<string> {
        return new Promise(function (resolve, reject) {
            // 3 bytes maps to 4 characters in base64
            crypto.randomBytes(3, function (err, buf) {
                if (!err) {
                    const salt = buf.toString("base64");
                    resolve(salt);
                } else {
                    console.error("error occurred in generateRandomString: ", err);
                    reject(err);
                }
            });
        });
    }

    static getStringByParams(params: any): string {
        const data: Record<string, string> = {};
        Object.keys(params).sort().forEach(function (key) {
            data[key] = (params[key] !== null && params[key] !== undefined) ? String(params[key]) : "";
        });
        return Object.values(data).join("|");
    }

    static calculateHash(params: string, salt: string): string {
        const finalString = params + "|" + salt;
        return crypto.createHash("sha256").update(finalString).digest("hex") + salt;
    }

    static calculateChecksum(params: string, key: string, salt: string): string {
        const hashString = PaytmChecksum.calculateHash(params, salt);
        return PaytmChecksum.encrypt(hashString, key);
    }
}
