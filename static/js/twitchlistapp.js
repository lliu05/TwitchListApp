(function () {
    "use strict";
    var app = angular.module('twitchListApp', []);
    app.controller('twitchController', ['$http', function ($http) {
        var twitchList = this,
            //target users list
            channels = ["FreeCodeCamp", "storbeck", "terakilobyte", "Habathcx",  "RobotCaleb", "thomasballinger", "noobs2ninjas", "Beohoff", "MedryBW",  "FotiGames"];
        twitchList.channels = {};
        twitchList.channelArray = [];
        twitchList.allUsers = [];
        twitchList.onlineUsers = [];
        twitchList.offlineUsers = [];
        for (var i = 0; i < channels.length; i++ ) {
          //build object lists of channels
          twitchList.channels[channels[i]] =
          {
            name: channels[i],
            api_stream: 'https://api.twitch.tv/kraken/streams/' + channels[i] + '?response_type=token&client_id=ghv9j3bobv4tkouzcob2e3p9iuqm825',
            api_channel: 'https://api.twitch.tv/kraken/channels/' + channels[i] + '?response_type=token&client_id=ghv9j3bobv4tkouzcob2e3p9iuqm825',
            image: "",
            online: "", 
            status: ""
          }
    }  
    
    for (var channel in twitchList.channels) {
      //get user logos
      var request_img = $http.get(twitchList.channels[channel].api_channel);
      request_img.then(function(data) {
        if (data.data.logo) {
          twitchList.channels[data.data.display_name].image = data.data.logo;
        }
        else {
          twitchList.channels[data.data.display_name].image = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRG9bACQ_YrbUGLe1cCOqcLdNdweXMNsJk0LHKlQtZhY0PUoOBC";    
        }
      }); 
      
      //get user stream
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
    
    //convert object lists to array
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
  }]); 
})();
