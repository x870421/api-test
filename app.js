var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var admin = require('firebase-admin');

var serviceAccount = require('./public/preject-fd177-firebase-adminsdk-1jcz6-e4d7aa1e73.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://preject-fd177-default-rtdb.firebaseio.com',
});

var fireData = admin.database();

//增加靜態檔案的路徑
app.use(express.static('public'));

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//路由
app.get('/', function (req, res) {
  fireData.ref('todos').once('value', function (snapshot) {
    var data = snapshot.val();
    res.send({ todolist: data });
  });
});

// 新增邏輯

app.post('/', function (req, res) {
  var content = req.body.content;
  var contentRef = fireData.ref('todos').push();
  contentRef.set({ content: content }).then(function () {
    fireData.ref('todos').once('value', function (snapshot) {
      res.send({
        success: true,
        message: '新增成功',
      });
    });
  });
});

// 刪除邏輯
app.delete('/:id', function (req, res) {
  var _id = req.params.id;
  fireData
    .ref('todos')
    .child(_id)
    .remove()
    .then(function () {
      fireData.ref('todos').once('value', function (snapshot) {
        res.send({
          success: true,
          message: '刪除成功',
        });
      });
    });
});

app.use(function (req, res, next) {
  res.status(404).send('無此頁面');
});
// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);
