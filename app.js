//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const {
  google
} = require('googleapis');
const path = require('path');

const fs = require('fs-extra');
const multer = require('multer');
const mongoose = require("mongoose");
const app = express();


const CLIENT_ID = '816260373461-636drbfl7s53ri2gbhbbnqv44bfrldeq.apps.googleusercontent.com';
const CLIENT_SECRET = 'bQc1IlFBFcspcl0lH_v4Y3ul';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04aZYRRyT7naICgYIARAAGAQSNwF-L9IrYqB0CX4afnpZXw6IMUALyfbsdHJ7yx9UZ_mDhYjFjKBHYqq-EWggs_PPZV-SVttm94M';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://admin-manivishal:Muddup3ru!@brindavanamsite.q33jw.mongodb.net/brindDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var muchatluHeading = "#Muchatleskundam!";
var muchatluwriteup = "We made so many memories in our campus,so many chit chats with our friends near yumpies, Now it is time to share a few memories and register them forever here and let's make sure our culture and facts wont die with us";
var meetHeading = "#Meet-ups 2020";
var meetwriteup = "2020 bitsians andaru seniors tho eina leda meeru ala kalsi matlaadukunna memories ikkada share cheskondi<3"

const gossipSchema = {
  title: String,
  write: String,
  name: String,
  overview: String,
  likes: String,
  totalLikes: Number,
  imageurl: [String],
  mimeType: [String],
  totalDate:String,
  hour:String,

}
const meetupSchema = {
  title: String,
  write: String,
  name: String,
  overview: String,
  likes: String,
  totalLikes: Number,
  imageurl: [String],
  mimeType: [String],
  totalDate:String,
  hour:String
}
const tripsSchema = {
  title: String,
  write: String,
  name: String,
  overview: String,
  likes: String,
  totalLikes: Number,
  imageurl: [String],
  mimeType: [String],
  totalDate:String,
  hour:String
}
const Gossip = mongoose.model("Gossip", gossipSchema);
const Meet = mongoose.model("Meet", meetupSchema);
const Trip = mongoose.model("Trip", tripsSchema);



var active = "active";
var nll = "";
//********************Home Goes here***************//

app.get("/", function(req, res) {

  res.render("home.ejs", {
    home: active,
    gossips: nll,
    puzzles: nll,
    meet: nll,
    trips:nll
  });
});

//*******************Gossips**********************//

app.get("/gossips", function(req, res) {
  Gossip.find({}, function(err, posts) {
    // console.log(posts);
    res.render("gossips", {
      tripHeading: posts,
      home: nll,
      gossips: active,
      puzzles: nll,
      trips:nll,
      key: "gossips",
      meet: nll,
      heading: muchatluHeading,
      writing: muchatluwriteup,
      image: "background-gossips",

    });
  });
});

//******************meet-ups 2020***************** Here i used same gossips.ejs for rendering since both are posting media//

app.get("/meet", function(req, res) {
  Meet.find({}, function(err, posters) {
    console.log(posters);
    res.render("gossips", {
      tripHeading: posters,
      home: nll,
      gossips: nll,
      puzzles: nll,
      trips:nll,
      key: "meet",
      meet: active,
      heading: meetHeading,
      writing: meetwriteup,
      image: "background-meet",
      postLink:"/meetPost"
    });
  });
});
app.get("/trips", function(req, res) {
  Trip.find({}, function(err, posters) {
    console.log(posters);
    res.render("gossips", {
      tripHeading: posters,
      home: nll,
      gossips: nll,
      puzzles: nll,
      meet:nll,
      key: "meet",
      trips: active,
      heading: "Trips and food!!",
      writing: "We, in our campus have made so many memories and trips that we only know the secret places and fun places that can be suggested..so,lets post about our trips and let them know about the best trip they can make ",
      image: "background-trip",
      postLink:"/tripsPost"
    });
  });
});


//Here goes posting page
app.get("/post", function(req, res) {
  res.render("post", {
    home: nll,
    gossips: nll,
    puzzles: nll,
    meet: nll
  });
});

var time = "./uploads" + Date.now();
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    var dir = time;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);

  }
});

var mulupload = multer({
  storage: storage
}).array("files", 12);
//Here goes posting through cloudinary for GOSSIPS
app.post("/post", function(req, res, next) {

  mulupload(req, res, function(err) {
    if (err) {
      return res.send('somenthing wrong');
    } else {
      var file = req.files;
      const globalArray={
        imagefile:[],
        imageType:[]
      };
      async function firstFunction(){
      for (var i = 0; i < file.length; i++) {
        var filename = file[i].filename;
        var filePath = path.join(__dirname + time.substring(1), filename);
        globalArray.imagefile.push(await generatePublicUrl());
        globalArray.imageType.push(req.files[i].mimetype.substring(req.files[i].mimetype.length-3));
        async function uploadFile() {
          try {
            const response = await drive.files.create({
              requestBody: {
                name: 'muchatlu.jpg', //This can be name of your choice
                mimeType: req.files.mimetype,
              },
              media: {
                mimeType: req.files.mimetype,
                body: fs.createReadStream(filePath),
              },
            });

            return await response.data.id;
          } catch (error) {
            console.log(error.message);
          }
        }
        async function generatePublicUrl() {
          var x = await uploadFile();

          try {
            const fileId = x;
            await drive.permissions.create({
              fileId: fileId,
              requestBody: {
                role: 'reader',
                type: 'anyone'
              }
            })
            const result = await drive.files.get({
              fileId: fileId,
              fields: 'webViewLink, webContentLink'
            });

            return result.data.webContentLink
          }
           catch (error) {
            console.log(error.message);
          }
        }
      }
      return globalArray;
    }
    secondFunction();
    async function secondFunction(){
      var imagesURL=await firstFunction();
      console.log(imagesURL);
      fs.removeSync(time);

      var d= new Date();
      var monthData = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var month=monthData[d.getMonth()].substr(0,3);
      var year=d.getFullYear();
      var date= d.getDate();
      var hour=d.getHours();
      var totalDates= month+" "+date+", "+year;
      const gossip = new Gossip({
        title: req.body.heading,
        write: req.body.writeup,
        name: req.body.name,
        overview: req.body.overview,
        likes: "unliked",
        totalLikes: 0,
        imageurl: imagesURL.imagefile,
        mimeType: imagesURL.imageType,
        totalDate:totalDates,
        hour:hour
      });
      gossip.save();
      res.redirect('/gossips')
     }
    }

  });

});

//Here goes meetups post
app.post("/meetPost", function(req, res, next) {

  mulupload(req, res, function(err) {
    if (err) {
      return res.send('somenthing wrong');
    } else {
      var file = req.files;
      const globalArray={
        imagefile:[],
        imageType:[]
      };
      async function firstFunction(){
      for (var i = 0; i < file.length; i++) {
        var filename = file[i].filename;
        var filePath = path.join(__dirname + time.substring(1), filename);
        globalArray.imagefile.push(await generatePublicUrl());
        globalArray.imageType.push(req.files[i].mimetype.substring(req.files[i].mimetype.length-3));
        async function uploadFile() {
          try {
            const response = await drive.files.create({
              requestBody: {
                name: 'muchatlu.jpg', //This can be name of your choice
                mimeType: req.files.mimetype,
              },
              media: {
                mimeType: req.files.mimetype,
                body: fs.createReadStream(filePath),
              },
            });

            return await response.data.id;
          } catch (error) {
            console.log(error.message);
          }
        }
        async function generatePublicUrl() {
          var x = await uploadFile();

          try {
            const fileId = x;
            await drive.permissions.create({
              fileId: fileId,
              requestBody: {
                role: 'reader',
                type: 'anyone'
              }
            })
            const result = await drive.files.get({
              fileId: fileId,
              fields: 'webViewLink, webContentLink'
            });

            return result.data.webContentLink
          }
           catch (error) {
            console.log(error.message);
          }
        }
      }
      return globalArray;
    }
    secondFunction();
    async function secondFunction(){
      var imagesURL=await firstFunction();
      console.log(imagesURL);
      fs.removeSync(time);
      var d= new Date();
      var monthData = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var month=monthData[d.getMonth()].substr(0,3);
      var year=d.getFullYear();
      var date= d.getDate();
      var hour=d.getHours();
      var totalDates= month+" "+date+", "+year;
      const meet = new Meet({
        title: req.body.heading,
        write: req.body.writeup,
        name: req.body.name,
        overview: req.body.overview,
        likes: "unliked",
        totalLikes: 0,
        imageurl: imagesURL.imagefile,
        mimeType: imagesURL.imageType,
        totalDate:totalDates,
        hour:hour
      });
      meet.save();
      res.redirect("/meet");
     }
    }

  });

});

//trips
app.post("/tripsPost", function(req, res, next) {

  mulupload(req, res, function(err) {
    if (err) {
      return res.send('somenthing wrong');
    } else {
      var file = req.files;
      const globalArray={
        imagefile:[],
        imageType:[]
      };
      async function firstFunction(){
      for (var i = 0; i < file.length; i++) {
        var filename = file[i].filename;
        var filePath = path.join(__dirname + time.substring(1), filename);
        globalArray.imagefile.push(await generatePublicUrl());
        globalArray.imageType.push(req.files[i].mimetype.substring(req.files[i].mimetype.length-3));
        async function uploadFile() {
          try {
            const response = await drive.files.create({
              requestBody: {
                name: 'trips.jpg', //This can be name of your choice
                mimeType: req.files.mimetype,
              },
              media: {
                mimeType: req.files.mimetype,
                body: fs.createReadStream(filePath),
              },
            });

            return await response.data.id;
          } catch (error) {
            console.log(error.message);
          }
        }
        async function generatePublicUrl() {
          var x = await uploadFile();

          try {
            const fileId = x;
            await drive.permissions.create({
              fileId: fileId,
              requestBody: {
                role: 'reader',
                type: 'anyone'
              }
            })
            const result = await drive.files.get({
              fileId: fileId,
              fields: 'webViewLink, webContentLink'
            });

            return result.data.webContentLink
          }
           catch (error) {
            console.log(error.message);
          }
        }
      }
      return globalArray;
    }
    secondFunction();
    async function secondFunction(){
      var imagesURL=await firstFunction();
      console.log(imagesURL);
      fs.removeSync(time);
      var d= new Date();
      var monthData = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var month=monthData[d.getMonth()].substr(0,3);
      var year=d.getFullYear();
      var date= d.getDate();
      var hour=d.getHours();
      hour=(Number(hour)+6)%24;
      var totalDates= month+" "+date+", "+year;
      const trip = new Trip({
        title: req.body.heading,
        write: req.body.writeup,
        name: req.body.name,
        overview: req.body.overview,
        likes: "unliked",
        totalLikes: 0,
        imageurl: imagesURL.imagefile,
        mimeType: imagesURL.imageType,
        totalDate:totalDates,
        hour:hour.toString()
      });
      trip.save();
      res.redirect("/trips");
     }
    }

  });

});

// here AJAX update for likes without reloading
app.put("/post/:id/:likesNumber", function(req, res) {

  let id = req.params.id;
  let likesNum = req.params.likesNumber;
  console.log(likesNum);
  Gossip.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      totalLikes: likesNum
    }
  }, {
    useFindAndModify: false
  }, function(err, foundList) {

  });
  Meet.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      totalLikes: likesNum
    }
  }, {
    useFindAndModify: false
  }, function(err, foundList) {

  });
  Trip.findOneAndUpdate({
    _id: id
  }, {
    $set: {
      totalLikes: likesNum
    }
  }, {
    useFindAndModify: false
  }, function(err, foundList) {

  });
  res.send(req.params);

});









app.get("/puzzles", function(req, res) {

  res.render("puzzles", {
    puzzles: active,
    home: nll,
    gossips: nll,
    meet: nll,
    trips:nll,
  });
});

app.get("/release", function(req, res) {

  res.render("release", {
    puzzles: nll,
    home: nll,
    gossips: nll,
    meet: nll,
    trips:nll
  });
});

let port = process.env.PORT;


app.listen(port || 3000, function() {
  console.log("port 3000 is working");
});
