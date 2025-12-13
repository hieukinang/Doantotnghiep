import express from 'express';

import { isAuth } from '../../middleware/auth.middleware.js';
import Admin from '../../model/adminModel.js';
import Store from '../../model/storeModel.js';

import { 
    getStatisticProductFollowDateRange,
    getStatisticProductFollowYear,
    getStatisticSalesFollowDateRange,
    getStatisticSalesFollowYear,
    getStatisticUserFollowDateRange,
    getStatisticUserFollowYear,
    getStatisticOrderFollowDateRange,
    getStatisticRevenueFollowDateRange,
    getStatisticRevenueFollowYear,
} from '../../controller/statisticController.js';

const router = express.Router();

router.get("/store/product/:id/day", isAuth(Store), getStatisticProductFollowDateRange);
router.get("/store/product/:id/year", isAuth(Store), getStatisticProductFollowYear);
router.get("/store/sales/day", isAuth(Store), getStatisticSalesFollowDateRange);
router.get("/store/sales/year", isAuth(Store), getStatisticSalesFollowYear);

router.get("/admin/user/day", isAuth(Admin), getStatisticUserFollowDateRange);
router.get("/admin/user/year", isAuth(Admin), getStatisticUserFollowYear);
router.get("/admin/order/day", isAuth(Admin), getStatisticOrderFollowDateRange);
router.get("/admin/revenue/day", isAuth(Admin), getStatisticRevenueFollowDateRange);
router.get("/admin/revenue/year", isAuth(Admin), getStatisticRevenueFollowYear);


export default router;