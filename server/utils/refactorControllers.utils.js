import APIError from "./apiError.utils.js";
import APIFeatures, { docsFilter } from "./apiFeatures.utils.js";
import asyncHandler from "./asyncHandler.utils.js";

/**
 * GET ALL - Sequelize version, hỗ trợ truyền options (ví dụ: include) để lấy các entity liên quan.
 * @param {Model} Model - Sequelize model gốc
 * @param {Object} options - Các options bổ sung cho truy vấn Sequelize (ví dụ: { include: [...] })
 */
export const getAll = (Model, options = {}) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    const totalNumOfDocs = await Model.count({ where: docsFilter(req.query) });

    const apiFeatures = new APIFeatures(Model, req.query)
      .filter()
      .sort()
      .fields()
      .search()
      .paginate(totalNumOfDocs);

    // Merge thêm các options truyền vào (ví dụ: include)
    Object.assign(apiFeatures.options, options);

    const { docs, totalNumOfDocs: count, paginationStatus } = await apiFeatures.exec();

    res.status(200).json({
      status: "success",
      results: docs.length,
      totalNumOfDocs: count,
      paginationStatus,
      data: {
        docs: docs || [],
      },
    });
  });

/**
 * GET ONE - Sequelize version, hỗ trợ truyền options (ví dụ: include) để lấy các entity liên quan.
 * @param {Model} Model - Sequelize model gốc
 * @param {Object} options - Các options bổ sung cho truy vấn Sequelize (ví dụ: { include: [...] })
 */
export const getOne = (Model, options = {}) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const findOptions = {
      where: { id },
      attributes: { exclude: ["__v"] },
      ...options,
    };
    const doc = await Model.findOne(findOptions);

    if (!doc) {
      return next(
        new APIError(`There is no document match this id : ${id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

/**
 * UPDATE ONE - Sequelize version, hỗ trợ truyền options (ví dụ: include) để lấy các entity liên quan sau khi update.
 * @param {Model} Model - Sequelize model gốc
 * @param {Object} options - Các options bổ sung cho truy vấn Sequelize (ví dụ: { include: [...] })
 */
export const updateOne = (Model, options = {}) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const [affectedRows] = await Model.update(req.body, {
      where: { id },
      individualHooks: true,
    });

    if (!affectedRows) {
      return next(
        new APIError(`There is no document match this id : ${id}`, 404)
      );
    }

    // Lấy lại bản ghi vừa update để trả về, kèm liên kết nếu có
    let doc = await Model.findByPk(id, options);
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

/**
 * DELETE ONE - Sequelize version, hỗ trợ truyền options (ví dụ: include) để lấy các entity liên quan trước khi xóa (nếu cần).
 * @param {Model} Model - Sequelize model gốc
 * @param {Object} options - Các options bổ sung cho truy vấn Sequelize (ví dụ: { include: [...] })
 */
export const deleteOne = (Model, options = {}) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByPk(id, options);

    if (!doc) {
      return next(
        new APIError(`There is no document match this id : ${id}`, 404)
      );
    }

    await doc.destroy();

    res.status(204).json({
      status: "success",
    });
  });