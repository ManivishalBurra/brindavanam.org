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

mongoose.connect("mongodb+srv://admin-manivishal:Muddup3ru!@brindavanamsite.q33jw.mongodb.net/brindDB?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});

var muchatluHeading="#Muchatleskundam!";
  var muchatluwriteup="We made so many memories in our campus,so many chit chats with our friends near yumpies, Now it is time to share a few memories and register them forever here and let's make sure our culture and facts wont die with us";
var meetHeading="#Meet-ups 2020";
var meetwriteup="2020 bitsians andaru seniors tho eina leda meeru ala kalsi matlaadukunna memories ikkada share cheskondi<3"

const gossipSchema ={
    title: String,
    write: String,
    name: String,
    overview:String,
    likes:String,
    totalLikes:Number,
    imageurl: String,
}
const meetupSchema ={
    title: String,
    write: String,
    name: String,
    overview:String,
    likes:String,
    totalLikes:Number,
    imageurl: String,
}
const Gossip = mongoose.model("Gossip",gossipSchema);
const Meet= mongoose.model("Meet",meetupSchema);



var active="active";
var nll="";
//********************Home Goes here***************//

app.get("/",function(req,res){

  res.render("home.ejs",{home:active,gossips:nll,puzzles:nll,meet:nll});
});

//*******************Gossips**********************//

app.get("/gossips",function(req,res){
  Gossip.find({},function(err,posts){
    console.log(posts);
    res.render("gossips",{tripHeading: posts,home:nll,gossips:active,puzzles:nll,key:"gossips",meet:nll,heading:muchatluHeading,writing:muchatluwriteup,image:"background-gossips"});
  });
});

//******************meet-ups 2020***************** Here i used same gossips.ejs for rendering since both are posting media//

app.get("/meet",function(req,res){
  Meet.find({},function(err,posters){
    console.log(posters);
    res.render("gossips",{tripHeading: posters,home:nll,gossips:nll,puzzles:nll,key:"meet",meet:active,heading:meetHeading,writing:meetwriteup,image:"background-meet"});
  });
});


//Here goes posting page
app.get("/post",function(req,res){
  res.render("post",{home:nll,gossips:nll,puzzles:nll,meet:nll});
});

//Here goes posting through cloudinary for GOSSIPS
app.post("/post",function(req,res,next){

const file = req.files.file; //here it collects from which file we should upload.
console.log(file);
cloudinary.uploader.upload(file.tempFilePath,function(err,result){
if(err){
console.log("please limit your image size");}
else{
Gossip.find({},function(err,posts){
  const gossip = new Gossip({
      title: req.body.heading,
      write: req.body.writeup,
      name: req.body.name,
      overview:req.body.overview,
      likes:"unliked",
      totalLikes:0,
      imageurl: result.url   //result gives all info from cloudinary.
  });
  gossip.save();
 });

}
});
  res.redirect("/gossips");
});

//Here goes meetups post
app.post("/meetPost",function(req,res,next){

const file = req.files.file;
console.log(file);
cloudinary.uploader.upload(file.tempFilePath,function(err,result){
if(err){
console.log("please limit your image size");}
else{
Meet.find({},function(err,posts){
  const meet = new Meet({
      title: req.body.heading,
      write: req.body.writeup,
      name: req.body.name,
      overview:req.body.overview,
      likes:"unliked",
      totalLikes:0,
      imageurl: result.url
  });
  meet.save();
 });
}
});
  res.redirect("/meet");
});


// here AJAX update for likes without reloading
app.put("/post/:id/:likesNumber",function(req,res){

    let id=req.params.id;
    let likesNum= req.params.likesNumber;
    console.log(likesNum);
    Gossip.findOneAndUpdate({_id: id}, {$set: {totalLikes: likesNum}},{useFindAndModify: false}, function(err, foundList){

    });
    Meet.findOneAndUpdate({_id: id}, {$set: {totalLikes: likesNum}},{useFindAndModify: false}, function(err, foundList){

    });
    res.send(req.params);

});



















app.get("/puzzles",function(req,res){

  res.render("puzzles",{puzzles:active,home:nll,gossips:nll,meet:nll});
});

app.get("/release",function(req,res){

  res.render("release",{puzzles:nll,home:nll,gossips:nll,meet:nll});
});

let port=process.env.PORT;


app.listen(port || 3000,function(){
  console.log("port 3000 is working");
});
