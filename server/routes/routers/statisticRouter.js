import express from 'express';

import { isAuth } from '../../middleware/auth.middleware.js';
import Admin from '../../model/adminModel.js';
import Store from '../../model/storeModel.js';

import { 
    getStatisticProductFollowDateRange,
    getStatisticProductFollowYear,
    getStatisticSalesFollowDateRange,
    getStatisticSalesFollowYear,
} from '../../controller/statisticController.js';

const router = express.Router();

router.get("/store/product/:id/day", isAuth(Store), getStatisticProductFollowDateRange);
router.get("/store/product/:id/year", isAuth(Store), getStatisticProductFollowYear);
router.get("/store/sales/day", isAuth(Store), getStatisticSalesFollowDateRange);
router.get("/store/sales/year", isAuth(Store), getStatisticSalesFollowYear);

export default router;