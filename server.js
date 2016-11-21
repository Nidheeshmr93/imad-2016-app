var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'nidheeshmr93',
    database: 'nidheeshmr93',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <!doctype html>
<html>
<head>
<title>
 ${title}
</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="/ui/style.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="/ui/coin-slider.css" />
<script type="text/javascript" src="/ui/cufon-yui.js"></script>
<script type="text/javascript" src="/ui/cufon-titillium-250.js"></script>
<script type="text/javascript" src="/ui/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="/ui/script.js"></script>
<script type="text/javascript" src="/ui/coin-slider.min.js"></script>
    </head>
    <body>
        <div class="main">
		    <div class="header">
		    <div class="header_resize">
      <div class="logo">
        <h1><a href="/" id="logo">Nidheesh's <span>Blog</span> <small>It's Personal</small></a></h1>
      </div>
      <div class="menu_nav">
        <ul>
          <li><a href="/"><span>Home Page</span></a></li>
          <li class="active"><a href="/article"><span>My Articles</span></a></li>
          <li><a href="/videos"><span>My Favourite Videos</span></a></li>
          <li><a href="/contact"><span>Contact Me</span></a></li>
        </ul>
      </div>
	  <div class="clr"></div>
      <div class="slider">
        <div id="coin-slider"><a href="#"><img src="/ui/slide1.jpg" width="935" height="307" alt="" /></a> <a href="#"><img src="/ui/slide2.jpg" width="935" height="307" alt="" /></a> <a href="#"><img src="/ui/slide3.jpg" width="935" height="307" alt="" /></a></div>
        <div class="clr"></div>
      </div>
      <div class="clr"></div>
    </div>
  </div>
    <div class="content">
    <div class="content_resize">
      <div class="mainbar">
        <div class="article">
          <h2>${heading}</h2>
          <p class="infopost"> ${date.toDateString()}</p>
          <div class="clr"></div>
          <div class="post_content">
            <div id="articles">
              <div>
                <p style="font-size:18px;text-align:justify; text-indent: 50px; line-height: 1.8;"> ${content} </p>
              </div>
              <hr/>
              <h2>Comments</h2>
              <div id="comment_form">
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
            </div>
			<hr/>
          </div>
          <div class="clr"></div>
        </div>
      </div>
      <div class="sidebar">
        <div class="clr"></div>
        <div class="g1">
          <div class="g2">
            <div class="gadget">
              <h2 class="star"><span>Sidebar</span> Menu</h2>
              <div class="clr"></div>
              <ul class="sb_menu">
			    <li><p id="login_area"> <a href="/login">Login</a>  </p>
				</br>
				</br>
                <li><a href="/">Home</a></li>
                <li><a href="/article">My Articles</a></li>
                <li><a href="/videos">My Favourite Videos</a></li>
                <li><a href="/contact">Contact Me</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="clr"></div>
    </div>
  </div>
      <div>     
         
      </div>	   
    <div class="footer">
     <div class="footer_resize">
	   <p id="rl"> If you are a new user then  <a href="/reg">register now</a>.&nbsp Or &nbsp please  <a href="/login">login</a> to comment my articles.</p>
       <p class="lf">&copy; Copyright Nidheesh's.</p>
       <p class="rf">Design by Nidheesh</p>

       <div style="clear:both;"></div> 
     </div>
   </div>
</div>           
<script type="text/javascript" src="/ui/article.js"></script>
</body>
</html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});

app.get('/reg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'reg.html'));
});

app.get('/insertpost', function (req, res) {
	//only admin can access this page. here the admin is usernamed 'nidheeshmr93' 
  res.sendFile(path.join(__dirname, 'ui', 'insertpost.html'));
});

app.get('/article', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article.html'));
});

app.get('/videos', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'videos.html'));
});

app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
});

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "Nidheesh", "password": "password"}
   // JSON
   var username = req.body.username;
   var email = req.body.email;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username,email,password) VALUES ($1, $2, $3)', [username, email, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully Registered: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});
app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/check-adlogin', function (req, res) {
	//it's used to check whether the user is admin or not
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
			  var urname=result.rows[0].username;
			  if(urname=="nidheeshmr93")
			  {
			   //nidheeshmr93 is the admin's user name 
               res.send(result.rows[0].username);    
               }
       }
	  
    });
   }
   else {
       res.status(400).send('You are not logged in');
   }

});


app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});

app.post('/create-post', function (req, res) {
     var title = req.body.title;
     var heading = req.body.heading;
     var date = req.body.date;
     var content = req.body.content;
   pool.query('INSERT INTO article (title,heading,date,content) VALUES ($1, $2, $3, $4)', [title, heading, date,content], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('The article successfully added : ' + title);
      }
   });
	
});

var pool = new Pool(config);

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
