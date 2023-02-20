import express from "express";
const app = express();
import config from "./config/config.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import routes from "./routes/index.js";

//database connection
import "./config/database.js";
import { fileURLToPath } from "url";

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// Allow cross origin requests(CORS) ======================================================================
app.use(function (err, req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.header("Pragma", "no-cache");
  res.header("Expires", "Fri, 31 Dec 2998 12:00:00 GMT");
  if (err) {
    // handle  server errors
    console.log("Internal Server Error: ", err.stack);
    res.status(500).send({
      error: true,
      message: "App encountered error. Kindly try again after a while.",
    });
  } else {
    next();
  }
});

app.use(cors());

app.use(
  express.static(path.dirname(fileURLToPath(import.meta.url)) + "/public")
);
// app.get('/*', function(req, res) {
//     res.sendFile(process.cwd() + '/public/');
// });

app.trimString = function (val) {
  return val.replace(/(^\s+|\s+$)/g, "");
};

app.removeAllDigits = function (val) {
  return val.replace(/[0-9]/g, "").trim();
};

app.getFileNameWithoutExt = function (val) {
  return val.substr(0, val.lastIndexOf(".")).trim();
};

// launch ======================================================================
app.listen(config.PORT, () => {
  console.log("Magic happens on port: "+ config.PORT);
  
  routes()
});

export default app;
