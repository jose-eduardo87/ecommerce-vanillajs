class Query {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryClone = { ...this.queryString };
    const excludedFields = ["page", "sort", "select", "limit"];

    excludedFields.forEach((field) => delete queryClone[field]);
    const queryStringified = JSON.stringify(queryClone).replace(
      /\b(lt|lte|gt|gte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStringified));

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const field = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(field);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  select() {
    if (this.queryString.select) {
      const field = this.queryString.select.split(",").join(" ");

      this.query = this.query.select(field);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.limit(limit).skip(skip);

    return this;
  }
}

module.exports = Query;
