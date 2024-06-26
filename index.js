const express = require("express");
const morgan = require("morgan");
const axios = require("axios");

const app = express();

const PORT = 3006;
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});
app.use(limiter);
app.use(morgan("combined"));
app.use("/bookingservice", async (req, res, next) => {
  console.log(req.headers["x-access-token"]);
  try {
    const response = await axios.get(
        "http://localhost:3002/api/v1/isAuthenticated",
        {
          header: {
            "x-access-token": req.headers["x-access-token"],
          },
        }
      );
      console.log(response.data);
      if(res.data.success){
        next();
      }
      else{
        return res.status(401).json({
            message:"unauthorized "
        });
    
      }
  } catch (error) {
    return res.status(500).json({
        message:"unauthorized "
    });

  }
  

});

app.use(
  "/bookingservice",
  createProxyMiddleware({ target: "http://localhost:3003/", changeOrigin: true })
);

app.get("/home", (req, res) => {
  return res.json({
    message: "Ok",
  });
});
//Morgan is a npm package for login middleware.

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

