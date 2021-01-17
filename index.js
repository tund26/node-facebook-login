const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morganBody = require("morgan-body");
const fs = require("fs");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT;

const accountRoutes = require("./src/routes/accountRoutes");

// database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const logs = fs.createWriteStream('./express.log', { flags: 'a' });
morganBody(app, {
    prettify: false,
    logRequestId: true,
    noColors: true,
    stream: {
        write: (message) => {
            logs.writable && logs.write(message + "\n");
        },
    },
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/accounts", accountRoutes);

app.use("/", (req, res) => {
    res.send("Restful API is running...");
});

app.listen(PORT, () => {
    console.log("Application is running on port " + PORT);
});