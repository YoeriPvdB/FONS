"use strict";

var express = require("express");
var port = app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });;
var app = express();



var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var fileUpload = require("express-fileupload");
app.use(fileUpload());


var session = require("express-session");
const res = require("express/lib/response");


var mysql = require("mysql2"); //changed to require mysql2 as mysql would not work on home computer
const { CONNREFUSED } = require("dns");
const { getSystemErrorMap, log } = require("util");

const fs = require('fs');
const { profile } = require("console");


var rejection = "";
app.use(express.static("assets"));

app.set("view engine", "ejs");
app.set("views", "templates");

// var con = mysql.createConnection({
//     host: "mysql.scss.tcd.ie",
//     user: "pearceyy",
//     password: "Ohghii8j",  // Enter your own MySQL password              //database for trinity web broswer sql
//     database: "pearceyy_db" // Enter your database name
// });

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Newsflash69",           //my home database
    database: "pearceyy_db"   //I accidentally had my database named "pearceyy" instead of "pearceyy_db" when working on my home computer. That might affect something
});

con.connect(function (err) {
    if (err) {
        console.log(" Error connecting to Database " + err);
    } else {
        console.log(" Connected to Database ");
    }
});

//sets up cookies 
app.use(session({

    secret: "abcde",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } //sets session time to 24h

}));



//checks homepage for the status of the user. if cookies exist, displays profile button.
app.get("/", function (req, res) {



    res.redirect("/home");


});

app.get("/home", function (req, res) {

    const getTopPosts = `SELECT * FROM posts ORDER BY posts.likes DESC`;    //gets posts from sql in order of most likes
    const getRecentPosts = `SELECT * FROM posts ORDER BY posts.date DESC`;  //gets posts from sql in order of upload date
    const getUsers = `SELECT users.user_ID, users.username, users.profile_image FROM users`;    //gets user information from sql for all site users
    const queryArray = [getTopPosts, getRecentPosts, getUsers];

    if (req.session.profile_id != null) {
        console.log("not null: " + req.session.profile_id);     //checks for session data for profile_id.if it exists, it deletes is for the home page
        req.session.profile_id = null;
        console.log("new thing: " + req.session.profile_id);
    }


    var topPosts = [];
    var recentPosts = [];
    var num = 0;
    var imageIDs = [];
    var recentImgIDs = [];
    var topImages = [];
    var recentImages = [];
    var topLikes = [];
    var recentLikes = [];
    var comments_num = [];
    var recentComments_num = [];

    var userImages = [];
    var usernames = [];
    var userIDs = [];

    var logButton;
    var logLink;
    var profButton;
    var profLink;

    if (req.session.user == null) {
        logButton = "Log-In";
        logLink = "/login";
        profButton = "Sign-Up";             //changes some account buttons depending on whether the user is logged in or not
        profLink = "/signup";
    } else {
        logButton = "Log-Out";
        logLink = "/logout";
        profButton = "Profile";
        profLink = "/profile/" + req.session.userID;
    }

    //gets the information for the users on the site to display in the users tab of the home page
    con.query(getUsers, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            for (let i = 0; i < results.length; i++) {

                if (results[i].profile_image == "undefined") {
                    userImages[i] = "default_profile.jpg";      //checks if user has a profile picture, if not, asigns the user a "default" picture;
                } else {
                    userImages[i] = results[i].profile_image;
                }

                usernames[i] = results[i].username;
                userIDs[i] = results[i].user_ID;
            }
        }
    })

    //gets the posts by order of most likes to display on the popular tab of the homepage
    con.query(getTopPosts, function (err, results) {
        if (err) {
            console.log(err);
        } else {

            if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    topPosts[i] = results[i].post_ID;
                    topLikes[i] = results[i].likes;                 //fills up some arrays with the results
                    comments_num[i] = results[i].comments;
                }


                for (let i = 0; i < topPosts.length; i++) {
                    imageIDs[i] = results[i].user_ID + "_" + topPosts[i] + ".jpg"; //crreates a new image id for each post. each image id is the user_id + the post id.

                }

                fs.readdirSync("assets/images").forEach(file => {
                    for (let i = 0; i < imageIDs.length; i++) {
                        if (file == imageIDs[i]) {
                            topImages[i] = file.toString();   //searches the image folder for all images with corresponding file names
                        }
                    }

                });

                //does the same as above, but looks for posts based on the order of upload date
                con.query(getRecentPosts, function (err, recentresults) {
                    if (err) {
                        console.log(err);
                    } else {

                        if (recentresults.length > 0) {
                            for (let i = 0; i < recentresults.length; i++) {
                                recentPosts[i] = recentresults[i].post_ID;
                                recentLikes[i] = recentresults[i].likes;
                                recentComments_num[i] = recentresults[i].comments;
                            }


                            for (let i = 0; i < recentPosts.length; i++) {
                                recentImgIDs[i] = recentresults[i].user_ID + "_" + recentPosts[i] + ".jpg";

                            }

                            fs.readdirSync("assets/images").forEach(file => {
                                for (let i = 0; i < recentImgIDs.length; i++) {
                                    if (file == recentImgIDs[i]) {
                                        recentImages[i] = file.toString();
                                    }
                                }

                            });


                            res.render("home.ejs", { "files": topImages, "recentfiles": recentImages, "likes": topLikes, "recentLikes": recentLikes, "comment_num": comments_num, "rec_comment_num": recentComments_num, "logButton": logButton, "logLink": logLink, "profButton": profButton, "profLink": profLink, "usernames": usernames, "user_IDs": userIDs, "userImages": userImages });
                        } else {
                            console.log("No results");
                        }


                    }
                });

                
            } else {
                console.log("No results");
            }


        }
    });

});



//renders login.ejs when entering the /login page
app.get("/login", function (req, res) {

    res.render("login.ejs");
});

//gets user input information and checks to see if username and password matches any of the data in the "usernames" and "passwords" array
//if true then it loads the profile page
app.post("/login", function (req, res) {

    var password = req.body.password;
    var username = req.body.username;

    //checks all the usernames and passwords for matching strings
    var userCheck = `SELECT users.username, users.password FROM users WHERE users.username = "${username}" AND users.password = "${password}"`;
    var idCheck = `SELECT users.user_ID FROM users WHERE users.username = "${username}"`;
    var userID;
    con.query(idCheck, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                userID = results[0].user_ID;
                req.session.userID = userID;
                console.log("userID: " + req.session.userID);
            }
        }
    });



    con.query(userCheck, function (err, results) {
        if (err) {
            console.log(err);
        } else {

            //if given username and password is correct, then logs user in
            if (results.length > 0) {
                console.log(results);
                req.session.user = username;
                req.session.views = req.session.views++;
                req.session.password = password;
                res.redirect("/profile/" + userID);

            } else {
                res.redirect("/");
                console.log("No results");
            }

        }


    });



});




//loads the profile page and renders profile.ejs
app.get("/upload", function (req, res) {
    var username = req.session.user;
    res.render("upload.ejs", { "username": username });
});

//loads signup page and renders signup.ejs
app.get("/signup", function (req, res) {

    res.render("signup.ejs", { "Reject": rejection });

});

//gathers the data input from user and updates the usernames and passwords arrays with the given data. then adds one to the totalUsers numbers
app.post("/signup", function (req, res) {

    
    var username = req.body.username;
    var password = req.body.password;

    var usercheck = username.match("^[A-Za-z0-9]+$");
    console.log("check: " + usercheck);
    
    if(usercheck == null) {
        return(res.redirect("/signup"));
        //
    }

    //checks all usernames 
    var check = `SELECT users.username FROM users WHERE users.username = "${username}"`;

    //compares the input username to existing usernames to check if there is already an instance of the given username
    con.query(check, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                console.log("There is already a user with that username");
                res.redirect("/signup");
            } else {

                //looks to generate a new user_ID

                let newID = GenerateID();

                var idCheck = `SELECT users.user_ID FROM users WHERE users.user_ID = "${newID}"`;
                con.query(idCheck, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (results.length > 0) {
                            //checks if user_ID already exists
                            console.log("Already has this ID");
                            newID = GenerateID();
                            console.log("revised ID: " + newID);
                            UpdateUserList(username, password, newID, res, req);
                        } else {
                            UpdateUserList(username, password, newID, res, req);
                        }
                    }
                });


            }
        }
    });


});

function UpdateUserList(username, password, newID, res, req) {
    //if there is not an existing username as the one given, sets the new user details with username and password
    var sql = `INSERT INTO users (username, password, user_ID) VALUES ("${username}", "${password}", "${newID}")`;

    con.query(sql, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            req.session.userID = newID;
            req.session.profile_id = newID;
            req.session.user = username;
            res.redirect("/uploadProf");    //redirects to the profile picture upload page
        }
    });
}



//generates a random 5 digit number for the user id 
function GenerateID() {

    let genID = Math.floor(Math.random() * 90000) + 10000;

    return genID;
}

//generates a random 7 digit number for the post id
function GeneratePostID() {

    let genID = Math.floor(Math.random() * 9000000) + 1000000;

    return genID;
}

//generates a random 9 digit number for the comment id
function GenerateCommentID() {

    let genID = Math.floor(Math.random() * 900000000) + 100000000;

    return genID;
}


//Adds uploaded file from user to sql then loads up their profile displaying the image
app.post("/upload", function (req, res) {
    var currentUser;
    var file = req.files.filename;  //name of the file
    var username = req.session.user;    //name of the user currently logged in
    var userID = req.session.userID;    //id of the user logged in
    var description = req.body.description; //not used

    var postID = GeneratePostID(); //generates an id for the post

    //checks to see if generated id already exists, if true, then generates again
    var postIDCheck = `SELECT posts.post_ID FROM posts WHERE posts.post_ID = "${postID}"`;
    con.query(postIDCheck, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                postID = GeneratePostID(); 
            }
        }
    });

    var newFile = userID + "_" + postID + ".jpg"; //new file name under which the image will be saved in the server side folder
    file.mv("assets/images/" + newFile); //adds new file to the server side folder

    const date = GetDate(); //gets date of upload

    //updates sql with the post id, user id that posted it, date, etc
    var upload = `INSERT INTO posts (post_ID, user_ID, date, description, likes, comments, views) VALUES ("${postID}", "${userID}", "${date}", "no desc", "0", "0", "0")`;
    con.query(upload, function (err, results) {
        if (err) {
            console.log(err);
        }
    });

    currentUser = req.session.userID;   //finds the logged in user's id
    console.log("current: " + currentUser);
    res.redirect("/profile/" + currentUser); //redirects to user's profile page

});

app.get("/uploadProf", function (req, res) {
    var username = req.session.user;
    var profile = req.session.profile_id;
    var userId = req.session.userID;

    //compares to see if the user is logged in, and has clicked from the correct profile
    if (username != null) {
        if (userId == profile) {
            res.render("uploadProfile.ejs", { "username": username });
        } else {
            res.redirect("/profile/" + profile);
        }

    } else {
        res.redirect("/profile/" + profile);
    }

});

app.post("/uploadProf", function (req, res) {
    var userID = req.session.userID;
    var file = req.files.filename;

    
    var newName = "profile_" + userID + ".jpg"; //creates new file name for the user's profile picture

    file.mv("assets/images/" + newName);
    
    //updates sql users table with the new file name for the logged in user's profile picture
    var updateProfile = `UPDATE users SET profile_image = "${newName}" WHERE users.user_ID = "${userID}"`;

    con.query(updateProfile, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.redirect("/profile/" + userID);
        }

    });

});

//returns current date in the format of "dd/mm/yy"
function GetDate() {
    const d = new Date();
    const date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    return date;
}

app.get("/profile/:user", function (req, res) {

    const username = req.session.user;
    //const userID = req.session.userID;

    var userID = req.params.user;
    req.session.profile_id = userID; //sets profile_id to the current profile. relevant for ajax with likes and comments
    console.log("profileId: " + userID);

    var profileName;
    var profile_Image;

    //Checks sql for the profile page's profile picture. chooses default picture if none present
    var userProfile = `SELECT users.username, users.profile_image FROM users WHERE users.user_ID = "${userID}"`;

    con.query(userProfile, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            profileName = results[0].username;
            profile_Image = results[0].profile_image;
            //console.log("prof image : " + profile_Image);
            if (profile_Image == "undefined") {
                profile_Image = "default_profile.jpg"; //default image
            }
        }
    });

    var imageData = `SELECT posts.post_ID, posts.likes, posts.comments FROM posts WHERE posts.user_ID = "${userID}"`;

    var postIDs = [];
    var imageIDs = [];
    var images = [];
    var likes = [];
    var comments = [];
    var num = 0;

    var logButton;
    var logLink;
    var profButton;
    var profLink;

    //changes account buttons depending on if a user is logged in or not
    if (req.session.user == null) {
        logButton = "Log-In";
        logLink = "/login";
        profButton = "Sign-Up";
        profLink = "/signup";
    } else {
        logButton = "Log-Out";
        logLink = "/logout";
        profButton = "Upload";
        profLink = "/upload";
    }

    //loads the posts of the user corresponding to the profile
    con.query(imageData, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {

                for (let i = results.length - 1; i > -1; i--) {

                    postIDs[num] = results[i].post_ID;  //fills up some arrays to feed into ejs later
                    likes[num] = results[i].likes;
                    comments[num] = results[i].comments;
                    //console.log("this post: " + num + "," + results[i].post_ID);
                    num++;
                }


                for (let i = 0; i < postIDs.length; i++) {
                    imageIDs[i] = userID + "_" + postIDs[i] + ".jpg"; //imageIDs will be used to search the images folder on the server side to find the posts belonging to the visited profile

                }

                fs.readdirSync("assets/images").forEach(file => {
                    for (let i = 0; i < imageIDs.length; i++) {
                        if (file == imageIDs[i]) {
                            images[i] = file.toString(); //searches the folder server side for matching image files, adds them to the images array
                        }
                    }

                });

                var findComments = `SELECT comments.comment, comments.post_id, comments.comment_id, comments.username, comments.date FROM comments WHERE comments.post_id`

                //renders the profile ejs and feeds it the arrays of images, likes, comments, usernames, dates, and buttons
                res.render("profile.ejs", { "files": images, "likes": likes, "comment_num": comments, "username": username, "post_IDs": postIDs, "profile_name": profileName, "logButton": logButton, "logLink": logLink, "profButton": profButton, "profLink": profLink, "profileImg": profile_Image });
            } else {
                res.render("profile.ejs", { "files": images, "likes": likes, "comment_num": comments, "username": username, "post_IDs": postIDs, "profile_name": profileName, "logButton": logButton, "logLink": logLink, "profButton": profButton, "profLink": profLink, "profileImg": profile_Image });
            }
        }
    });


});

//logs user out, deletes session values, then returns to homepage
app.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

//searches for users with the given username and brings the user to the corresponding profile page
app.post("/search", function (req, res) {

    var key = req.body.searchTerm;

    var userSearch = `SELECT users.username, users.user_ID FROM users WHERE users.username = "${key}"`;

    con.query(userSearch, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                res.redirect("/profile/" + result[0].user_ID);
            }
        }
    });
});

//called through ajax to update sql with new like data and return the data to ajax
app.post("/like", function (req, res) {
    var postNum = req.body.post_Id;     //postNum is an array index number which is given to find what post has been clicked. So if postNum = 0, that means the first post was clicked

    console.log("yeah id: " + postNum);
    var user = req.session.userID;

    //checks to see if user is logged in, otherwise they cannot like a post
    if (user == null) {
        return;
    }

    var post_Id;
    var profile_id = req.session.profile_id;
    var order;

    //checks if the user is on a profile page or on the home page. The order of the posts are different depending on the page and tabs so different queries have to be used
    if (profile_id == null) {

        //for the home page

        var tabNum = req.body.tabNum; //checks which tab is open on the home page, between popular or recent posts

        
        if (tabNum == 0) {
            order = `SELECT posts.likes, posts.post_ID FROM posts ORDER BY posts.likes DESC`; //popular posts, ordered by likes
        } else {
            order = `SELECT posts.likes, posts.post_ID FROM posts ORDER BY posts.date DESC`; //recent posts, ordered by dates
        }

        var likes = [];
        var newLikes;
        var num = 0;
        con.query(order, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                //console.log(results[3].likes);
                for (let i = results.length - 1; i > -1; i--) {

                    likes[i] = results[i].likes; //completes likes array 

                    //checks if i == to postnum to find the correct post id
                    if (i == postNum) {
                        post_Id = results[i].post_ID;


                    }
                    num++;
                }
                var oldLikes = results[postNum].likes;
                
                //checks likes table in the sql with the corresponding user_id and post_id to see if the user has already liked the post
                var checkLikes = `SELECT likes.post_id, likes.user_id FROM likes WHERE likes.post_id = "${post_Id}" AND likes.user_id = "${user}"`;
                con.query(checkLikes, function (err, likeresults) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (likeresults.length > 0) {
                            res.json(oldLikes);
                        } else {

                            newLikes = oldLikes + 1;    //adds 1 to the likes

                            //adds the post_id and user_id to the likes table to flag this post as "liked" by this user
                            var updateLikeTable = `INSERT INTO likes VALUES ("${post_Id}", "${user}")`;
                            con.query(updateLikeTable, function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("likes updated");
                                }
                            });

                            //updates posts table in sql with new like count for the corresponding post
                            var updateLike = `UPDATE posts SET posts.likes = "${newLikes}" WHERE posts.post_ID = "${post_Id}"`;

                            con.query(updateLike, function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    
                                    res.json(newLikes); //responds to the ajax call with the new likes count
                                }
                            });
                        }
                    }
                });




            }
        });


    } else {
        //this is for when the user is on a profile page


        order = `SELECT posts.likes, posts.post_ID FROM posts WHERE posts.user_ID = '${profile_id}'`;

        var likes = [];
        var newLikes;
        var num = 0;
        con.query(order, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                //console.log(results[3].likes);
                for (let i = results.length - 1; i > -1; i--) {

                    likes[num] = results[i].likes; //filters through posts in reverse and counts up for the likes array so that the most recent posts on a profile show up first 


                    if (num == postNum) {
                        post_Id = results[i].post_ID;

                        newLikes = results[postNum].likes + 1;
                        console.log(newLikes);
                        console.log("post_id:" + post_Id);
                        var updateLike = `UPDATE posts SET posts.likes = "${newLikes}" WHERE posts.post_ID = "${post_Id}"`;

                        con.query(updateLike, function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json(newLikes);
                            }
                        });
                    }
                    num++;
                }
            }
        });
    }



});

//ajax call to update the post view and commenting window with the correct comment history and image
app.post("/show_comments", function (req, res) {

    var postNum = req.body.postNum;
    var profile_id = req.session.profile_id;
    var findPost;


    var post_id;
    var comments = [];
    var commenters = [];
    var dates = [];
    var username;
    var postDate;
    var user_id;

    var url = req.body.url;
    console.log("num: " + postNum);
    console.log("img url: " + url);

    var num = 0;

    //checks to see if on home page or a profile page
    if (profile_id == null) {

        var tabNum = req.body.tabNum;
        console.log("tab: " + tabNum);
        if (tabNum == 0) {
            findPost = `SELECT posts.post_ID, posts.user_ID, posts.date FROM posts ORDER BY posts.likes DESC`;
        } else {
            findPost = `SELECT posts.post_ID, posts.user_ID, posts.date FROM posts ORDER BY posts.date DESC`;
        }

        con.query(findPost, function (err, results) {
            if (err) {
                console.log(err);
            } else {

                for (let i = results.length - 1; i > -1; i--) {

                    if (i == postNum) {
                        post_id = results[i].post_ID;
                        user_id = results[i].user_ID;
                        postDate = results[i].date;
                    }
                }

                //finds the name of the post's creator
                var findUsernames = `SELECT users.username FROM users WHERE users.user_ID = "${user_id}"`;

                con.query(findUsernames, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        username = results[0].username;
                        
                    }
                });

                console.log("post_id: " + post_id);

                //finds all the comments belonging to this post
                var findComments = `SELECT comments.comment, comments.username, comments.date FROM comments WHERE comments.post_id = "${post_id}"`;

                con.query(findComments, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        for (let i = 0; i < results.length; i++) {
                            comments[i] = results[i].comment;   //fills up comment array with the loaded comments
                            commenters[i] = results[i].username;    //fills up commenter array with the loaded names of the users who have prveiously commented
                            dates[i] = results[i].date; // finds the dates that the comments were posted
                        }
                        //var response = [comments, commenters, dates];
                        console.log("we have reached");

                        var response = [commenters, comments, dates, username, postDate]; //feeds the arrays, username, and postdate back to ajax
                        res.json(response);
                    }
                });
            }

        });

    } else {

        //same as above but only check the posts that appear on the given profie


        findPost = `SELECT posts.post_ID, posts.date, posts.user_ID FROM posts WHERE posts.user_ID = "${profile_id}"`;

        con.query(findPost, function (err, results) {
            if (err) {
                console.log(err);
            } else {

                //have to use num to count upwards so that the proper posts are chosen

                for (let i = results.length - 1; i > -1; i--) {

                    if (num == postNum) {
                        post_id = results[i].post_ID;
                        user_id = results[i].user_ID;
                        postDate = results[i].date;
                    }

                    num++; 

                }

                var findUsernames = `SELECT users.username FROM users WHERE users.user_ID = "${user_id}"`;

                con.query(findUsernames, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        username = results[0].username;
                        console.log("username of this post is: " + username);
                    }
                });

                console.log("post_id: " + post_id);
                var findComments = `SELECT comments.comment, comments.username, comments.date FROM comments WHERE comments.post_id = "${post_id}"`;

                con.query(findComments, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        for (let i = 0; i < results.length; i++) {
                            comments[i] = results[i].comment;
                            commenters[i] = results[i].username;
                            dates[i] = results[i].date;
                        }
                        //var response = [comments, commenters, dates];
                        console.log("we have reached");

                        var response = [commenters, comments, dates, username, postDate];
                        res.json(response);
                    }
                });
            }

        });
    }
});


//ajax call to update the comment list with the user's new comment
app.post("/comment", function (req, res) {
    var newComment = req.body.comment; //comment the user posted
    console.log("comment: " + newComment);
    var profile_id = req.session.profile_id; //finds profile_id
    var commenter = req.session.userID; //finds user id of who commented
    var username = req.session.user; //finds username of who commented
    var postNum = req.body.post_Id; //finds array index of post commented on
    
    var post_id;
    var post_comment_num;
    var num = 0;

    if (profile_id == null) {
        var tabNum = req.body.tabNum;
        console.log(tabNum);
        if (tabNum == 0) {
            findPost = `SELECT posts.post_ID, posts.comments FROM posts ORDER BY posts.likes DESC`;
        } else {
            findPost = `SELECT posts.post_ID, posts.comments FROM posts ORDER BY posts.date DESC`;
        }

        con.query(findPost, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                for (let i = results.length - 1; i > -1; i--) {

                    if (i == postNum) {
                        post_id = results[i].post_ID; //post id
                        post_comment_num = results[i].comments; //number of comments
                    }



                }

                //updates posts table with new number of comments for that post
                var updateCommentNum = `UPDATE posts SET posts.comments = "${post_comment_num + 1}" WHERE posts.post_ID = "${post_id}"`;

                con.query(updateCommentNum, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("we've done it 1");
                    }
                });

                //generate comment id and finds date of comment being posted
                var commentId = GenerateCommentID();
                const date = GetDate();

                //checks for duplicate comments ids, rerolls if found
                var commentIDCheck = `SELECT comments.comment_id FROM comments WHERE comments.comment_id = "${commentId}"`;
                con.query(commentIDCheck, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (results.length > 0) {
                            commentID = GenerateCommentID();
                        }
                    }
                });

                //adds given user comment to the sql, with the comment id, post it was commented on's id, username, user who commented's id, date
                var addComment = `INSERT comments (comment_id, comment, post_id, username, user_id, date) VALUES ("${commentId}", "${newComment}", "${post_id}", "${username}", "${commenter}", "${date}")`;

                con.query(addComment, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        console.log("home comment");
                        var response = [newComment, username, date]; //responds to ajax with the comment, the username of the commenter, and the date
                        res.json(response);
                    }
                });
            }
        });

    } else {

        //same as above but only check the posts that appear on the given profie

        var findPost = `SELECT posts.post_ID, posts.comments FROM posts WHERE posts.user_ID = "${profile_id}"`;

        con.query(findPost, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                for (let i = results.length - 1; i > -1; i--) {

                    if (num == postNum) {
                        post_id = results[num].post_ID;
                        post_comment_num = results[num].comments;
                    }

                    num++;

                }

                var updateCommentNum = `UPDATE posts SET posts.comments = "${post_comment_num + 1}" WHERE posts.post_ID = "${post_id}"`;

                con.query(updateCommentNum, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("we've done it 1");
                    }
                });

                var commentId = GenerateCommentID();
                const date = GetDate();
                var commentIDCheck = `SELECT comments.comment_id FROM comments WHERE comments.comment_id = "${commentId}"`;
                con.query(commentIDCheck, function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (results.length > 0) {
                            commentID = GenerateCommentID();
                        }
                    }
                });

                var addComment = `INSERT comments (comment_id, comment, post_id, username, user_id, date) VALUES ("${commentId}", "${newComment}", "${post_id}", "${username}", "${commenter}", "${date}")`;

                con.query(addComment, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        console.log("profile comment");
                        var response = [newComment, username, date];
                        res.json(response);
                    }
                });
            }
        });
    }













});


app.listen(port);
console.log("server runnning on http://localhost:" + port);

