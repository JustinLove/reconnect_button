(function() {
  "use strict"

  //load html dynamically
  var loadTemplate = function (element, url, model) {
    $.get(url, function (html) {
      console.log("Loading html " + url);
      element.append(html)
      ko.applyBindings(model, element.get(0));
    });
  };

  loadTemplate($('#navigation_items'), 'coui://ui/mods/reconnect_button/reconnect_button.html', model);
  model.lobbyId.subscribe(function(lobbyId) {
    sessionStorage['lobbyId'] = encode(lobbyId);
  })

  model.reconnectButtonStart = function() {
    if (model.lobbyId()) {
      model.joinGame(model.lobbyId());
    }
  }

  var updateGameState = function () {
    engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
      console.log(data, "getGameWithPlayer");
      data = JSON.parse(data);
      model.lobbyId(data.LobbyID);
      if (data.PlayerInGame) {
        setTimeout(updateGameState, 10*1000)
      }
    })
  }

  setTimeout(updateGameState, 0)
  
})()
