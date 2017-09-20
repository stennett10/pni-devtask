angular.module('myApp').component('tweet',{
    templateUrl: 'components/tweet/tweet.tmpl.html',
    controller: tweetController,
    bindings :{
        tweetid: "<", 
        text: "<",
        media: "<",
        index: "<",
        userScreenName: "<"
    }
})

tweetController.$inject = ["$scope", "$element"];

function tweetController($scope, $element){
    var self = this;
     
    this.$onChanges = function(changes){
        
        switch (self.index){
            case 9:
                $element.removeClass('animate9');
                break;
            case 8:
                $element.removeClass('animate8');
                break;
            case 7:
                $element.removeClass('animate7');
                break;
            case 6:
                $element.removeClass('animate6');
                break;
            case 5:
                $element.removeClass('animate5');
                break;
            case 4:
                $element.removeClass('animate4');
                break;
            case 3:
                $element.removeClass('animate3');
                break;
            case 2:
                $element.removeClass('animate2');
                break;
            case 1:
                $element.removeClass('animate1');
                break;
            case 0:
                $element.removeClass('animate0');
                $element.addClass('animate-out');
            
        }

        void $element[0].offsetWidth; //animation class re-apply hack
        self.setPosition();

        
        switch (self.index){
            case 9:
                $element.addClass('animate9');
                break;
            case 8:
                $element.addClass('animate8');
                break;
            case 7:
                $element.addClass('animate7');
                break;
            case 6:
                $element.addClass('animate6');
                break;
            case 5:
                $element.addClass('animate5');
                break;
            case 4:
                $element.addClass('animate4');
                break;
            case 3:
                $element.addClass('animate3');
                break;
            case 2:
                $element.addClass('animate2');
                break;
            case 1:
                $element.addClass('animate1');
                break;
            case 0:
                $element.addClass('animate0');
                $element.removeClass('animate-out');
            
        }
        
    
    }

    this.$onInit = function(){
        self.setPosition();
        
    }

    this.setPosition = function(){
        Math.seedrandom(self.tweetid);
        
        this.x = Math.abs(Math.random()*60)
        this.y = Math.abs(Math.random()*60)
       
        $element.css("left", `${this.x}%`)
        $element.css("top", `${this.y}%`)
    }
}