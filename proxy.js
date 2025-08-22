const http = require("http");
const server = http.createServer();
const fs = require('fs');
let path = require("path");
function buffer_to_hex(__buffer){
    var uarray = Array.prototype.slice.call(__buffer)
    return uarray.map(el=>Number(el).toString(16))
}
function sha1_to_base64(sha1)
{undefined
    var digits="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64_rep = "";
    var cnt = 0;
    var bit_arr = 0;
    var bit_num = 0;

    for(var n = 0; n < sha1.length; ++n)
    {undefined
        if(sha1[n] >= 'A' && sha1[n] <= 'Z')
        {undefined
            ascv = sha1.charCodeAt(n) - 55;
        }
        else if(sha1[n] >= 'a' && sha1[n] <= 'z')
        {undefined
            ascv = sha1.charCodeAt(n) - 87;
        }
        else
        {undefined
            ascv = sha1.charCodeAt(n) - 48;
        }

        bit_arr = (bit_arr << 4) | ascv;
        bit_num += 4;
        if(bit_num >= 6)
        {undefined
            bit_num -= 6;

            base64_rep += digits[bit_arr >>> bit_num];
            bit_arr &= ~(-1 << bit_num);
        }
    }

    if(bit_num > 0)
    {undefined
        bit_arr <<= 6 - bit_num;
        base64_rep += digits[bit_arr];
    }
    var padding = base64_rep.length % 4;

    if(padding > 0)
    {undefined
        for(var n = 0; n < 4 - padding; ++n)
        {undefined
            base64_rep += "=";
        }
    }
    return base64_rep;
}
server.on('request',(req,res)=>{
    // 使用es6的扩展运算符过滤请求头,提出host connection
    flag=0;
    lu=80*1024*2;
    tail=Math.floor(Math.random()*lu);
    // tail=Math.floor(Math.random()*lu);
    // console.log(tail);
     //tail=(tail/2/1024);
     //console.log(tail);
    var { connection, host, ...originHeaders } = req.headers;
    // 构造请求报文
    var options = {
        "method": req.method,
        "hostname": "172.29.251.205",
        "port":"443",
        "path": req.url,
        "headers": {
            'Accept':'*/*',
            'Accept-Encoding':'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Connection':'keep-alive',
            'tail':tail

        }
    }
    // 通过req的data事件和end事件接收客户端发送的数据
    // 并用Buffer.concat处理一下
    let postbody = [];
    req.on("data", chunk => {
        postbody.push(chunk);
    })
    req.on('end', () => {
        let postbodyBuffer = Buffer.concat(postbody);
        // 定义变量接收目标服务器返回的数据
        let responsebody=[]
        // 发送请求头
        var request = http.request(options, (response) => {
            response.on('data', (chunk) => {
                responsebody.push(chunk)
            })
            response.on("end", () => {
                // 处理目标服务器数据,并将其返回给客户端
                responsebodyBuffer = Buffer.concat(responsebody)
                resbuffer=responsebodyBuffer
                // console.log(responsebodyBuffer[0])
                if(responsebodyBuffer[0]==255&&responsebodyBuffer[1]==216)
                {
                    // console.log(sha1_to_base64(responsebodyBuffer.toString('hex')));
                    const tail_responsebody=responsebodyBuffer.toString('hex');
                    let tailer=tail_responsebody.substring(0,tail_responsebody.length-4);
	    //console.log(tail);
                    for(i=0;i<tail;i++)
                    {
                        tailer=tailer+'0';
                    }
                    tailer=tailer+"ffd9";
                     //console.log(tailer);
                    const base64=sha1_to_base64(tailer);
                    const dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
                    // path="C://Users//loser//WebstormProjects//c4//demo.jpg";
                    // fs.writeFile(path, dataBuffer, function(err){//用fs写入文件
                    //     if(err){
                    //         console.log(err);
                    //     }else{
                    //         console.log('写入成功！');
                    //     }
                    // })
                    resbuffer=dataBuffer
                }
                res.end(resbuffer);
            })
        })
        // 将接收到的客户端请求数据发送到目标服务器;
        request.write(postbodyBuffer)
        request.end();
    })
})
server.listen(4000,()=>{
    console.log("Server has opened......");
})