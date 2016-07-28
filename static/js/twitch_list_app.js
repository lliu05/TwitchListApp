(function() {
  var app = angular.module('twitchListApp', []);
  
  app.controller('twitchController', ['$http', function($http){
    var twitchList = this;
    twitchList.channels = {};
    twitchList.channelArray = [];
    twitchList.allUsers = [];
    twitchList.onlineUsers = [];
    twitchList.offlineUsers = [];
    
    //Target users list
    var channels = ["FreeCodeCamp", "storbeck", "terakilobyte", "Habathcx","RobotCaleb","thomasballinger","noobs2ninjas","Beohoff", "MedryBW", "FotiGames"];
 
    for (var i = 0; i < channels.length; i++ ) {
      //Build object lists of channels
      twitchList.channels[channels[i]] =
      {
        name: channels[i],
        api_stream: 'https://api.twitch.tv/kraken/streams/' + channels[i],
        api_channel: 'https://api.twitch.tv/kraken/channels/' + channels[i],
        image: "",
        online: "", 
        status: ""
      }
    }  
    
    for (var channel in twitchList.channels) {
      //Get user logos
      var request_img = $http.get(twitchList.channels[channel].api_channel);
      request_img.then(function(data) {
        if (data.data.logo) {
          twitchList.channels[data.data.display_name].image = data.data.logo;
        }
        else {
          twitchList.channels[data.data.display_name].image = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRG9bACQ_YrbUGLe1cCOqcLdNdweXMNsJk0LHKlQtZhY0PUoOBC";    
        }
      }); 
      
      //Get user stream
      var request = $http.get(twitchList.channels[channel].api_stream);
      request.then(function(data) {  
        var channel_test_regex = /([^/]*)$/g;
        var channel_test = data.data._links.self.match(channel_test_regex).join("");
        if (data.data.stream) {
          twitchList.channels[channel_test].online = data.data.stream;
          twitchList.allUsers.push(twitchList.channels[channel_test]);
          twitchList.onlineUsers.push(twitchList.channels[channel_test]);
        }
        else {
          twitchList.allUsers.push(twitchList.channels[channel_test]);
          twitchList.offlineUsers.push(twitchList.channels[channel_test]);
        }
      });          
    }  
    
    //Conver object lists to array
    for (var c in twitchList.channels) {
      twitchList.channelArray.push(twitchList.channels[c]);
    }
    
    
    this.tab = 1;

    this.setTab = function(newValue){
      this.tab = newValue;
      switch(newValue) {
        case 1:
          twitchList.channelArray = twitchList.allUsers;
          break;
        case 2:
          twitchList.channelArray = twitchList.onlineUsers;
          break;
        case 3:
          twitchList.channelArray = twitchList.offlineUsers;
          break;
      }
    };

    this.tabIsSet = function(tabName){
      return this.tab === tabName;
    };
    
    //console.log(twitchList.channelArray);
    //console.log(twitchList.onlineUsers);
    //console.log(twitchList.offlineUsers);
  }]);
  
})();
