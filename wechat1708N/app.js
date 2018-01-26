/**
 * Created by admin on 2018/1/26.
 */
const https = require('https');
const express = require('express');
const wechat = require('wechat');
const mysql = require('mysql');
const config = {
   token:'weixin',
   appid:'wxc040549b37503127',
   encodingAESKey:'wL0le6PPXvwxt6hwxa8qMb2ciwv9psE36iEkWHsi2EE'
};
let  app = new express();
let pool = mysql.createPool({
    user:'root',
    passwrod:'',
    port:3306,
    database:'db'
})



app.use(express.query());
app.use('/',wechat(config,(req,res,next)=>{
    let wx = req.weixin;
    console.log(wx.Content)
    let msg = wx.Content
    if(msg.includes('天气')){
        let city = msg.replace('天气','').trim();
        const url = `https://free-api.heweather.com/s6/weather/now?key=b919b58b972f4d26a946fcc4ed664068&location=${encodeURI(city)}`
        let resp = res
        https.get(url,(req,res)=>{
            req.on('data',(buf)=>{
                let weather = JSON.parse(buf.toString()).HeWeather6[0];
                if(weather.status=='ok'){
                    console.log(weather.now)
                    console.log(weather)
                    resp.reply(`城市:${weather.basic.location}\n天气:${weather.now.cond_txt}\n最低温度:${weather.now.tmp}\n风向:${weather.now.wind_dir}\n风力:${weather.now.wind_sc}\n最新更新时间:${weather.update.loc}`);
                }else{
                    resp.reply(weather.status)
                }
            })
        })
        console.log(`city:${city}`)
    }else{
        pool.query("select answer from message where question like ?",[`%${msg}%`],(err,result)=>{
            if(err)throw err;
            console.log(result)
            if(result.length==0){
                res.reply('没有您想要的')
            }else{
                res.reply(result[0].answer)
            }
        })

        if(wx.Content==='hello'){
            res.reply('Hello')
        }else if(wx.Content==='web'){
            res.reply([
                {
                    title:'为什么那么多妹纸爱学习前端',
                    description:'html css javascript nodejs Vue webpack angular react bootstrap',
                    picurl:'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike92%2C5%2C5%2C92%2C30/sign=ae7a08e6c1fdfc03f175ebeab556ecf1/09fa513d269759ee5beb9ed3b0fb43166d22df6b.jpg',
                    url:'https://github.com/coderja/18_wechat'
                }
            ])
        }else if(wx.Content==='play song'){
            res.reply(
                {
                    type:'music',
                    content:{
                        title:'一直很安静',
                        description:'一直很安静.mp3',
                        musicUrl:'http://php-download.sourceforge.net/mp3/music/%E4%B8%80%E7%9B%B4%E5%BE%88%E5%AE%89%E9%9D%99.mp3'
                    }
                }
            )
        }
    }
}));
app.listen(8000)
//https://console.heweather.com//天气网站
