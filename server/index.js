const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const {generateFile} = require('./generateFile.js') ;
const {executeCpp} = require('./executeCpp') ;

dotenv.config();

const app = express();

const userRoutes = require("./routes/userRoute.js");
const problemRoutes = require("./routes/problemRoute.js");
const compilerRoutes = require("./routes/compilerRoute.js");
const submissionRoutes = require("./routes/submissionRoute.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.once("open", () => console.log("Connected"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.listen(process.env.PORT || 4000, () => {
    console.log(`API is on port ${process.env.PORT || 4000}`);
});

app.use("/users", userRoutes);
app.use("/problems", problemRoutes);
app.use("/compiler", compilerRoutes);
app.use("/submission", submissionRoutes);