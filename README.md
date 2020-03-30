# materialCenter
提供图片，视频素材选择功能

使用Vue.extends方式对组件进行继承操作，便于挂载到全局使用.<br>
利用Mongoose Web Server操作数据.
对服务端进行优化，利用浏览器缓存进行读取资源.

## 开启服务
1.安装MongoDB https://www.mongodb.com/download-center/community <br>
2.启动数据库 
```javascript
mongod --dbpath D:\material-center\server\db(数据库存储位置) --port 27018(端口号)
```
3.使用npm或yarn进行安装
```javascript
yarn install/npm install
```
4.webpack-dev-server启动页面
```javascript
yarn run dev
```
5.切换到server目录下,启动server服务，启动成功显示数据库连接成功
```javascript
node server.js
```

## 使用方法
默认情况下是图片-单选模式
```javascript
this.$selectMaterial({
    selectedData: '',
    getList (item) {
        // 获取返回的数据
        console.log(item)
    }
});
```

## 选项
| 属性      | 说明     | 类型     | 默认值    |
| ---------- | :-----------:  | :-----------:  | :-----------: |
| multi     | 单选模式/多选模式     | Number/String/Boolean     | 0     |
| type     | image/video     | String     | image     |
| selectedData     | 空字符串/空数组     | String     | ''     |
| maxSize     | 素材文件最大值     | Number     | 图片为2048/视频为20480     |
| format     | 素材文件格式     | Array     | 图片为['jpg', 'png', 'gif', 'jpeg']/视频为['mp4']     |
