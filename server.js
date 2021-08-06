process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION. SHUTTING DOWN...");
  console.error(err.name, err.message);

  process.exit(1);
});

const { connect } = require("mongoose");
require("dotenv").config({ path: "./.env" });
const app = require("./index");

const database = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

connect(database, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Database successfully connected."));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}.`)
);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION. SHUTTING DOWN...");
  console.error(err.name, err.message);

  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. SHUTTING DOWN...");

  server.close(() => console.log("Process terminated."));
});
