import { Op } from "sequelize";

// Chuyển đổi filter sang cú pháp Sequelize
export const docsFilter = (queryString) => {
  const queryObject = { ...queryString };
  const excludesFields = ["sort", "fields", "keyword", "page", "limit"];
  excludesFields.forEach((field) => delete queryObject[field]);

  // Hỗ trợ toán tử gte, gt, lte, lt cho Sequelize
  const filter = {};
  Object.keys(queryObject).forEach((key) => {
    if (
      typeof queryObject[key] === "object" &&
      queryObject[key] !== null
    ) {
      // e.g. price[gte]=10
      filter[key] = {};
      Object.keys(queryObject[key]).forEach((opKey) => {
        if (["gte", "gt", "lte", "lt"].includes(opKey)) {
          filter[key][Op[opKey]] = queryObject[key][opKey];
        }
      });
    } else if (
      typeof queryObject[key] === "string" &&
      /\[(gte|gt|lte|lt)\]/.test(key)
    ) {
      // e.g. price[gte]=10
      const match = key.match(/(.+)\[(gte|gt|lte|lt)\]/);
      if (match) {
        const field = match[1];
        const op = match[2];
        if (!filter[field]) filter[field] = {};
        filter[field][Op[op]] = queryObject[key];
      }
    } else {
      filter[key] = queryObject[key];
    }
  });

  return filter;
};

export default class APIFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
    this.options = {};
    this.paginationStatus = {};
  }

  // 1) FILTERING
  filter() {
    this.options.where = docsFilter(this.queryString);
    return this;
  }

  // 2) SORTING
  sort() {
    if (this.queryString.sort) {
      this.options.order = this.queryString.sort.split(",").map((field) => {
        if (field.startsWith("-")) {
          return [field.substring(1), "DESC"];
        }
        return [field, "ASC"];
      });
    } else {
      this.options.order = [["createdAt", "DESC"]];
    }
    return this;
  }

  // 3) LIMIT FIELDS
  fields() {
    if (this.queryString.fields) {
      this.options.attributes = this.queryString.fields.split(",");
    }
    return this;
  }

  // 4) SEARCHING
  search() {
    if (this.queryString.keyword) {
      this.options.where = this.options.where || {};
      this.options.where[Op.or] = [
        { name: { [Op.like]: `%${this.queryString.keyword}%` } },
        { description: { [Op.like]: `%${this.queryString.keyword}%` } },
      ];
    }
    return this;
  }

  // 5) PAGINATION
  paginate(totalNumOfDocs) {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 30;
    const offset = (page - 1) * limit;

    this.options.limit = limit;
    this.options.offset = offset;

    // Pagination status
    let pagination = {};
    pagination.currentPage = page;
    pagination.numOfItemsPerPage = limit;
    pagination.numOfPages = Math.ceil(totalNumOfDocs / limit);

    const lastItemIdxInPage = page * limit;
    if (lastItemIdxInPage < totalNumOfDocs) {
      pagination.nextPage = page + 1;
    }
    if (offset > 0) {
      pagination.previousPage = page - 1;
    }
    this.paginationStatus = pagination;

    return this;
  }

  // Hàm thực thi truy vấn Sequelize
  async exec() {
    const { count, rows } = await this.model.findAndCountAll(this.options);
    return { docs: rows, totalNumOfDocs: count, paginationStatus: this.paginationStatus };
  }
}