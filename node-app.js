var express = require('express')
var app = express()
var https = require('https');
var bodyParser = require('body-parser');
var twitterAPI = require('node-twitter-api');
var session = require('express-session')
var hmacsha1 = require('hmacsha1');

app.use(bodyParser.json({limit: '10mb'})); // for parsing application/json
app.use(express.static(__dirname + '/app'));
app.use(session({
    secret: 'alphabetti-spaghetti',
    resave: false,
    saveUninitialized: true
  }))


app.listen(80);
console.log("App listening on port 80");
var consumerKey = "fOSAaqhOPTXSmOT3GsujkLYcp";
var consumerSecret = "JEbX5VulKjTI49OBzlSzRx8kDhoOkp6KYWUxBBXck6zYBd6RVK";
var authString = Buffer.from('fOSAaqhOPTXSmOT3GsujkLYcp:JEbX5VulKjTI49OBzlSzRx8kDhoOkp6KYWUxBBXck6zYBd6RVK').toString('base64');
var api_access_token;
var twitter = new twitterAPI({
    consumerKey: 'fOSAaqhOPTXSmOT3GsujkLYcp',
    consumerSecret: 'JEbX5VulKjTI49OBzlSzRx8kDhoOkp6KYWUxBBXck6zYBd6RVK',
    callback: 'oob'
});

var self = this;


/* Twitter auth */

/*
this.generateNonce = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

this.generateSignature = function(image,consumerSecret,consumerKey,nonce,signatureMethod,timestamp,accessToken,accessTokenSecret,version,httpMethod,baseURL){
    //console.log("Generating Signature:")
    image = encodeURIComponent(image);
    consumerKey = encodeURIComponent(consumerKey);
    nonce = encodeURIComponent(nonce);
    signatureMethod = encodeURIComponent(signatureMethod);
    timestamp = encodeURIComponent(timestamp);
    accessToken = encodeURIComponent(accessToken);
    version = encodeURIComponent(version);
    //console.log("\n");
    //console.log(consumerSecret,nonce,signatureMethod,timestamp,accessToken,accessTokenSecret,version)
    
    var parameterString = `media_data=${image}&oauth_consumer_key=${consumerKey}&oauth_nonce=${nonce}&oauth_signature_method=${signatureMethod}&oauth_timestamp=${timestamp}&oauth_token=${accessToken}&oauth_version=${version}`
    //console.log("\n");
   // console.log("param: " + `media_category=tweet_image&media_data={image}&oauth_consumer_key=${consumerKey}&oauth_nonce=${nonce}&oauth_signature_method=${signatureMethod}&oauth_timestamp=${timestamp}&oauth_token=${accessToken}&oauth_version=${version}`);

    httpMethod = httpMethod.toUpperCase();
    
    
    var finalString = `${httpMethod}&${encodeURIComponent(baseURL)}&${encodeURIComponent(parameterString)}`
    //console.log("\n");
    //console.log("final: ",`${httpMethod}&${encodeURIComponent(baseURL)}`);
    var signingString = `${consumerSecret}&${accessTokenSecret}`
    //console.log("\n");
    //console.log("sign: ", signingString);
    
    //console.log("hmash: " ,hmacsha1("kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE","POST&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello%2520Ladies%2520%252B%2520Gentlemen%252C%2520a%2520signed%2520OAuth%2520request%2521"))
    return hmacsha1(signingString,finalString);
}*/

/*Application-only auth */
makeTwitterAuthRequest(authString);
function makeTwitterAuthRequest(authString){
    var options = {
        host: 'api.twitter.com',
        port: 443,       
        path: '/oauth2/token',
        method: 'POST',
        headers: {
            "Authorization": "Basic " + authString,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          },
      };
      
    var req = https.request(options, function(resp){
        resp.setEncoding('utf8');
        
        var body = "";
        resp.on('data', function(chunk){
            body += chunk;
        });

        resp.on('end', function(){
           
            body = JSON.parse(body);
            api_access_token = body.access_token;
            console.log("Authed with twitter correctly: " + api_access_token);
        
        })
      }).on("error", function(e){
        console.log("Got error: " + e.message);
      });

      req.write("grant_type=client_credentials")
      req.end()
}

/*UserContext Auth */
app.get("/twitter/signInStep1", function(req,res){
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if (error) {
            console.log("Error getting OAuth request token : " + JSON.stringify(error));
        } else {
            if(!req.session.requestToken){
                req.session.requestToken = {}
            }
            if(!req.session.requestTokenSecret){
                req.session.requestTokenSecret = {}
            }
            req.session.requestToken = requestToken;
            req.session.requestTokenSecret = requestTokenSecret;
            
            var redirectUrl = "https://twitter.com/oauth/authenticate?oauth_token="
            res.send(`${redirectUrl}${requestToken}`);
        }
    });
})

app.get("/twitter/signInStep2", function(req,res){
    var requestToken = req.session.requestToken;
    var requestTokenSecret = req.session.requestTokenSecret;

    var oauth_verifier = req.query.oauthVerifier;
    //console.log("step2: ", requestToken, requestTokenSecret, oauth_verifier);
    twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {
            console.log(error);
        } else {
            if(!req.session.accessToken){
                req.session.accessToken = {};
            }
            if(!req.session.accessTokenSecret){
                req.session.accessTokenSecret = {};
            }
            req.session.accessToken = accessToken;
            req.session.accessTokenSecret = accessTokenSecret;
            
            res.send();
        }
    });
})

app.get("/twitter/feed", function(req, res){ 
    getTwitterFeed(req.query.screen_name, function(response){
        res.send(response);
    });
});

function getTwitterFeed(screen_name, callback){
    var queryString = `?tweet_mode=extended&include_rts=false&exclude_replies=true&count=200&screen_name=${screen_name}`
    
    var options = {
        method: 'GET',
        host: 'api.twitter.com',
        port: 443,   
        path: `/1.1/statuses/user_timeline.json${queryString}`,
        headers: {
            "Authorization": "Bearer " + api_access_token           
          },
      };
    
    var req = https.request(options, function(resp){
        resp.setEncoding('utf8');
        
        var body = "";
        resp.on('data', function(chunk){
            body += chunk;
        });

        resp.on('end', function(){
            callback(body);
        
        })
      }).on("error", function(e){
        console.log("Got error: " + e.message);
      });
      
      req.end()
}

app.post("/twitter/uploadImage", function(req,res){
    var access_token = req.session.accessToken
    var access_tokenSecret = req.session.accessTokenSecret
    
    uploadImageToTwitter(req.body.image, access_token, access_tokenSecret, function(response){
        res.send(response);
    });
    
})

function uploadImageToTwitter(image, accessToken, accessTokenSecret, callback){
    var params = {
        media: image,
        isBase64: true
    }
    
    twitter.uploadMedia(params, accessToken, accessTokenSecret, function(error,body){
        if(error){
            console.log(error);
           
        }else{
            callback(body);
        }
    })

    /*manual attempt
    {
        var nonce = self.generateNonce();
        var timestamp = Math.floor(new Date() / 1000);
        var signature = self.generateSignature(image,consumerSecret,consumerKey,nonce,"HMAC-SHA1",timestamp,accessToken,accessTokenSecret,"1.0","POST","https://upload.twitter.com/1.1/media/upload.json");
        var oauthString = `OAuth oauth_consumer_key="${consumerKey}",oauth_nonce="${nonce}",oauth_signature="${encodeURIComponent(signature)}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${timestamp}",oauth_token="${accessToken}",oauth_version="1.0"`;
        //console.log("authstring: ", oauthString);
        var options = {
            host: 'upload.twitter.com',
            port: 443,       
            path: '/1.1/media/upload.json',
            method: 'POST',
            headers: {
                "Authorization": oauthString,
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Content-Transfer-Encoding":"base64"
            },
        };
        
        var req = https.request(options, function(resp){
            resp.setEncoding('utf8');
            
            var body = "";
            resp.on('data', function(chunk){
                body += chunk;
            });

            resp.on('end', function(){
            
                body = JSON.parse(body);
                console.log(body);
                //console.log(body.media_id_string);
            
            })
        }).on("error", function(e){
            console.log("Got error: " + e.message);
        });

        req.write("media_data="+image);
        req.end()
        //console.log(req);
    }
    */
}

app.post("/twitter/sendTweet", function(req,res){
    var access_token = req.session.accessToken
    var access_tokenSecret = req.session.accessTokenSecret
    
    var imageData = null;
    if(req.body.imageInfo){
        imageData = req.body.imageInfo.media_id_string
    }
    sendTweet(req.body.tweet,imageData, access_token, access_tokenSecret, function(response){
        
        res.send(response);
    });
    
})

function sendTweet(tweet,imageId, accessToken, accessTokenSecret, callback){
    var params = {status: tweet};
    
    if(imageId){
        params = {
            status: tweet,
            media_ids: imageId
        }
    }
    
    twitter.statuses("update", params, accessToken, accessTokenSecret, function(error, data, response){
        if(error){
            console.log(error);
        }else{
            callback(data);
        }
    })

}







