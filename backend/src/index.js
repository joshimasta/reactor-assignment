// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const request = require('request');

app.get("/api", (req, res) => {
  if(req.query.type === "products"){
    const dataUrl = "https://bad-api-assignment.reaktor.com/v2/products/" + req.query.category

    request({
      uri: dataUrl,
    }).pipe(res);
  } else if (req.query.type === "manufacturers"){
    // const manufacturerNames = JSON.parse(req.query.manufacturers)
    
    // for(let i = 0; i < 1;i++){
      // const manufacturerName = manufacturerNames[i]
      // const dataUrl = "https://bad-api-assignment.reaktor.com/v2/availability/" + manufacturerName
      const dataUrl = "https://bad-api-assignment.reaktor.com/v2/availability/" + req.query.manufacturers
      request({
        uri: dataUrl,
      }).pipe(res);
    // }

  }else{
    console.log("unknown query type")
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});