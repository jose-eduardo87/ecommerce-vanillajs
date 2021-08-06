const AppError = require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
const Query = require("./../utils/Query");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: newDocument,
    });
  });

exports.readAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    const hasParams = Object.keys(req.params).length > 0;

    if (hasParams) {
      for (let [key, value] of Object.entries(req.params)) {
        filter[key] = value;
      }
    }

    const results = new Query(Model.find(filter), req.query)
      .filter()
      .sort()
      .select()
      .paginate();

    // .estimatedDocumentCount() performs faster compared to .countDocuments().
    // Use .estimatedDocumentCount() if you are working with large collections.
    // (Downside is it does not accept query filters, returns the total amount of document)
    const totalResults = await Model.countDocuments(filter);

    const documents = await results.query;
    const currentPage = req.query.page || 1;

    res.status(200).json({
      status: "success",
      totalResults,
      data: documents,
      currentPage,
    });
  });

exports.readOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let document = Model.findById(id);

    if (!document) {
      return next(
        new AppError("We could not find this document on this database.", 404)
      );
    }

    if (populateOptions) {
      document = document.populate(populateOptions);
    }

    document = await document;

    res.status(200).json({
      status: "success",
      data: document,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return next(
        new AppError("We could not find any documents on this database.", 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: updatedDocument,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedDocument = await Model.findByIdAndDelete(id);

    if (!deletedDocument) {
      return next(
        new AppError(
          "We could not find any documents with this ID on this database.",
          404
        )
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
