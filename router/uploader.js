require('dotenv').config()
const express = require("express");
const router = express.Router()
const multer = require("multer");
const AWS = require("aws-sdk");
const mysql = require("mysql2");

// //存入本地資料夾
// const storage = multer.diskStorage({
//     destination : function(req, file, cb){
//         cb(null, "application/uploads")
//     },
//     filename : function(req, file, cb){
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// })
// const upload = multer({storage : storage});

const storage = multer.memoryStorage();
const upload = multer({ storage });
const s3 = new AWS.S3({
    accessKeyId: process.env.aws_access_key,
    secretAccessKey: process.env.aws_secret_access_key
});
const connection = mysql.createConnection({
    host: "databasemessageborder.cjcw9ltnpuu2.ap-northeast-1.rds.amazonaws.com", 
    user: "admin", 
    password: process.env.mysql_password, 
    database: "messageBorder"
})

router.post("/", upload.single("file"), async(req,res) => {
    try{
        const content = req.body.content;
        const file = req.file;
        const fileName = Date.now() + '_' + file.originalname;
        const fileContent = file.buffer;
        const params = {
            Bucket: "messageborder", // 相簿位子
            Key: fileName, // 你希望儲存在 S3 上的檔案名稱
            Body: fileContent, // 檔案
            // ACL: 'public-read', // 檔案權限
            ContentType: file.mimetype // 副檔名
        };
        //將資料存入資料庫
        const sql = 'INSERT INTO userData (content, fileName) VALUES (?, ?)';
        const inserts = [content, fileName];
        const sqlWithInserts = mysql.format(sql, inserts);
        console.log("sqlWithInserts", sqlWithInserts)
        connection.query(sqlWithInserts, (err, results) => {
                if (err) throw err;
                console.log("results", results);
        });
        //將圖檔上傳至S3
        s3.upload(params, (err, data) => {
            if(err) res.status(500).json({ error: err });
            else {
                res.json({ message: "ok", data });
                // console.log(`File uploaded successfully. ${data.Location}`);
            };
        })
    }
    catch(err){
        res.status(500).json({message : "系統有誤"})
    }
})

router.get("/data", async(req, res) => {
    const sql = `SELECT * FROM userData`;
    connection.query(sql, (err, results) => {
      if (err) throw err;
      let data = results.map(result => {
        let url = `https://d25rvjt2iojb0.cloudfront.net/${result.fileName}`
        return {content: result.content, fileName: url}
      });
      res.json(data);
    });
  });


module.exports = router;