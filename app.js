var express=require('express');
var exphbs=require('express-handlebars');
var path =require('path');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
var redis=require('redis');//redis db baglantı nesne olusturma.


//Create Redis Client
var client=redis.createClient();

client.on('connect',function(){
    console.log('REdis Connected...');
});


//Set Port
 const port=3000;

 //Init App
 const app=express();   

//View Engine
 app.engine('handlebars',exphbs({defaultLayout:'main'}));
 app.set('view engine','handlebars');


 //Body Parser
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:false}));

 //Method override
 app.use(methodOverride('_method'));

//Search Page
 app.get('/',function(req,res,next){
    res.render('searchusers');
 });
 //Search proscessing
 app.post('/user/search',function(req,res,next){
     var id=req.body.id;
     //veri tabanı nesne cekme kısmı ,
     //yukarıdakı post ıle id alınıp kontrol kısmı asagıda yapılıyor
     client.hgetall(id,function(err,data){
            if(!data){
                res.render('searchusers',{
                    error:'User does not exist'
                });
            }else{
                data.id=id;
                res.render('details',{
                    user:data
                });
            }
     });
 });

 //ADD user page
app.get('/user/add',function(req,res,next){
    res.render('addusers')
});
 //POST EXAMPLE
app.post('/user/add',function(req,res,next){
var id=req.body.id;
var first_name=req.body.first_name;
var last_name=req.body.last_name;
var email=req.body.email;
var phone=req.body.phone;
client.hmset(id,[
    'first_name',first_name,
    'last_name',last_name,
    'email',email,
    'phone',phone
],function(err,reply){
    if(err){
        console.log(err);
    }
        console.log(reply);
        res.redirect('/');
    
});
});

//DELETE EXAMPLE

app.delete('/user/delete/:id',function(req,res,next){
    client.del(req.params.id);
    res.redirect('/');

});
 app.listen(port,function(){
        console.log('Server Success');
 });