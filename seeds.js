var mongoose = require("mongoose");
var Camp = require("./models/campground");
var comment = require("./models/comment");

var data = [
    {name:"River retreat camp barot hp",
    image:"https://www.tourmyindia.com/images/camp-in-himachal.jpg",
    description:"one of the best place."
    },
    {name:"NARKANDA CAMPS KANDYALI",
    image:"https://www.tourmyindia.com/images/camp-in-himachal2.jpg",
    description:"Really a awsomw place. wanna to come here again."
    },
    {name:"Prashar Lake Trekking and Camping",
    image:"https://d17wm0hdpuulng.cloudfront.net/images/dist/prashar-lake-trek-C06LX9.jpeg",
    description:"unbelievable..."
    }
]

function seedDB(){
   Camp.remove(function(err){
    if (err)console.log(err)
    else {console.log("removed campgrounds")
          comment.remove(function(err){
              if(err) console.log(err);
              else console.log("removed comments")
          })
            data.forEach(function(seed){
        Camp.create(seed,function(err,Camp){
    if (err)console.log(err)
    else{ console.log("added a campground")
         
         comment.create(
             {text:"blah blah blah",
              author:"abc"
             },function(err, item){
                 Camp.comments.push(item);
                 Camp.save();
                 console.log("added a comment");
             })
        }
    });
    })
    }}) 
}
module.exports = seedDB;