/**
 * Created by admin on 2018/1/26.
 */
//const http = require('http')
const express = require('express');
const wechat = require('wechat');
const config = {
   token:'weixin',
   appid:'wxc040549b37503127',
   encodingAESKey:'olazKB7yAvKG5jY4IS5MsQEy8jpAvDC46Gs3DJY1Gcr'
};
let  app = new express();
app.listen(8000)

app.use(express.query());
app.use('/',wechat(config,(req,res,next)=>{

}));





app.get('/',(req,res)=>{
 res.json('app is running...11555')

 console.log('jieshoule')
})