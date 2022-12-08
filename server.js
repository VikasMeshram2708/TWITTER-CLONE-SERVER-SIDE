const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
const volleyball = require("volleyball");
const helmet = require("helmet");

// Moddlewares
app.use(volleyball);
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/v1/auth", require("./Routes/auth"));
app.use("/api/v1/tweets", require("./Routes/tweets"));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
