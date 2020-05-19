class Net {
  constructor() {
    this.waiting;
    this.state;
    this.myLogin;
    this.comparing;
  }

  login() {
    let login = $("#loginname").val();
    $.ajax({
      url: "/",
      data: { action: "add", name: login },
      type: "POST",
      success: (data) => {
        switch (data) {
          case "firstplayer":
            ui.firstPlayerUi(data, login);
            game.changeCameraAngle("front");
            game.placePawns();
            this.waiting = setInterval(() => {
              this.check();
            }, 500);
            this.comparing = setInterval(() => this.compareTabs(), 1000);
            this.state = data;
            this.myLogin = login;
            break;

          case "secondplayer":
            ui.secondPlayerUi(data, login);
            game.changeCameraAngle("back");
            game.placePawns();
            this.comparing = setInterval(() => this.compareTabs(), 1000);
            this.state = data;
            this.myLogin = login;
            break;

          case "existing":
            ui.showInfo(data);
            break;

          case "toomany":
            ui.showInfo(data);
            break;
        }
      },
      error: function (xhr, status, error) {
        console.log("error");
      },
    });
  }

  reset() {
    $.ajax({
      url: "/",
      data: { action: "reset" },
      type: "POST",
      success: (data) => {
        if (data == "ok") {
          location.reload();
        }
      },
      error: function (xhr, status, error) {
        console.log("error");
      },
    });
  }

  check() {
    $.ajax({
      url: "/",
      data: { action: "check" },
      type: "POST",
      success: (data) => {
        if (data != "") {
          this.stop();
            ui.secondPlayerJoined(data);
        }
      },
      error: function (xhr, status, error) {
        console.log("error");
      },
    });
  }

  getState() {
    return this.state;
  }

  stop() {
    clearInterval(this.waiting);
  }

  updateTabs(pawns) {
    clearInterval(this.comparing);
    $.ajax({
      url: "/",
      data: { action: "update", data: JSON.stringify(pawns) },
      type: "POST",
      success: (data) => {
        if (data == "ok") {
          let i = 30;
          ui.showBlockScreen();
          this.comparing = setInterval(() => {
            this.compareTabs(1);
            ui.updateCounter(i);
            if (i == 0) {
              ui.hideBlockScreen();
              clearInterval(this.comparing);
            }
            i--;
          }, 1000);
        }
      },
      error: function (xhr, status, error) {
        console.log("error");
        this.updateTabs(game.getPawns());
      },
    });
  }

  compareTabs(mode) {
    $.ajax({
      url: "/",
      data: { action: "compare", data: JSON.stringify(game.getPawns()) },
      type: "POST",
      success: (data) => {
        let obj = JSON.parse(data);
        if (obj.changes == "true") {
          if (mode == 1) {
            ui.hideBlockScreen();
          }
          game.setPawns(obj.pawnsTab);
          game.refresh();
        }
      },
      error: function (xhr, status, error) {
        console.log("error");
      },
    });
  }
}
