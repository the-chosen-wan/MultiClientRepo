var mysql_package = require("mysql");

var conn = mysql_package.createConnection({
    host: "localhost",
    user: "root",
    password: "leo@2002",
    database: "it_assignment_2",
},(err)=>{
    if(err)
        console.log("Error occured")
});

async function isPresent(conn, data) {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM users WHERE EMAIL = '${data.email}'`,
            (err, rows) => {
                resolve(rows);
            }
        );
    });
}

async function Add(conn, data) {
    let insertData = [[data.fname, data.lname, data.email, data.password]];
    let sql = "INSERT INTO users(FNAME,LNAME,EMAIL,PASSWRD) VALUES ?";
    return new Promise((resolve,reject)=>{
        conn.query(sql, [insertData],(err,result)=>{
            if(err)
                console.log(err.message)
            resolve("1")
        })
    });
}

async function Validate(conn, data) {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM users WHERE EMAIL = '${data.email}'`,
            (err, rows) => {
                if (rows[0] === undefined) resolve([-1, false,-1]);
                else {
                    if (data.password != rows[0].PASSWRD)
                        resolve([-1, false,-1]);
                    else resolve([rows[0].FNAME, true,rows[0].STATUS]);
                }
            }
        );
    });
}

async function addChat(conn, data) {
    let insertData = [[data.email, data.text]];
    let sql = "INSERT INTO messages(EMAIL,CHAT) VALUES ?";
    return new Promise((resolve,reject)=>{
        conn.query(sql, [insertData],(err,result)=>{
            if(err)
                console.log(err.message)
            resolve("1")
        })
    });
}

async function returnChat(conn, email) {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM messages WHERE EMAIL = '${email}'`,
            (err, rows) => {
                resolve(rows);
            }
        );
    });
}

async function addImage(conn, data) {
    let insertData = [[data.email, data.image]];
    let sql = "INSERT INTO images(EMAIL,IMAGE) VALUES ?";
    return new Promise((resolve,reject)=>{
        conn.query(sql, [insertData],(err,result)=>{
            if(err)
                console.log(err.message)
            resolve("1")
        })
    });
}

async function returnImage(conn, email) {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT * FROM images WHERE EMAIL = '${email}'`,
            (err, rows) => {
                resolve(rows);
            }
        );
    });
}

async function deleteImages(conn,ids){
    return new Promise((resolve,reject)=>{
        conn.query(`DELETE FROM images WHERE ID IN (${ids})`,(err,result)=>{
            if(err)
                console.log(err.message)
            resolve("1")
        })
    })
}

async function deleteChat(conn,ids){
    return new Promise((resolve,reject)=>{
        conn.query(`DELETE FROM messages WHERE ID IN (${ids})`,(err,result)=>{
            if(err)
                console.log(err.message)
            resolve("1")
        })
    })
}

async function returnAllChats(conn){
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT * from users JOIN messages ON messages.EMAIL = users.EMAIL`,(err,result)=>{
            if(err)
                console.log(err.message)
            resolve(result)
        })

    })
}

async function returnAllImages(conn){
    return new Promise((resolve,reject)=>{
        conn.query(`SELECT * from users JOIN images ON images.EMAIL = users.EMAIL`,(err,result)=>{
            if(err)
                console.log(err.message)
            resolve(result)
        })

    })
}

module.exports.conn = conn;
module.exports.isPresent = isPresent;
module.exports.Validate = Validate;
module.exports.Add = Add;
module.exports.addChat = addChat;
module.exports.returnChat = returnChat;
module.exports.addImage = addImage;
module.exports.returnImage = returnImage;
module.exports.deleteImages = deleteImages;
module.exports.deleteChat = deleteChat;
module.exports.returnAllChats = returnAllChats;
module.exports.returnAllImages = returnAllImages;
