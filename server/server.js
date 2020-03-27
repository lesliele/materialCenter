const Koa = require('koa');
const app = new Koa();
const materialListRouter = require('./router/material.js');
const catListRouter = require('./router/cat.js');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const Cat = require('./models/cat');

app.use(bodyParser());
app.use(async (ctx, next) => {
    ctx.set({
        'Access-Control-Allow-Origin': '*'
    });

    const catImageList = await Cat.find({
        type: ctx.query.type
    }).exec();
    if (catImageList.length === 0) {
        const cat = new Cat({
            id: 0,
            type: ctx.query.type,
            name: '全部',
            createdAt: Date.now()
        });
        await cat.save().then(async info => {
            await next();
        });
    } else {
        await next();
    }
});

app.use(materialListRouter.routes()).use(materialListRouter.allowedMethods());
app.use(catListRouter.routes()).use(catListRouter.allowedMethods());

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 9999;

mongoose.connect('mongodb://localhost:27018/materialProject', err => {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');
        app.listen(PORT, HOST, () => {
            console.log('Koa server starting...')
        });
    }
})