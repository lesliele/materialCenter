const path = require('path');
const Router = require('koa-router');
const router = new Router();
const Cat = require('../models/cat');
const Material = require('../models/material');
const multer = require('koa-multer');
const fs = require('fs');
const allowVideoFormat = ['mp4', 'mp3'];
const config = require('../config');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.replace(/\/\S+/, '') === 'video') {
            cb(null, path.join(__dirname, '../assets/videos/')); // 保存的路径，备注：需要自己创建
        } else {
            cb(null, path.join(__dirname, '../assets/images/')); // 保存的路径，备注：需要自己创建
        }
    },
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split('.');
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({
    storage: storage
});

const rootControl = {
    canUpload: true,
    canEdit: true,
    canRemove: true,
    canAddCat: true,
    canEditCat: true,
    canRemoveCat: true
}

// 先实现返回图片流(buffer)
router.get("/assets/:file", async (ctx, next) => {
    ctx.set({
        'Cache-Control': 'private,max-age=13800'
    });
    const file = ctx.params.file;
    const initFile = file.split('.');
    const suffix = initFile[initFile.length - 1];
    let type = 'images';
    if (allowVideoFormat.includes(suffix)) {
        type = 'videos';
    } else {
        type = 'images';
    }
    const res = await readImg(file, type);
    // res 为 Buffer流
    ctx.body = res;
    await next();
});
// 用fs处理流
function readImg(filePath, type) {
    // 创建可读流
    let data = [];
    return new Promise((res, rej) => {
        const readerStream = fs.createReadStream(path.join(__dirname, `../assets/${type}/`) + filePath);
        readerStream.on("data", function (chunk) {
            data.push(chunk);
        });
        readerStream.on("end", function () {
            const finalData = Buffer.concat(data); // 合并Buffer
            res(finalData);
        });
    });
}

// 返回对应类型的分类列表以及分类列表对应的图片列表
router.get('/materialList', async (ctx, next) => {
    let {
        page,
        pageSize,
        type,
        cat_id,
        searchq = ''
    } = ctx.query;
    page = Number(page);
    pageSize = Number(pageSize);
    let reg = new RegExp(searchq, 'i');
    const findCatItem = await Cat.find({
        type: type
    }).exec();
    if (findCatItem) {
        const params = Number(cat_id) === 0 ? {
            type: type,
            remark: {
                $regex: reg
            }
        } : {
            type: type,
            catId: cat_id,
            remark: {
                $regex: reg
            }
        }
        const materialAll = await Material.find({
            type: type,
            remark: {
                $regex: reg
            }
        }).exec();
        const findMaterialItem = await Material.find(params).limit(pageSize).skip(pageSize * (page - 1)).exec();
        if (findMaterialItem && materialAll) {
            const count = materialAll.length;
            ctx.body = {
                code: true,
                message: "success",
                data: {
                    total: count,
                    userCats: findCatItem,
                    can: rootControl,
                    items: findMaterialItem
                }
            };
        }
    }
});

router.post('/materialUpload', upload.single('fileContent'), async (ctx, next) => {
    const {
        cat_id,
        type
    } = ctx.req.body;
    const file = ctx.req.file;
    if (file === '') {
        ctx.body = {
            code: false,
            message: "error",
            data: {
                message: '文件不能为空'
            }
        };
    }
    const domain = config.baseURL;
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    const filePath = `${domain}/assets/${file.filename}`;
    let id = 0;
    const materialTypeCol = await Material.find({
        type: type
    }).exec();
    if (materialTypeCol) {
        materialTypeCol.forEach(item => {
            if (item.id > id) {
                id = item.id;
            }
        })
        const index = id + 1;
        const material = new Material({
            id: index,
            type: type,
            catId: cat_id,
            remark: '',
            mime: file.mimetype,
            createdAt: Date.now(),
            size: file.size,
            src: filePath
        });
        await material.save().then(async info => {
            if (info) {
                ctx.body = {
                    code: true,
                    message: "success",
                    data: {
                        mimetype: file.mimetype,
                        originalname: file.originalname,
                        size: file.size,
                        path: filePath
                    }
                };
                await ctx.body;
            }
        })
    }
});

// 编辑备注
router.post('/materialUpdate', async (ctx, next) => {
    const query = ctx.request.body;
    const objStr = Object.keys(query)[0];
    const {
        type,
        id,
        remark
    } = JSON.parse(objStr);
    const materialItem = await Material.updateOne({
        type: type,
        id: id
    }, {
        $set: {
            remark: remark
        }
    }).exec();
    if (materialItem) {
        ctx.body = {
            code: true,
            message: "success",
            data: {
                type: type,
                remark: remark
            }
        };
    }
});

// 删除素材
router.post('/materialRemove', async (ctx, next) => {
    const query = ctx.request.body;
    const objStr = Object.keys(query)[0];
    const {
        type,
        id
    } = JSON.parse(objStr);
    const deleteItem = await Material.deleteOne({
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