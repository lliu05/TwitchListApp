(function () {
    "use strict";
    var app = angular.module('twitchListApp', []);
    app.controller('twitchController', ['$http', function ($http) {
        var twitchList = this,
            //target users list
            channels = ["FreeCodeCamp", "storbeck", "terakilobyte", "Habathcx",  "RobotCaleb", "thomasballinger", "noobs2ninjas", "Beohoff", "MedryBW",  "FotiGames"];
        
        //app structure
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
            stream: 'https://api.twitch.tv/kraken/streams/' + channels[i] + '?response_type=token&client_id=ghv9j3bobv4tkouzcob2e3p9iuqm825',
            channel: 'https://api.twitch.tv/kraken/channels/' + channels[i] + '?response_type=token&client_id=ghv9j3bobv4tkouzcob2e3p9iuqm825',
            image: "",
            online: "", 
            status: ""
          }
        }  
        
        //get user logo
        function getImage (theData) {
            if (theData.data.logo) {
                twitchList.channels[theData.data.display_name].image = theData.data.logo;
            } else {
                twitchList.channels[theData.data.display_name].image = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRG9bACQ_YrbUGLe1cCOqcLdNdweXMNsJk0LHKlQtZhY0PUoOBC";    
            }
        }   
        
        //get user stream
        function getStream (theData) {
            var channelTestRegex = /([^/]*)$/g;
            var channelTest = theData.data._links.self.match(channelTestRegex).join("");
            if (theData.data.stream) {
                twitchList.channels[channelTest].online = theData.data.stream;
                twitchList.allUsers.push(twitchList.channels[channelTest]);
                twitchList.onlineUsers.push(twitchList.channels[channelTest]);
            } else {
                twitchList.allUsers.push(twitchList.channels[channelTest]);
                twitchList.offlineUsers.push(twitchList.channels[channelTest]);   
            } 
        }

        for (var channel in twitchList.channels) {
            //get user logos
            var requestImg = $http.get(twitchList.channels[channel].channel);
            requestImg.then(getImage); 
          
            //get user streams
            var request = $http.get(twitchList.channels[channel].stream);       
            request.then(getStream);          
        }  
        
        //convert object lists to array
        for (var c in twitchList.channels) {
            twitchList.channelArray.push(twitchList.channels[c]);
        }
        
        
        this.tab = 1;

        this.setTab = function (newValue) {
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

        this.tabIsSet = function (tabName) {
            return this.tab === tabName;
        };
    }]); 
})();
