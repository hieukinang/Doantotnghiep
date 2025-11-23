// ENUM gợi ý (có thể thay đổi theo yêu cầu thực tế)
export const PAYMENT_METHODS = {
  CASH: "cash",
  WALLET: "wallet",
};

export const ADMIN_ROLES = {
  MANAGER: "manager",
  STAFF: "staff",
};

export const ADMIN_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

export const CLIENT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BANNED: "BANNED",
  PROCESSING: "PROCESSING",
  DESTROYED: "DESTROYED"
};

export const CLIENT_TYPE = {
  NORMAL: "NORMAL",
  VIP: "VIP",
  PREMIUM: "PREMIUM",
};

export const SHIPPER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BANNED: "BANNED",
  PROCESSING: "PROCESSING",
  DESTROYED: "DESTROYED",
};

export const STORE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BANNED: "BANNED",
  PROCESSING: "PROCESSING",
  DESTROYED: "DESTROYED",
};

export const PRODUCT_STATUS = {
  ACTIVE: "ACTIVE",
  PROCESSING: "PROCESSING",
  BANNED: "BANNED",
}

export const ORDER_STATUS = {
  PENDING: "PENDING",//đang xử lý
  CONFIRMED: "CONFIRMED",//đã xác nhận
  IN_TRANSIT: "IN_TRANSIT",//đang vận chuyển
  DELIVERED: "DELIVERED",//đã vận chuyển
  CLIENT_CONFIRMED: "CLIENT_CONFIRMED",//đã nhận hàng
  CANCELLED: "CANCELLED",//đã hủy
  FAILED: "FAILED",//lỗi
  RETURNED: "RETURNED",//yêu cầu trả hàng
  RETURN_CONFIRMED: "RETURN_CONFIRMED",// xác nhận trả hàng thành công
};

export const TRANSACTION_TYPE = {
  TOP_UP: "TOP_UP",
  PAY_ORDER: "PAY_ORDER",
  REFUND: "REFUND",
  WITHDRAW: "WITHDRAW",
}