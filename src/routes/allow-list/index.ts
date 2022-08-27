import {Router} from 'express';
import AllowList from '../../controllers/allow-list-cntrl';
import {checkAdmin} from '../../middleware/auth';

export default () => {

    // @ts-ignore
    const routes = new Router({});
    const allowList = new AllowList();

    routes.get('/user-coupon/:user', async (req, res, next) => {
        try {
            const {user} = req.params;
            const coupon = await allowList.getWalletCoupon(user);
            res.json({coupon});
        } catch (e) {
            next(e);
        }

    });

    routes.use(checkAdmin);

    routes.post('/add-list', async (req, res, next) => {
        try{
            const {address} = req.body;
            await allowList.addToAllowList(address);
            res.json({success: true})
        } catch (e) {
            next(e)
        }
    })

    routes.post('/gen-test-coupons', async (req, res, next) => {
        try{
            await allowList.createCoupons();
            res.json({success: true})
        } catch (e) {
            next(e)
        }
    })

    return routes;
}
