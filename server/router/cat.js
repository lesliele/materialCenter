const Router = require('koa-router');
const router = new Router();
const Cat = require('../models/cat');

router.post('/addCat', async (ctx, next) => {
    const query = ctx.request.body;
    const objStr = Object.keys(query)[0];
    const {
        name,
        type
    } = JSON.parse(objStr);
    let id = 0;
    const catTypeCol = await Cat.find({
        type: type
    }).exec();
    if (catTypeCol) {
        catTypeCol.forEach(item => {
            if (item.id > id) {
                id = item.id;
            }
        })
        const index = id + 1;
        const cat = new Cat({
            id: index,
            type: type,
            name: name,
            createdAt: Date.now()
        });
        await cat.save().then(async info => {
            ctx.body = {
                code: true,
                message: "success",
                data: {
                    id: index,
                    type: type
                }
            };
            await ctx.body;
        });
    }
});

router.post('/updateCat', async (ctx, next) => {
    const query = ctx.request.body;
    const objStr = Object.keys(query)[0];
    const {
        name,
        type,
        id
    } = JSON.parse(objStr);
    const updateItem = await Cat.updateOne({
        id: id,
        type: type
    }, {
        name: name
    }).exec();
    if (updateItem) {
        ctx.body = {
            code: true,
            message: "success",
            data: {
                name: name
            }
        };
    }
});

router.post('/removeCat', async (ctx, next) => {
    const query = ctx.request.body;
    const objStr = Object.keys(query)[0];
    const {
        type,
        id
    } = JSON.parse(objStr);
    const deleteItem = await Cat.deleteOne({
        id: id,
        type: type
    }).exec();
    if (deleteItem) {
        ctx.body = {
            code: true,
            message: "success",
            data: {
                id: id,
                type: type
            }
        };
    }
})

module.exports = router;