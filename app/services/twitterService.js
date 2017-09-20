angular.module('myApp').service("twitterService",function($http){

    this.getFeed = function(handle){
        return $http({ //refactor to Service
            method: "GET",
            url:"./twitter/feed",
            params: {
              "screen_name": handle
            }
          })
    }

    this.uploadImage = function(image){
        return $http({ //refactor to Service
            method: "POST",
            url:"./twitter/uploadImage",
            data: {
              "image": image
            }
          })
    }

    this.sendTweet = function(tweet, imageInfo){
        //console.log("sendTweetService: ", imageInfo);
        return $http({
            method: "POST",
            url: "./twitter/sendTweet",
            data: {
                "tweet": tweet,
                "imageInfo": imageInfo
            }
        })
    }
    this.signInStep1 = function(){
        return $http({
            method: "GET",
            url: "twitter/signInStep1"
        })
    }

    this.signInStep2 = function(oauthVerifier){
        return $http({
            method: "GET",
            url: "twitter/signInStep2",
            params:{
                oauthVerifier: oauthVerifier
            }
        })
    }
})