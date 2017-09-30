const http=require('http');
const fs=require('fs');

const hostname='127.0.0.99';
const port =3000;




fs.readFile("index.html",(err,html)=>{
    if(err){
        throw err;
    }
    const server=http.createServer(function (req,res) {
        res.statusCode=200;
        res.setHeader('Content-type','text/html');
        res.write(html);
        res.end("Hello from node Js app");
    });
    
    server.listen(port,hostname,()=>{
        console.log(
            "server has started on port 3000"
        );
    });
     
});