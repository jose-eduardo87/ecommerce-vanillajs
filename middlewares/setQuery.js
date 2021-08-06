exports.setQueryMiddleware = (req, res, next) => {
  const queryCopy = Object.assign({}, req.query);

  const keys = Object.keys(queryCopy);

  // filter PREPARATION TO BE USED IN .find() METHOD
  keys.forEach((key) => {
    // FILTERING PROCESS: IF THERE IS ANY EMPTY KEY OR A "page / sort" FIELD, WE MUST DELETE IT
    if (
      queryCopy[key] === "" ||
      queryCopy[key].length === 0 ||
      key === "page" ||
      key === "sort"
    ) {
      delete queryCopy[key];
      // IF ANY KEY IS "price", THIS CONDITIONAL RUNS TO CONVERT IT TO THE FOLLOWING STRUCTURE ===> { price: { gte: 'xxx', lte: 'yyy' } }
    } else if (key === "price") {
      const [min, max] = queryCopy[key].split(" - ");

      queryCopy.price = { gte: min, lte: max };
      // FOR ALL THE OTHER FIELDS, WE MUST LEAVE IT WITH THE FOLLOWING STRUCTURE ===> { key: { $in: [value] } }
    } else {
      queryCopy[key] = { $in: queryCopy[key].split(",") };
    }
  });

  // WE PREVIOUSLY DELETED A "page / sort" KEY IF THERE WERE ANY BECAUSE WE DIDN'T WANT THESE FIELDS TO RECEIVE THE SAME STRUCTURE AS THE OTHERS ABOVE.
  // NOW WE MUST INSERT "page" / "sort" IN OUR query OBJECT AGAIN:

  if (req.query["page"]) {
    queryCopy["page"] = req.query["page"];
  }

  if (req.query["sort"]) {
    queryCopy["sort"] = req.query["sort"];
  }

  // AT THIS POINT, QUERY OBJECT IS READY TO BE USED IN .find() METHOD, SO WE COPY IT BACK TO req.query AND THEN CALL .next()
  // TO RUN THE NEXT HANDLER IN THE ROUTER:

  req.query = queryCopy;

  next();
};
