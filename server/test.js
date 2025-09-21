import connectToDB from "./config/db.js";

// Import các model để Sequelize biết và sync
import "./model/adminModel.js";
import "./model/clientModel.js";
import "./model/shipperModel.js";
import "./model/storeModel.js";
import "./model/categoryModel.js";
import "./model/productModel.js";
import "./model/productVariantModel.js";
import "./model/variantOptionModel.js";
import "./model/attributeModel.js";
import "./model/cartModel.js";
import "./model/cartItemModel.js";
import "./model/orderModel.js";
import "./model/orderItemModel.js";
import "./model/reviewModel.js";
import "./model/favoriteModel.js";
import "./model/followModel.js";
import "./model/couponModel.js";
import "./model/productImageModel.js";
import "./model/storeBannerModel.js";
import "./model/bannerModel.js";
import "./model/complaintModel.js";
import "./model/complaintImageModel.js";
import "./model/conversationModel.js";
import "./model/messageModel.js";
import "./model/notificationModel.js";
import "./model/addressModel.js";

import "./model/associations.js";

//______DB_CONNECTING______//
connectToDB();