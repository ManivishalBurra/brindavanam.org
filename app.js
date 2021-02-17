//jshint esversion:6

const express=require("express");
const fileupload = require("express-fileupload");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const _=require("lodash");
var cloudinary = require("cloudinary").v2;

const app=express();
cloudinary.config({
  cloud_name: 'dzqu99ism',
  api_key:'316598253211999',
  api_secret: 'jUy2ajPx1ILjoYRy7ZPKaGons18'
});
const mongoose = require("mongoose");

app.use(fileupload({
useTempFiles:true
}));


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://admin-manivishal:Muddup3ru!@brindavanamsite.q33jw.mongodb.net/brindDB",{useNewUrlParser: true, useUnifiedTopology: true});

const gossipSchema ={
    title: String,
    write: String,
    overview:String,
    likes:String,
    id:Number,
    totalLikes:Number,
    imageurl: String
}
const Gossip = mongoose.model("Gossip",gossipSchema);




app.get("/",function(req,res){

  res.render("home.ejs");
});

app.get("/gossips",function(req,res){

  Gossip.find({},function(err,posts){
    console.log(posts);
    res.render("gossips",{tripHeading: posts});
  });


});

app.get("/post",function(req,res){

  res.render("post");
});

app.post("/post",function(req,res,next){

const file = req.files.file;
console.log(file);
cloudinary.uploader.upload(file.tempFilePath,function(err,result){
if(err){
console.log("please limit your image size");}
else{
Gossip.find({},function(err,posts){
  const gossip = new Gossip({
      title: req.body.heading,
      write: req.body.writeup,
      overview:req.body.overview,
      likes:"unliked",
      id: posts.length,
      totalLikes:0,
      imageurl: result.url
  });
  gossip.save();
 });

}
});
  res.redirect("/gossips");

});

app.put("/post/:id/:likesNumber",function(req,res){

    let id=req.params.id;
    let likesNum= req.params.likesNumber;

    Gossip.findOneAndUpdate({id: id}, {$set: {totalLikes: likesNum}},{useFindAndModify: false}, function(err, foundList){

    });
    res.send(req.params);

});

app.get("/puzzles",function(req,res){

  res.render("puzzles");
});

app.get("/release",function(req,res){

  res.render("release");
});

let port=process.env.PORT;


app.listen(port || 3000,function(){
  console.log("port 3000 is working");
});
