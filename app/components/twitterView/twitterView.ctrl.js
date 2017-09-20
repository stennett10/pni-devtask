angular.module('myApp').component('twitterView',{
    templateUrl: 'components/twitterView/twitterView.tmpl.html',
    controller: twitterViewController 
})

twitterViewController.$inject = ["$http","$scope","$uibModal","twitterService"];

function twitterViewController($http, $scope, $uibModal,twitterService){
    var self = this;
    this.twitterHandle = "";
    this.tweets ;
    this.error = false;
    this.tweetsToDisplay = {};
    this.displayStartIndex = 0;
    this.numberToDisplay = 10;
    
    
    $scope.slider = {
        value:0,
        options: {
            floor: 0,
            ceil: 100,
            hideLimitLabels: true,
            hidePointerLabels: true,
            onChange: function(){
                //console.log($scope.slider.value);
                self.displayStartIndex = $scope.slider.value;
                self.moveDisplay();
                
            }
        }
    }
    
    this.handleChange = function(){
        self.displayStartIndex = 0;
        self.makeTwitterApiRequest()
    }

    this.makeTwitterApiRequest = function(){
        twitterService.getFeed(self.twitterHandle)
        .then(function(response){
            console.log(response);

            if(response.data.errors){
                self.error = true;
            }else{
                self.error = false;
            }

            self.tweets = response.data;
            self.moveDisplay();
            $scope.slider.options.ceil = self.tweets.length
                       
            setInterval(function(){
                if($scope.slider.value >= $scope.slider.options.ceil){
                    $scope.slider.value = 0;
                }
                $scope.slider.value++
                $scope.$broadcast('rzSliderForceRender');
                $scope.slider.options.onChange();
            }, 1500)
            
         })
       }

       this.moveDisplay = function(){
            for(var i = 0; i < this.numberToDisplay; i++){
                self.tweetsToDisplay[i] = self.tweets[self.displayStartIndex + i]
            }

       }

       this.openModal = function () {
           
           var modalInstance = $uibModal.open({
                animation: true,
                component: 'share',
                size:'lg'
                
            });
        }

}