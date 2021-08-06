const { model, Schema } = require("mongoose");
const slugify = require("slugify");

// CHECK IF THIS SCHEMA IS WORKING
const percentageSchema = new Schema({ percentage: Number });

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name."],
      unique: true,
      minlength: [5, "Name must be at least 10 characters."],
      maxlength: [40, "Name must be less or equal to 40 characters."],
      trim: true,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "Please provide a value for this product."],
      validate: {
        validator: function (price) {
          return price > 0;
        },
        message: "Price must be a positive number.",
      },
    },
    category: {
      type: String,
      enum: ["hats", "shirts", "shoes", "dress", "jeans", "watch"],
    },
    sex: {
      type: String,
      enum: ["men", "women", "unisex"],
    },
    size: [
      {
        type: String,
        enum: [
          "S",
          "M",
          "L",
          "XL",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "small",
          "average",
          "large",
        ],
      },
    ],
    color: [String],
    quantity: {
      type: Number,
      required: [true, "Please specify the total amount of this product."],
      validate: {
        validator: function (qty) {
          return qty > 0;
        },
        message: "Quantity must be a positive number.",
      },
    },
    brand: String,
    description: {
      type: String,
      required: [true, "Please provide a brief summary about this product."],
      trim: true,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be a value between 1 and 5."],
      max: [5, "Rating must be a value between 1 and 5."],
      set: (val) => Math.round(val * 10) / 10,
    },
    images: [String],
    productCode: {
      type: String,
      required: [true, "Please provide a product code for this product."],
    },
    fabric: {
      type: String,
      required: [true, "Please provide a fabric for this product."],
      enum: ["Cotton", "Leather", "N/A", "Plastic", "Nylon"],
      default: "N/A",
    },
    hasDiscount: {
      type: Boolean,
      default: false,
      discount: percentageSchema,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ price: 1, ratingsAverage: -1, createdAt: -1 });
productSchema.index({ slug: 1 });

// IT NEEDS TO CREATE AN TEXT INDEX IN MONGODB SHELL. MONGOOSE IS NOT AN INDEX MANAGEMENT SOLUTION.

// VIRTUAL POPULATE REVIEWS ON PRODUCTS
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const Product = model("Product", productSchema);

module.exports = Product;
