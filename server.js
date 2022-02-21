const express = require("express");
const cors = require("cors");
const router = require("./route/indexRoute");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());
app.use("/", router);

app.listen(port, () => {
    console.log(`We are flying on port ${port}`);
});