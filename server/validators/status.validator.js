import {
  CLIENT_STATUS,
  STORE_STATUS,
  SHIPPER_STATUS,
  PRODUCT_STATUS,
  ADMIN_STATUS,
} from "../constants/index.js";

// --- Generic status validator for body ---
export const checkStatus = (statusEnum) => (req, res, next) => {
  const { status } = req.body;
  // ADMIN_STATUS là boolean, các status khác là string
  const validValues = Object.values(statusEnum);
  if (status !== undefined && !validValues.includes(status)) {
    return res.status(400).json({
      errors: [{
        msg: `Status must be one of: ${validValues.join(", ")}`,
        param: "status",
        location: "body"
      }]
    });
  }
  next();
};

// --- Generic status check for user/store/shipper/admin object ---
export const checkEntityStatus = (statusEnum, statusKey = "status") => (req, res, next) => {
  const entity = req.user || req.store || req.shipper || req.admin;
  if (!entity) return next();

  const status = entity[statusKey];

  // ADMIN_STATUS là boolean
  if (statusEnum === ADMIN_STATUS) {
    if (status === ADMIN_STATUS.INACTIVE) {
      return res.status(403).json({
        message: "Admin account is inactive. Access denied."
      });
    }
    return next();
  }

  // Các status khác là string
  if (
    status === statusEnum.INACTIVE ||
    status === statusEnum.BANNED ||
    status === statusEnum.DESTROYED ||
    status === statusEnum.PROCESSING
  ) {
    return res.status(403).json({
      message: `Your account status is ${status}. Access denied.`
    });
  }
  next();
};

// --- Usage examples ---
// export const checkClientStatusBody = checkStatus(CLIENT_STATUS);
// export const checkStoreStatusBody = checkStatus(STORE_STATUS);
// export const checkShipperStatusBody = checkStatus(SHIPPER_STATUS);
// export const checkAdminStatusBody = checkStatus(ADMIN_STATUS);

export const checkClientStatus = checkEntityStatus(CLIENT_STATUS);
export const checkStoreStatus = checkEntityStatus(STORE_STATUS);
export const checkShipperStatus = checkEntityStatus(SHIPPER_STATUS);
export const checkAdminStatus = checkEntityStatus(ADMIN_STATUS, "active"); // admin dùng trường active (boolean)
export const checkProductStatus = checkEntityStatus(PRODUCT_STATUS);