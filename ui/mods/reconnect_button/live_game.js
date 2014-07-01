(function() {
  "use strict"

  model.menuConfig.push({label: 'Reconnect', action: 'reconnectButtonReset'})

  model.reconnectButtonReset = function() {
    if( model.haveUberNet() )
        model.abandon();
    model.disconnect();

    var lobbyId = ko.observable('').extend({ session: 'lobbyId' });
    console.log(lobbyId())

    setTimeout(function() {
      engine.asyncCall("ubernet.joinGame", lobbyId()).done(function (data) {
          data = JSON.parse(data);

          var displayName = ko.observable('').extend({ session: 'displayName' });
          var privateGamePassword = ko.observable().extend({ session: 'private_game_password' });

          engine.call('join_game',
            String(data.ServerHostname),
            Number(data.ServerPort),
            String(displayName()),
            String(data.Ticket),
            String(JSON.stringify({ password: privateGamePassword() })))
          api.game.debug.reloadScene(api.Panel.pageId);

          //window.location.href = 'coui://ui/main/game/connect_to_game/connect_to_game.html';
      }).fail(function (data) {
          console.log('join game:fail');
          model.navToMainMenu()
      })
    }, 1000)
  }
})()
