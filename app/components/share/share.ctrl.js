angular.module('myApp').component('share',{
    templateUrl: 'components/share/share.tmpl.html',
    controller: shareController
})

shareController.$inject = ["$scope", "twitterService"];

function shareController($scope, twitterService){
    var self = this;

    self.uploadedFile;
    self.twitterPin = "";
    self.tweetText;
    self.authedSuccessfully = false;
    self.authStep = 1;

    this.handleSendTweet = function(){
        self.uploadFile(function(imageInfo){
            self.sendTweet(imageInfo);
        })
        
    }

    this.sendTweet = function(imageInfo){
        twitterService.sendTweet(self.tweetText, imageInfo).then(function(response){
            console.log("send Tweet: ", response);
        })
    }

    $scope.imageSelected = function(){
        var f = document.getElementById('file').files[0]
        var r = new FileReader();
        
        r.onloadend = function(e) {
            var data = e.target.result;
            data=btoa(data)
            $scope.$apply(function(){
                self.uploadedFile = data;
            })
        }
            if(f){
                r.readAsBinaryString(f);
            }
    }

    this.uploadFile = function(callback){
       if(self.uploadedFile){
        
            twitterService.uploadImage(self.uploadedFile)
                .then(function(response){
                    if(callback){
                        callback(response.data)
                    }
                })  
        }else{
                if(callback){
                    callback(null);
                }
            }
    }


    this.twitterSignIn = function(){
        twitterService.signInStep1().then(function(response){
            
            window.open(response.data);
            self.authStep =2;
        });
    }

    this.twitterPinChanged = function(){
        this.handleTwitterPin();
    }
    
    this.handleTwitterPin = function(){
        twitterService.signInStep2(self.twitterPin).then(function(response){
            
            if(response.status == 200){
                self.authedSuccessfully = true;
            }
        });
    }

}