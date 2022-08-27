import {Coupon} from '../interfaces/allow-list';
import {
    bufferToHex,
    ECDSASignature,
    ecrecover,
    ecsign,
    keccak256,
    privateToAddress,
    pubToAddress,
    toBuffer
} from "ethereumjs-util";
import {ethers} from 'ethers';
import crypto from 'crypto';

import admin from '../utils/firebase-connector';
import adminSigner from '../../admin-signer.json';

const admin_pvtKey = adminSigner['admin_pvtKey']
const admin_pvtKeyString = adminSigner['admin_pvtKeyString']
const admin_signerAddress = adminSigner['admin_signerAddress']

const couponCollection = 'testCoupons'

// const admin_pvtKey = crypto.randomBytes(32);
// const admin_pvtKeyString = admin_pvtKey.toString("hex");
// const admin_signerAddress = ethers.utils.getAddress(
//     privateToAddress(admin_pvtKey).toString("hex"));

class AllowList {

    async addToAllowList(address: string): Promise<void> {
        await this.dbRef('allow-list').doc(address.toLowerCase()).set({address: address.toLowerCase()})
    }

    async getWalletCoupon(address: string): Promise<any> {
        try {
            const coupon = await this.dbRef('testCoupons').doc(address.toLowerCase()).get();
            console.log(coupon)
            return coupon.data()
        } catch (e) {
            return(e)
        }

    }

    async createCoupons() {
        const snapshot = await this.dbRef('allow-list').get();
        snapshot.docs.map( async doc => {
            const data = doc.data();
            const address = data.address;

            const coupon = await this.generateCoupon(address);
            await this.dbRef(couponCollection).doc(address).set(coupon);

            }
        )
    }

    async generateCoupon(allowAddress: string): Promise<any> {
        const hashBuffer = this.generateHashBuffer(
            ["uint256", "address"],
            [2, allowAddress]
        )

        const coupon = this.createCoupon(hashBuffer, toBuffer(admin_pvtKey.data));
        return this.serializeCoupon(coupon)
    }

    // Helper Functions
    createCoupon(hash: Buffer, pvtKey): ECDSASignature {
        return ecsign(hash, pvtKey)
    }

    dbRef(collection) {
        return admin.firestore().collection(collection);
    }

    generateHashBuffer(typesArray, valueArray): Buffer {
        return keccak256(
            toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray, valueArray))
        );
    }

    randomWallet(): string {
        const userPvtKey = crypto.randomBytes(32);
        // const userPvtKeyString = userPvtKey.toString("hex");
        const randomUserAddress = ethers.utils.getAddress(
            privateToAddress(userPvtKey).toString("hex"));
        return randomUserAddress
    }

    serializeCoupon(coupon): Coupon {
        return {
            r: bufferToHex(coupon.r),
            s: bufferToHex(coupon.s),
            v: coupon.v
        }
    }

    verifyCoupon(coupon, digest): string {
        const couponSigner = ecrecover(digest, coupon.v, coupon.r, coupon.s);
        const addrBuff = pubToAddress(couponSigner);
        return bufferToHex(addrBuff)
    }

}

export default AllowList;
