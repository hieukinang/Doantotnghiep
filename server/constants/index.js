// ENUM gợi ý (có thể thay đổi theo yêu cầu thực tế)
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
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
  BANNED: "BANNED",
}

export const ORDER_STATUS = {
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
};