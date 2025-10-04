import {
  CLIENT_STATUS,
  STORE_STATUS,
  SHIPPER_STATUS,
  PRODUCT_STATUS,
  ADMIN_STATUS
} from "../constants/index.js";

// --- Generic status validator for body ---
export const checkStatus = (statusEnum) => (req, res, next) => {
  const { status } = req.body;
  if (status && !Object.values(statusEnum).includes(status)) {
    return res.status(400).json({
      errors: [{
        msg: `Status must be one of: ${Object.values(statusEnum).join(", ")}`,
        param: "status",
        location: "body"
      }]
    });
  }
  next();
};

// --- Generic status check for user object (req.user, req.store, req.shipper, etc.) ---
export const checkEntityStatus = (statusEnum, statusKey = "status") => (req, res, next) => {
  const user = req.user || req.store || req.shipper || req.admin;
  if (!user) return next();

  const status = user[statusKey];
  if (status === statusEnum.INACTIVE) {
    return res.status(403).json({
      message: "Your account is inactive. Please contact support."
    });
  }
  if (status === statusEnum.BANNED) {
    return res.status(403).json({
      message: "Your account has been banned. Please contact support."
    });
  }
  if (status === statusEnum.DESTROYED) {
    return res.status(403).json({
      message: "Your account has been destroyed. Access denied."
    });
  }
  next();
};

// --- Factory to combine multiple status check middlewares ---
export const composeStatusChecks = (...checks) => {
  return (req, res, next) => {
    let idx = 0;
    const run = () => {
      if (idx >= checks.length) return next();
      checks[idx++](req, res, (err) => {
        if (err) return next(err);
        run();
      });
    };
    run();
  };
};

// --- Usage examples ---
// Validate status in body for client
export const checkClientStatusBody = checkStatus(CLIENT_STATUS);
// Validate status in body for store
export const checkStoreStatusBody = checkStatus(STORE_STATUS);
// Validate status in body for shipper
export const checkShipperStatusBody = checkStatus(SHIPPER_STATUS);

// Validate status in body for admin
export const checkAdminStatusBody = checkStatus(ADMIN_STATUS);

// Middleware: check status for logged-in client
export const checkClientStatus = checkEntityStatus(CLIENT_STATUS);
// Middleware: check status for logged-in store
export const checkStoreStatus = checkEntityStatus(STORE_STATUS);
// Middleware: check status for logged-in shipper
export const checkShipperStatus = checkEntityStatus(SHIPPER_STATUS);

// Middleware: check status for admin
export const checkAdminStatus = checkEntityStatus(ADMIN_STATUS);

// Middleware: check status for product
export const checkProductStatus = checkEntityStatus(PRODUCT_STATUS);

// Compose multiple status checks if needed
// Example: export const checkClientAndStoreStatus = composeStatusChecks(checkClientStatus, checkStoreStatus);