//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const _=require("lodash");
require("dotenv").config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect(process.env.mongoUrl);

const app = express();

// here this is used enables views folder and can browse the files from there
app.set('view engine', 'ejs');
//this is used to read the input from html
app.use(bodyParser.urlencoded({extended: true}));
// this is used to access the local files in pc from server
app.use(express.static("public"));


const port=process.env.PORT || 3000;

const postSchema=mongoose.Schema({
  title:String,
  review:String
});

const Post=mongoose.model("Post",postSchema);

const base_post=new Post({
  title:"dummy",
  review:"this is dummy review"
});

base_post.save();

app.get("/",(req,res)=>{

  Post.find((err,result)=>{
    if(err) console.log(err);
    else {
      console.log(result);
      res.render('home',{pg:"Home",home_cnt:homeStartingContent,pos:result});
    }
  })

})

app.get("/about",(req,res)=>{
  res.render("about",{pg:"About",home_cnt:aboutContent});
})

app.get("/contact",(req,res)=>{
  res.render("contact",{pg:"Contact",home_cnt:contactContent});
})

app.get("/compose",(req,res)=>{
  res.render("compose");
})
app.get("/posts/:p_name",(req,res)=>{
  let match="";
  let name=req.params.p_name;
  let n_name=_.replace(req.params.p_name,'-',' ');
  n_name=_.capitalize(n_name);
  console.log(req.params.p_name+" - "+n_name);
  

  Post.findOne({$or:[{title:name},{title:n_name}]},(err,result)=>{
    if(err) console.log(err);
    else{
        if(!result){
          console.log("not fount");
          res.send("unable to find the page check the url");
        }
        else{
          console.log(result);
          res.render("post",{t:result.title,r:result.review});
        }
    }
  })

  // if(match===""){
  //     console.log("Match not found");
  //     res.send("No such Page Exists");
  //   }
})

app.post("/compose",(req,res)=>{

  console.log(req.body);
  let tit=req.body.compose;
  let n_post=new Post({
    title:_.capitalize(tit),
    review:req.body.review
  });
  n_post.save();
  res.redirect("/");
})

app.listen(port, function() {
  console.log("Blog server has started in the port "+ port);
});
