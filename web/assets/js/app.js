(function () {
  var commandList = [];
  var softwareList = [];
  var commandContent = utils.$("#command-content");
  var softwareContent = utils.$("#software-content");

  function initTabs() {
    var commandTab = utils.$("#command-tab");
    var softwareTab = utils.$("#software-tab");
    var commandContent = utils.$("#command-content");
    var softwareContent = utils.$("#software-content");

    softwareTab.addEventListener("pointerdown", function () {
      softwareTab.classList.add("bg-white", "text-gray-900");
      commandTab.classList.remove("bg-white", "text-gray-900");
      commandContent.classList.add("hidden");
      softwareContent.classList.remove("hidden");

      renderSoftwareList();
    });

    commandTab.addEventListener("pointerdown", function () {
      commandTab.classList.add("bg-white", "text-gray-900");
      softwareTab.classList.remove("bg-white", "text-gray-900");
      commandContent.classList.remove("hidden");
      softwareContent.classList.add("hidden");

      renderCommandList();
    });
  }

  function initRequest() {
    var token = utils.getToken();

    if (!token) {
      return;
    }

    var request = utils.request("GET", "/api/list?token=" + token);

    request[0]
      .then(function (data) {
        softwareList = data.filter(function (item) {
          return item.category === "app";
        });

        commandList = data.filter(function (item) {
          return item.category === "command";
        });

        renderSoftwareList();
      })
      .catch(function (err) {
        alert(err.message);
      });
  }

  function renderSoftwareList() {
    var softwareTemplate = document
      .getElementById("softwareTemplate")
      .textContent.trim();

    var html = softwareList
      .map(function (item) {
        var template = softwareTemplate.replace("{icon}", item.icon);
        template = template.replace(/\{name\}/g, item.name);
        template = template.replace("{website}", item.website);

        return template;
      })
      .join("");

    softwareContent.innerHTML = html;
    softwareContent.classList.remove("hidden");
  }

  function renderCommandList() {
    var commandTemplate = document
      .getElementById("commandTemplate")
      .textContent.trim();

    var html = commandList
      .map(function (item) {
        var template = commandTemplate.replace("{icon}", item.icon);
        template = template.replace(/\{name\}/g, item.name);
        template = template.replace("{desc}", item.desc);

        return template;
      })
      .join("");

    commandContent.innerHTML = html;
  }

  function initEvent() {
    softwareContent.addEventListener("pointerdown", function (e) {
      var target = e.target;

      if (target.tagName === "BUTTON") {
        var name = target.dataset.name;
        var item = softwareList.find(function (item) {
          return item.name === name;
        });

        if (item) {
          window.open(item.website, "_blank");
        }
      }
    });

    commandContent.addEventListener("pointerdown", function (e) {
      var target = e.target;

      if (target.tagName === "BUTTON") {
        var name = target.dataset.name;
        var item = commandList.find(function (item) {
          return item.name === name;
        });

        if (item) {
          navigator.clipboard.writeText(item.command);

          target.classList.add("hidden");
          target.nextElementSibling.classList.remove("hidden");

          setTimeout(function () {
            target.classList.remove("hidden");
            target.nextElementSibling.classList.add("hidden");
          }, 1000);
        }
      }
    });
  }

  initTabs();
  initEvent();
  initRequest();
})();
