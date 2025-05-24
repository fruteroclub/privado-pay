import { privateKeyToAccount } from 'viem/accounts'

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
// const privateKey = generatePrivateKey();

const account = privateKeyToAccount(privateKey) 
 
export const createWallet = () => {
    return {
        account
    }
}