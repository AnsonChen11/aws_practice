const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const portNum = 8080;
const uploaderRouter = require("./router/uploader");


//設定模板引擎
//hbs => handlebars一種模板引勤(另外一種為pug)
app.engine("html", hbs.__express)
//設定模板位置
app.set("views", path.join(__dirname, "application", "views"))
//設定靜態檔位置
app.use(express.static(path.join(__dirname, "application")))
//使用.render回傳html位置
app.get("/" , (req,res)=>{
  res.render("index.html")
});

app.use("/uploader", uploaderRouter);


app.listen(portNum , ()=>{
    console.log(`Server is running at localhost:${portNum}`);
});
