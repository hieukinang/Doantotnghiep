import APIError from "./apiError.utils.js";
import APIFeatures, { docsFilter } from "./apiFeatures.utils.js";
import asyncHandler from "./asyncHandler.utils.js";

// GET ALL - Sequelize version
export const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    // _FOR_NESTED_ROUTES_ //
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    // _NUM_OF_DOCUMENTS_ //
    const totalNumOfDocs = await Model.count({ where: docsFilter(req.query) });

    // Build query options using APIFeatures
    const apiFeatures = new APIFeatures(Model, req.query)
      .filter()
      .sort()
      .fields()
      .search()
      .paginate(totalNumOfDocs);

    // Execute query
    const { docs, totalNumOfDocs: count, paginationStatus } = await apiFeatures.exec();

    res.status(200).json({
      status: "success",
      results: docs.length,
      totalNumOfDocs: count,
      paginationStatus,
      data: {
        docs,
      },
    });
  });

// GET ONE - Sequelize version
export const getOne = (Model, includeOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const options = {
      where: { id },
      attributes: { exclude: ["__v"] },
    };
    if (includeOptions) {
      options.include = includeOptions;
    }
    const doc = await Model.findOne(options);

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

// CREATE ONE - Sequelize version
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

// UPDATE ONE - Sequelize version
export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const [affectedRows, [doc]] = await Model.update(req.body, {
      where: { id },
      returning: true,
      individualHooks: true,
    });

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

// DELETE ONE - Sequelize version
export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByPk(id);

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