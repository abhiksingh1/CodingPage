//const axios = require("axios");
let editor, inputeditor, outputeditor, languagecode;

window.onload = function () {
  editor = ace.edit("editor", {
    mode: "ace/mode/c_cpp",
    selectionStyle: "text",
    theme: "ace/theme/monokai",
  });
  inputeditor = ace.edit("input-area", {
    mode: "ace/mode/c_cpp",
    selectionStyle: "text",
    theme: "ace/theme/monokai",
  });
  outputeditor = ace.edit("output-area", {
    mode: "ace/mode/c_cpp",
    selectionStyle: "text",
    theme: "ace/theme/monokai",
  });
  outputeditor.setReadOnly(true);
  languagecode = 76;
  // editor.resize();
};

function changeTheme() {
  let theme = document.getElementById("themes").value;
  let themes = "ace/theme/" + theme;
  editor.setTheme(themes);
  inputeditor.setTheme(themes);
  outputeditor.setTheme(themes);
}

function changeLanguage() {
  let language = document.getElementById("languages").value;
  let languages = parseInt(language);
  languagecode = languages;
  let lang;
  switch (languages) {
    case 76:
      lang = "c_cpp";
      break;
    case 75:
      lang = "c_cpp";
      break;
    case 62:
      lang = "java";
      break;
    case 70:
      lang = "python";
      break;
    case 71:
      lang = "python";
      break;
    case 63:
      lang = "javascript";
      break;
    case 74:
      lang = "typescript";
      break;
    case 82:
      lang = "sql";
      break;
    case 78:
      lang = "kotlin";
      break;
    case 51:
      lang = "csharp";
      break;
    case 87:
      lang = "fsharp";
      break;
    case 68:
      lang = "php";
      break;
    case 79:
      lang = "objectivec";
      break;
    case 60:
      lang = "golang";
      break;
    case 88:
      lang = "groovy";
      break;
    case 85:
      lang = "perl";
      break;
    case 80:
      lang = "r";
      break;
    case 72:
      lang = "ruby";
      break;
    case 73:
      lang = "rust";
      break;
    case 81:
      lang = "scala";
      break;
    case 83:
      lang = "swift";
      break;
    case 47:
      lang = "visualforce";
      break;
    case 84:
      lang = "visualforce";
      break;
    default:
      lang = "plain_text";
  }
  editor.session.setMode("ace/mode/" + lang);
  inputeditor.session.setMode("ace/mode/" + lang);
  outputeditor.session.setMode("ace/mode/" + lang);
  console.log("ace/mode/" + lang);
}

function executeCode() {
  const formData = {
    language_id: languagecode,
    source_code: btoa(editor.getValue()),
    stdin: btoa(inputeditor.getValue()),
  };
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": "4cc358100cmsh65e445e4179f26bp1cd68bjsnda6e8f14f656",
    },
    data: formData,
  };

  axios
    .request(options)
    .then(function (response) {
      // console.log("res.data", response.data);
      const token = response.data.token;
      checkStatus(token);
    })
    .catch((err) => {
      let error = err.response ? err.response.data : err;
      // get error status
      let status = err.response.status;
      // console.log("status", status);
      if (status === 429) {
        console.log("too many requests", status);
        console.log(
          `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
          10000
        );
      }
      console.log("catch block...", error);
    });
}

const checkStatus = async (token) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/" + token,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": "4cc358100cmsh65e445e4179f26bp1cd68bjsnda6e8f14f656",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      let value =
        atob(response.data.stdout) !== null ? atob(response.data.stdout) : null;
      // console.log(response.data.stdout);
      document.getElementById("status-value").innerHTML =
        response.data.status.description;
      document.getElementById("memory-value").innerHTML = response.data.memory;
      document.getElementById("time-value").innerHTML = response.data.time;
      outputeditor.setValue(value, -1);
    })
    .catch(function (error) {
      console.error(error);
    });
};

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "1200px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
/*global window, Sketchpad, WebSocket, Colorpalette, saveFile, loadFile*/

/*global window, Sketchpad, WebSocket, Colorpalette, saveFile, loadFile*/

function initSketchpad() {
  "use strict";
  var sketchpadEl = document.getElementById("sketchpad");
  var sketchpad = new Sketchpad({
    containerEl: sketchpadEl,
    features: {
      displayCrosshair: true,
      displayGrid: true,
    },
    createPageConfig: {
      no: 1,
      backgroundColor: "rgba(250,250,250,1)",
    },
  });

  window.sketchpad = sketchpad;

  var colorpalette = new Colorpalette({
    containerEl: document.getElementById("colorpalette"),
  }).on("change", function (e) {
    sketchpad
      .getCurrentTool()
      .setColor(e.color.red, e.color.green, e.color.blue, e.color.alpha);
  });
  window.colorpalette = colorpalette;

  var colorpaletteFill = new Colorpalette({
    containerEl: document.getElementById("colorpaletteFill"),
  }).on("change", function (e) {
    sketchpad
      .getCurrentTool()
      .setFillColor(e.color.red, e.color.green, e.color.blue, e.color.alpha);
  });
  window.colorpaletteFill = colorpaletteFill;

  /**
   * Changes current tool
   * @param  {string} toolId  - tool id
   */
  function selectTool(toolId) {
    console.log("selectTool", toolId);
    sketchpad.setTool(toolId);

    document.querySelectorAll(".toolbar .button").forEach(function (el) {
      el.classList.remove("active");
    });
    document.getElementById("tool-" + toolId).classList.add("active");

    document.getElementById("size").style.display = "none";
    document.getElementById("colorpaletteSection").style.display = "none";
    document.getElementById("colorpaletteFillSection").style.display = "none";

    var tool = sketchpad.getCurrentTool();

    document.getElementById("toolName").innerHTML =
      tool.toolLabel || "Undefined";
    /**
     * set toolbar for tool
     */

    if (typeof tool.getColor === "function") {
      colorpalette.setColor(tool.getColor(), "noPropagate");
    }

    if (typeof tool.getFillColor === "function") {
      colorpaletteFill.setColor(tool.getFillColor(), "noPropagate");
    }

    if (typeof tool.getSize === "function") {
      var size = tool.getSize();
      document.getElementById("size-slider").value = size;
    }

    switch (toolId) {
      case "pen":
        document.getElementById("colorpaletteSection").style.display = "block";
        document.getElementById("size").style.display = "block";
        break;
      case "highlighter":
        document.getElementById("colorpaletteSection").style.display = "block";
        document.getElementById("size").style.display = "block";
        break;
      case "eraser":
        break;
      case "rectangle":
        document.getElementById("colorpaletteSection").style.display = "block";
        document.getElementById("colorpaletteFillSection").style.display =
          "block";
        document.getElementById("size").style.display = "block";
        break;
      case "circle":
        document.getElementById("colorpaletteSection").style.display = "block";
        document.getElementById("colorpaletteFillSection").style.display =
          "block";
        document.getElementById("size").style.display = "block";
        break;
      case "line":
        document.getElementById("colorpaletteSection").style.display = "block";
        document.getElementById("size").style.display = "block";
        break;
    }
  }

  selectTool("pen");

  document
    .getElementById("size-slider")
    .addEventListener("change", function (e) {
      if (typeof sketchpad.getCurrentTool().setSize === "function") {
        sketchpad.getCurrentTool().setSize(e.target.value);
      }
    });

  //save
  document.getElementById("tool-save").addEventListener("click", function () {
    var data = sketchpad.saveSketchpad(true);
    saveFile(
      JSON.stringify(data),
      sketchpad.room.room_token + ".json",
      "text/json"
    );
  });

  /**
   * Load sketch from json
   */
  function jsonToDraw(sketchpad, inputList) {
    var i, input;

    sketchpad.reset();
    sketchpad.receiveMessageFromServer({
      data: JSON.stringify({ cmd: "history-begin" }),
    });
    sketchpad.sendMessageToServer({ cmd: "history-begin" });

    for (i = 0; i < inputList.length; i += 1) {
      input = inputList[i];
      input.bid = 0;
      input.uid = sketchpad.UID;
      if (input.config && input.config.sid) {
        console.log(
          "PAGE: Input.cmd",
          input.cmd,
          input.config,
          input.config.sid
        );
      } else {
        console.log("Input: Input.cmd", input.cmd, input.sid);
      }

      sketchpad.sendMessageToServer(inputList[i]);
      sketchpad.receiveMessageFromServer({
        data: JSON.stringify(inputList[i]),
      });
    }
    sketchpad.receiveMessageFromServer({
      data: JSON.stringify({ cmd: "history-end" }),
    });
    sketchpad.sendMessageToServer({ cmd: "history-end" });
    //select current page?
    return inputList;
  }

  //load
  document.getElementById("tool-load").addEventListener("click", function () {
    loadFile(".json,application/json", function (data) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error("Error parsing file", e);
        return;
      }
      if (Array.isArray(data)) {
        return jsonToDraw(sketchpad, data);
      } else {
        console.error("Wrong file content");
        return;
      }
    });
  });

  //screenshot
  document
    .getElementById("tool-screenshot")
    .addEventListener("click", function () {
      sketchpad.screenshot(
        function (blob) {
          saveFile(blob, sketchpad.room.room_token + ".png", "image/png");
        },
        "image/png",
        1
      );
    });

  //pen
  document.getElementById("tool-pen").addEventListener("click", function () {
    selectTool("pen");
  });

  // marker
  document
    .getElementById("tool-highlighter")
    .addEventListener("click", function () {
      selectTool("highlighter");
    });

  // mandala
  document
    .getElementById("tool-mandala")
    .addEventListener("click", function () {
      selectTool("mandala");
    });

  // mandala
  document.getElementById("tool-type").addEventListener("click", function () {
    selectTool("type");
  });

  //eraser
  document.getElementById("tool-eraser").addEventListener("click", function () {
    selectTool("eraser");
  });

  //cutout
  document.getElementById("tool-cutout").addEventListener("click", function () {
    selectTool("cutout");
  });

  document
    .getElementById("tool-rectangle")
    .addEventListener("click", function () {
      selectTool("rectangle");
    });

  document.getElementById("tool-line").addEventListener("click", function () {
    selectTool("line");
  });

  document.getElementById("tool-circle").addEventListener("click", function () {
    selectTool("circle");
  });

  document
    .getElementById("tool-rainbow")
    .addEventListener("click", function () {
      selectTool("rainbow");
    });

  document
    .getElementById("tool-move-viewport")
    .addEventListener("click", function () {
      selectTool("move-viewport");
    });

  document
    .getElementById("tool-rotate-viewport")
    .addEventListener("click", function () {
      selectTool("rotate-viewport");
    });

  document
    .getElementById("tool-zoom-in")
    .addEventListener("click", function () {
      sketchpad.setScale(sketchpad.scale * 2);
    });
  document.getElementById("tool-zoom-1").addEventListener("click", function () {
    sketchpad.setScale(1);
    sketchpad.setViewportPosition(0, 0);
    sketchpad.setRotation(0);
  });

  document
    .getElementById("tool-zoom-out")
    .addEventListener("click", function () {
      sketchpad.setScale(sketchpad.scale / 2);
    });

  document.getElementById("reset").addEventListener("click", function () {
    sketchpad.reset();
  });

  document.getElementById("tool-undo").addEventListener("click", function () {
    sketchpad.undo();
  });
  document.getElementById("tool-redo").addEventListener("click", function () {
    sketchpad.redo();
  });
}
initSketchpad();
