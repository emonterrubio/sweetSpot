require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"firebase":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Firebase = (function(superClass) {
  var getCORSurl, request;

  extend(Firebase, superClass);

  getCORSurl = function(server, path, secret, project) {
    var url;
    switch (Utils.isWebKit()) {
      case true:
        url = "https://" + server + path + ".json?auth=" + secret + "&ns=" + project + "&sse=true";
        break;
      default:
        url = "https://" + project + ".firebaseio.com" + path + ".json?auth=" + secret;
    }
    return url;
  };

  Firebase.define("status", {
    get: function() {
      return this._status;
    }
  });

  function Firebase(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.projectID = (base = this.options).projectID != null ? base.projectID : base.projectID = null;
    this.secret = (base1 = this.options).secret != null ? base1.secret : base1.secret = null;
    this.server = (base2 = this.options).server != null ? base2.server : base2.server = void 0;
    this.debug = (base3 = this.options).debug != null ? base3.debug : base3.debug = false;
    if (this._status == null) {
      this._status = "disconnected";
    }
    Firebase.__super__.constructor.apply(this, arguments);
    if (this.server === void 0) {
      Utils.domLoadJSON("https://" + this.projectID + ".firebaseio.com/.settings/owner.json", function(a, server) {
        var msg;
        print(msg = "Add ______ server:" + '   "' + server + '"' + " _____ to your instance of Firebase.");
        if (this.debug) {
          return console.log("Firebase: " + msg);
        }
      });
    }
    if (this.debug) {
      console.log("Firebase: Connecting to Firebase Project '" + this.projectID + "' ... \n URL: '" + (getCORSurl(this.server, "/", this.secret, this.projectID)) + "'");
    }
    this.onChange("connection");
  }

  request = function(project, secret, path, callback, method, data, parameters, debug) {
    var url, xhttp;
    url = "https://" + project + ".firebaseio.com" + path + ".json?auth=" + secret;
    if (parameters !== void 0) {
      if (parameters.shallow) {
        url += "&shallow=true";
      }
      if (parameters.format === "export") {
        url += "&format=export";
      }
      switch (parameters.print) {
        case "pretty":
          url += "&print=pretty";
          break;
        case "silent":
          url += "&print=silent";
      }
      if (typeof parameters.download === "string") {
        url += "&download=" + parameters.download;
        window.open(url, "_self");
      }
      if (typeof parameters.orderBy === "string") {
        url += "&orderBy=" + '"' + parameters.orderBy + '"';
      }
      if (typeof parameters.limitToFirst === "number") {
        url += "&limitToFirst=" + parameters.limitToFirst;
      }
      if (typeof parameters.limitToLast === "number") {
        url += "&limitToLast=" + parameters.limitToLast;
      }
      if (typeof parameters.startAt === "number") {
        url += "&startAt=" + parameters.startAt;
      }
      if (typeof parameters.endAt === "number") {
        url += "&endAt=" + parameters.endAt;
      }
      if (typeof parameters.equalTo === "number") {
        url += "&equalTo=" + parameters.equalTo;
      }
    }
    xhttp = new XMLHttpRequest;
    if (debug) {
      console.log("Firebase: New '" + method + "'-request with data: '" + (JSON.stringify(data)) + "' \n URL: '" + url + "'");
    }
    xhttp.onreadystatechange = (function(_this) {
      return function() {
        if (parameters !== void 0) {
          if (parameters.print === "silent" || typeof parameters.download === "string") {
            return;
          }
        }
        switch (xhttp.readyState) {
          case 0:
            if (debug) {
              console.log("Firebase: Request not initialized \n URL: '" + url + "'");
            }
            break;
          case 1:
            if (debug) {
              console.log("Firebase: Server connection established \n URL: '" + url + "'");
            }
            break;
          case 2:
            if (debug) {
              console.log("Firebase: Request received \n URL: '" + url + "'");
            }
            break;
          case 3:
            if (debug) {
              console.log("Firebase: Processing request \n URL: '" + url + "'");
            }
            break;
          case 4:
            if (callback != null) {
              callback(JSON.parse(xhttp.responseText));
            }
            if (debug) {
              console.log("Firebase: Request finished, response: '" + (JSON.parse(xhttp.responseText)) + "' \n URL: '" + url + "'");
            }
        }
        if (xhttp.status === "404") {
          if (debug) {
            return console.warn("Firebase: Invalid request, page not found \n URL: '" + url + "'");
          }
        }
      };
    })(this);
    xhttp.open(method, url, true);
    xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    return xhttp.send(data = "" + (JSON.stringify(data)));
  };

  Firebase.prototype.get = function(path, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "GET", null, parameters, this.debug);
  };

  Firebase.prototype.put = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "PUT", data, parameters, this.debug);
  };

  Firebase.prototype.post = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "POST", data, parameters, this.debug);
  };

  Firebase.prototype.patch = function(path, data, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "PATCH", data, parameters, this.debug);
  };

  Firebase.prototype["delete"] = function(path, callback, parameters) {
    return request(this.projectID, this.secret, path, callback, "DELETE", null, parameters, this.debug);
  };

  Firebase.prototype.onChange = function(path, callback) {
    var currentStatus, source, url;
    if (path === "connection") {
      url = getCORSurl(this.server, "/", this.secret, this.projectID);
      currentStatus = "disconnected";
      source = new EventSource(url);
      source.addEventListener("open", (function(_this) {
        return function() {
          if (currentStatus === "disconnected") {
            _this._status = "connected";
            if (callback != null) {
              callback("connected");
            }
            if (_this.debug) {
              console.log("Firebase: Connection to Firebase Project '" + _this.projectID + "' established");
            }
          }
          return currentStatus = "connected";
        };
      })(this));
      return source.addEventListener("error", (function(_this) {
        return function() {
          if (currentStatus === "connected") {
            _this._status = "disconnected";
            if (callback != null) {
              callback("disconnected");
            }
            if (_this.debug) {
              console.warn("Firebase: Connection to Firebase Project '" + _this.projectID + "' closed");
            }
          }
          return currentStatus = "disconnected";
        };
      })(this));
    } else {
      url = getCORSurl(this.server, path, this.secret, this.projectID);
      source = new EventSource(url);
      if (this.debug) {
        console.log("Firebase: Listening to changes made to '" + path + "' \n URL: '" + url + "'");
      }
      source.addEventListener("put", (function(_this) {
        return function(ev) {
          if (callback != null) {
            callback(JSON.parse(ev.data).data, "put", JSON.parse(ev.data).path, _.rest(JSON.parse(ev.data).path.split("/"), 1));
          }
          if (_this.debug) {
            return console.log("Firebase: Received changes made to '" + path + "' via 'PUT': " + (JSON.parse(ev.data).data) + " \n URL: '" + url + "'");
          }
        };
      })(this));
      return source.addEventListener("patch", (function(_this) {
        return function(ev) {
          if (callback != null) {
            callback(JSON.parse(ev.data).data, "patch", JSON.parse(ev.data).path, _.rest(JSON.parse(ev.data).path.split("/"), 1));
          }
          if (_this.debug) {
            return console.log("Firebase: Received changes made to '" + path + "' via 'PATCH': " + (JSON.parse(ev.data).data) + " \n URL: '" + url + "'");
          }
        };
      })(this));
    }
  };

  return Firebase;

})(Framer.BaseClass);


},{}],"input-framer/input":[function(require,module,exports){
var _inputStyle, calculatePixelRatio, growthRatio, imageHeight,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.keyboardLayer = new Layer({
  x: 0,
  y: Screen.height,
  width: Screen.width,
  height: 432,
  html: "<img style='width: 100%;' src='modules/keyboard.png'/>"
});

growthRatio = Screen.width / 732;

imageHeight = growthRatio * 432;

_inputStyle = Object.assign({}, Framer.LayerStyle, calculatePixelRatio = function(layer, value) {
  return (value * layer.context.pixelMultiplier) + "px";
}, {
  fontSize: function(layer) {
    return calculatePixelRatio(layer, layer._properties.fontSize);
  },
  lineHeight: function(layer) {
    return layer._properties.lineHeight + "em";
  },
  padding: function(layer) {
    var padding, paddingValue, paddingValues, pixelMultiplier;
    pixelMultiplier = layer.context.pixelMultiplier;
    padding = [];
    paddingValue = layer._properties.padding;
    if (Number.isInteger(paddingValue)) {
      return calculatePixelRatio(layer, paddingValue);
    }
    paddingValues = layer._properties.padding.split(" ");
    switch (paddingValues.length) {
      case 4:
        padding.top = parseFloat(paddingValues[0]);
        padding.right = parseFloat(paddingValues[1]);
        padding.bottom = parseFloat(paddingValues[2]);
        padding.left = parseFloat(paddingValues[3]);
        break;
      case 3:
        padding.top = parseFloat(paddingValues[0]);
        padding.right = parseFloat(paddingValues[1]);
        padding.bottom = parseFloat(paddingValues[2]);
        padding.left = parseFloat(paddingValues[1]);
        break;
      case 2:
        padding.top = parseFloat(paddingValues[0]);
        padding.right = parseFloat(paddingValues[1]);
        padding.bottom = parseFloat(paddingValues[0]);
        padding.left = parseFloat(paddingValues[1]);
        break;
      default:
        padding.top = parseFloat(paddingValues[0]);
        padding.right = parseFloat(paddingValues[0]);
        padding.bottom = parseFloat(paddingValues[0]);
        padding.left = parseFloat(paddingValues[0]);
    }
    return (padding.top * pixelMultiplier) + "px " + (padding.right * pixelMultiplier) + "px " + (padding.bottom * pixelMultiplier) + "px " + (padding.left * pixelMultiplier) + "px";
  }
});

exports.keyboardLayer.states = {
  shown: {
    y: Screen.height - imageHeight
  }
};

exports.keyboardLayer.states.animationOptions = {
  curve: "spring(500,50,15)"
};

exports.Input = (function(superClass) {
  extend(Input, superClass);

  Input.define("style", {
    get: function() {
      return this.input.style;
    },
    set: function(value) {
      return _.extend(this.input.style, value);
    }
  });

  Input.define("value", {
    get: function() {
      return this.input.value;
    },
    set: function(value) {
      return this.input.value = value;
    }
  });

  function Input(options) {
    if (options == null) {
      options = {};
    }
    this.enable = bind(this.enable, this);
    if (options.setup == null) {
      options.setup = false;
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.clip == null) {
      options.clip = false;
    }
    if (options.height == null) {
      options.height = 60;
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = options.setup ? "rgba(255, 60, 47, .5)" : "rgba(255, 255, 255, .01)";
    }
    if (options.fontSize == null) {
      options.fontSize = 30;
    }
    if (options.lineHeight == null) {
      options.lineHeight = 1;
    }
    if (options.padding == null) {
      options.padding = 10;
    }
    if (options.text == null) {
      options.text = "";
    }
    if (options.placeholder == null) {
      options.placeholder = "";
    }
    if (options.virtualKeyboard == null) {
      options.virtualKeyboard = Utils.isMobile() ? false : true;
    }
    if (options.type == null) {
      options.type = "text";
    }
    if (options.goButton == null) {
      options.goButton = false;
    }
    if (options.autoCorrect == null) {
      options.autoCorrect = "on";
    }
    if (options.autoComplete == null) {
      options.autoComplete = "on";
    }
    if (options.autoCapitalize == null) {
      options.autoCapitalize = "on";
    }
    if (options.spellCheck == null) {
      options.spellCheck = "on";
    }
    if (options.autofocus == null) {
      options.autofocus = false;
    }
    if (options.textColor == null) {
      options.textColor = "#000";
    }
    if (options.fontFamily == null) {
      options.fontFamily = "-apple-system";
    }
    if (options.fontWeight == null) {
      options.fontWeight = "500";
    }
    if (options.submit == null) {
      options.submit = false;
    }
    if (options.tabIndex == null) {
      options.tabIndex = 0;
    }
    if (options.textarea == null) {
      options.textarea = false;
    }
    if (options.disabled == null) {
      options.disabled = false;
    }
    Input.__super__.constructor.call(this, options);
    this._properties.fontSize = options.fontSize;
    this._properties.lineHeight = options.lineHeight;
    this._properties.padding = options.padding;
    if (options.placeholderColor != null) {
      this.placeholderColor = options.placeholderColor;
    }
    this.input = document.createElement(options.textarea ? 'textarea' : 'input');
    this.input.id = "input-" + (_.now());
    this.input.style.width = _inputStyle["width"](this);
    this.input.style.height = _inputStyle["height"](this);
    this.input.style.fontSize = _inputStyle["fontSize"](this);
    this.input.style.lineHeight = _inputStyle["lineHeight"](this);
    this.input.style.outline = "none";
    this.input.style.border = "none";
    this.input.style.backgroundColor = options.backgroundColor;
    this.input.style.padding = _inputStyle["padding"](this);
    this.input.style.fontFamily = options.fontFamily;
    this.input.style.color = options.textColor;
    this.input.style.fontWeight = options.fontWeight;
    this.input.value = options.text;
    this.input.type = options.type;
    this.input.placeholder = options.placeholder;
    this.input.setAttribute("tabindex", options.tabindex);
    this.input.setAttribute("autocorrect", options.autoCorrect);
    this.input.setAttribute("autocomplete", options.autoComplete);
    this.input.setAttribute("autocapitalize", options.autoCapitalize);
    if (options.disabled === true) {
      this.input.setAttribute("disabled", true);
    }
    if (options.autofocus === true) {
      this.input.setAttribute("autofocus", true);
    }
    this.input.setAttribute("spellcheck", options.spellCheck);
    this.form = document.createElement("form");
    if ((options.goButton && !options.submit) || !options.submit) {
      this.form.action = "#";
      this.form.addEventListener("submit", function(event) {
        return event.preventDefault();
      });
    }
    this.form.appendChild(this.input);
    this._element.appendChild(this.form);
    this.backgroundColor = "transparent";
    if (this.placeholderColor) {
      this.updatePlaceholderColor(options.placeholderColor);
    }
    if (!Utils.isMobile() && options.virtualKeyboard === true) {
      this.input.addEventListener("focus", function() {
        exports.keyboardLayer.bringToFront();
        return exports.keyboardLayer.stateCycle();
      });
      this.input.addEventListener("blur", function() {
        return exports.keyboardLayer.animate("default");
      });
    }
  }

  Input.prototype.updatePlaceholderColor = function(color) {
    var css;
    this.placeholderColor = color;
    if (this.pageStyle != null) {
      document.head.removeChild(this.pageStyle);
    }
    this.pageStyle = document.createElement("style");
    this.pageStyle.type = "text/css";
    css = "#" + this.input.id + "::-webkit-input-placeholder { color: " + this.placeholderColor + "; }";
    this.pageStyle.appendChild(document.createTextNode(css));
    return document.head.appendChild(this.pageStyle);
  };

  Input.prototype.focus = function() {
    return this.input.focus();
  };

  Input.prototype.unfocus = function() {
    return this.input.blur();
  };

  Input.prototype.onFocus = function(cb) {
    return this.input.addEventListener("focus", function() {
      return cb.apply(this);
    });
  };

  Input.prototype.onBlur = function(cb) {
    return this.input.addEventListener("blur", function() {
      return cb.apply(this);
    });
  };

  Input.prototype.onUnfocus = Input.onBlur;

  Input.prototype.disable = function() {
    return this.input.setAttribute("disabled", true);
  };

  Input.prototype.enable = function() {
    return this.input.removeAttribute("disabled", true);
  };

  return Input;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}],"picker":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.Drum = (function(superClass) {
  extend(Drum, superClass);

  function Drum(options) {
    var ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    this.__constructor = true;
    this._options = (ref = options.options) != null ? ref : ["Blaine", "Billingsley", "is", "cool"];
    this._drumHeight = 32 * 6;
    this._startIndex = (ref1 = options.startIndex) != null ? ref1 : 0;
    this._textAlign = (ref2 = options.textAlign) != null ? ref2 : "center";
    this._value = null;
    Drum.__super__.constructor.call(this, _.defaults(options, {
      width: Screen.width,
      height: this._drumHeight,
      y: Align.bottom,
      scrollHorizontal: false,
      backgroundColor: "white",
      velocityThreshold: .01,
      originY: 0,
      contentInset: {
        top: this._drumHeight / 2 - 24,
        bottom: this._drumHeight
      },
      clip: true
    }));
    this.__constructor = false;
    this.scrimTop = new Layer({
      width: this.width,
      height: (this.height - 36) / 2,
      parent: this,
      name: ".",
      gradient: {
        start: "rgba(255,255,255,.6)",
        end: "rgba(255,255,255,1)"
      },
      style: {
        "border-bottom": "1px solid #dbdbdb"
      }
    });
    this.scrimBottom = new Layer({
      width: this.width,
      height: (this.height - 36) / 2,
      parent: this,
      name: ".",
      y: Align.bottom,
      gradient: {
        end: "rgba(255,255,255,.6)",
        start: "rgba(255,255,255,1)"
      },
      style: {
        "border-top": "1px solid #dbdbdb"
      }
    });
    this.setOptions(this._options);
    if (this._startIndex > 0) {
      this.snapToPage(this.content.children[this._startIndex], false);
    }
    this._value = this.currentPage.text;
    this.content.name = ".";
    this.on("change:currentPage", function() {
      return this._value = this.currentPage.text;
    });
  }

  Drum.prototype.setOptions = function(optionArray) {
    var i, item, len, o, opt, results;
    results = [];
    for (o = i = 0, len = optionArray.length; i < len; o = ++i) {
      opt = optionArray[o];
      item = new TextLayer(_.defaults(this._drumProps, {
        fontSize: 20,
        height: 36,
        textAlign: this._textAlign,
        width: this.width,
        text: opt,
        color: "#484848",
        name: '.',
        parent: this.content,
        y: 36 * o,
        padding: {
          horizontal: 16
        }
      }));
      results.push(this.updateContent());
    }
    return results;
  };

  Drum.prototype.resetOptions = function(optionArray) {
    var child, i, len, ref;
    ref = this.content.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      child.destroy();
    }
    return this.setOptions(optionArray);
  };

  Drum.define("options", {
    get: function() {
      return this._options;
    },
    set: function(value) {
      if (this.__constructor) {
        return;
      }
      this._options = value;
      return this.resetOptions(this._options);
    }
  });

  Drum.define("value", {
    get: function() {
      return this._value;
    },
    set: function(value) {
      if (this.__constructor) {
        return;
      }
      return this._value = value;
    }
  });

  return Drum;

})(PageComponent);

exports.Picker = (function(superClass) {
  extend(Picker, superClass);

  function Picker(options) {
    var d, dr, drum, i, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    if (options == null) {
      options = {};
    }
    this.__constructor = true;
    this._drums = (ref = options.drums) != null ? ref : null;
    this._drum = (ref1 = options.drum) != null ? ref1 : null;
    this._xVal = 0;
    Picker.__super__.constructor.call(this, _.defaults(options, {
      width: Screen.width,
      height: 216,
      y: Align.bottom,
      backgroundColor: "white",
      clip: true,
      style: {
        "border-top": "1px solid #ccc"
      }
    }));
    this.__constructor = false;
    this.states.hidden = {
      y: Screen.height
    };
    this.states.animationOptions = {
      time: .3,
      curve: Spring({
        damping: .8
      })
    };
    this.toolbar = new TextLayer({
      width: this.width,
      height: 44,
      parent: this,
      backgroundColor: "#FAFAF8",
      textAlign: "right",
      text: "Done",
      fontSize: 15,
      lineHeight: 3,
      fontWeight: "bold",
      padding: {
        right: 16
      },
      color: "#007AFF",
      style: {
        "border-bottom": "1px solid #dbdbdb"
      }
    });
    if (this._drums === null) {
      this._drums = [
        {
          options: this._drum
        }
      ];
    }
    ref2 = this._drums;
    for (d = i = 0, len = ref2.length; i < len; d = ++i) {
      drum = ref2[d];
      dr = this["drum" + d] = new exports.Drum({
        name: "drum" + d,
        height: this.height - 44,
        parent: this,
        startIndex: (ref3 = drum.startIndex) != null ? ref3 : 0,
        width: (ref4 = drum.width) != null ? ref4 : this.width,
        options: (ref5 = drum.options) != null ? ref5 : ["One", "Two", "Three", "Four"],
        textAlign: (ref6 = drum.textAlign) != null ? ref6 : "center",
        x: (ref7 = drum.x) != null ? ref7 : this._xVal
      });
      this._xVal = dr.maxX;
    }
  }

  return Picker;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2VkbW9udGVycnViaW8vR29vZ2xlIERyaXZlL1BST0pFQ1RTL2ZpcmViYXNlU3dlZXRTcG90LmZyYW1lci9tb2R1bGVzL3BpY2tlci5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9lZG1vbnRlcnJ1YmlvL0dvb2dsZSBEcml2ZS9QUk9KRUNUUy9maXJlYmFzZVN3ZWV0U3BvdC5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9lZG1vbnRlcnJ1YmlvL0dvb2dsZSBEcml2ZS9QUk9KRUNUUy9maXJlYmFzZVN3ZWV0U3BvdC5mcmFtZXIvbW9kdWxlcy9pbnB1dC1mcmFtZXIvaW5wdXQuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvZWRtb250ZXJydWJpby9Hb29nbGUgRHJpdmUvUFJPSkVDVFMvZmlyZWJhc2VTd2VldFNwb3QuZnJhbWVyL21vZHVsZXMvZmlyZWJhc2UuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIENMQVNTIC0gRHJ1bVxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuY2xhc3MgZXhwb3J0cy5EcnVtIGV4dGVuZHMgUGFnZUNvbXBvbmVudFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHRAX19jb25zdHJ1Y3RvciA9IHRydWVcblx0XHRAX29wdGlvbnMgPSBvcHRpb25zLm9wdGlvbnMgPyBbXCJCbGFpbmVcIiwgXCJCaWxsaW5nc2xleVwiLCBcImlzXCIsIFwiY29vbFwiXVxuIyBcdFx0QF9kcnVtUHJvcHMgPSBvcHRpb25zLmRydW1Qcm9wcyA/IG51bGxcblx0XHRAX2RydW1IZWlnaHQgPSAzMiAqIDZcblx0XHRAX3N0YXJ0SW5kZXggPSBvcHRpb25zLnN0YXJ0SW5kZXggPyAwXG5cdFx0QF90ZXh0QWxpZ24gPSBvcHRpb25zLnRleHRBbGlnbiA/IFwiY2VudGVyXCJcblx0XHRAX3ZhbHVlID0gbnVsbFxuXHRcdCMgRGVmYXVsdHNcblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsIFxuXHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aCwgaGVpZ2h0OiBAX2RydW1IZWlnaHRcblx0XHRcdHk6IEFsaWduLmJvdHRvbVxuXHRcdFx0c2Nyb2xsSG9yaXpvbnRhbDogZmFsc2Vcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiXG5cdFx0XHR2ZWxvY2l0eVRocmVzaG9sZDogLjAxXG5cdFx0XHRvcmlnaW5ZOiAwXG5cdFx0XHRjb250ZW50SW5zZXQ6XG5cdFx0XHRcdHRvcDogQF9kcnVtSGVpZ2h0IC8gMiAtIDI0XG5cdFx0XHRcdGJvdHRvbTogQF9kcnVtSGVpZ2h0XG5cdFx0XHRjbGlwOiB0cnVlXG5cdFx0XG5cdFx0IyBGbGlwIHRoZSBib29sZWFuIGFmdGVyIHRoZSBjb25zdHJ1Y3RvciBpcyBkb25lLlxuXHRcdEBfX2NvbnN0cnVjdG9yID0gZmFsc2Vcblx0XHRcblx0XHQjIENoaWxkIGxheWVyc1xuXHRcdEBzY3JpbVRvcCA9IG5ldyBMYXllclxuXHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0aGVpZ2h0OiAoQC5oZWlnaHQgLSAzNikgLyAyXG5cdFx0XHRwYXJlbnQ6IEBcblx0XHRcdG5hbWU6IFwiLlwiXG5cdFx0XHRncmFkaWVudDogXG5cdFx0XHRcdHN0YXJ0OiBcInJnYmEoMjU1LDI1NSwyNTUsLjYpXCJcblx0XHRcdFx0ZW5kOiBcInJnYmEoMjU1LDI1NSwyNTUsMSlcIlxuXHRcdFx0c3R5bGU6IFxuXHRcdFx0XHRcImJvcmRlci1ib3R0b21cIiA6IFwiMXB4IHNvbGlkICNkYmRiZGJcIlxuXHRcdEBzY3JpbUJvdHRvbSA9IG5ldyBMYXllclxuXHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0aGVpZ2h0OiAoQC5oZWlnaHQgLSAzNikgLyAyXG5cdFx0XHRwYXJlbnQ6IEBcblx0XHRcdG5hbWU6IFwiLlwiXG5cdFx0XHR5OiBBbGlnbi5ib3R0b21cblx0XHRcdGdyYWRpZW50OiBcblx0XHRcdFx0ZW5kOiBcInJnYmEoMjU1LDI1NSwyNTUsLjYpXCJcblx0XHRcdFx0c3RhcnQ6IFwicmdiYSgyNTUsMjU1LDI1NSwxKVwiXG5cdFx0XHRzdHlsZTogXG5cdFx0XHRcdFwiYm9yZGVyLXRvcFwiIDogXCIxcHggc29saWQgI2RiZGJkYlwiXG5cdFx0XHRcdFxuXG5cdFx0QHNldE9wdGlvbnMoQF9vcHRpb25zKVxuXHRcdGlmIEBfc3RhcnRJbmRleCA+IDAgdGhlbiBALnNuYXBUb1BhZ2UoQC5jb250ZW50LmNoaWxkcmVuW0Bfc3RhcnRJbmRleF0sIGZhbHNlKVxuXHRcdEBfdmFsdWUgPSBALmN1cnJlbnRQYWdlLnRleHRcblxuXHRcdEBjb250ZW50Lm5hbWUgPSBcIi5cIlxuXHRcdEAub24gXCJjaGFuZ2U6Y3VycmVudFBhZ2VcIiwgLT4gQF92YWx1ZSA9IEAuY3VycmVudFBhZ2UudGV4dFxuXHQjIEZ1bmN0aW9uc1xuXHRzZXRPcHRpb25zOiAob3B0aW9uQXJyYXkpIC0+XG5cdFx0Zm9yIG9wdCwgbyBpbiBvcHRpb25BcnJheVxuXHRcdFx0aXRlbSA9IG5ldyBUZXh0TGF5ZXIgXy5kZWZhdWx0cyBAX2RydW1Qcm9wcyxcblx0XHRcdFx0Zm9udFNpemU6IDIwXG5cdFx0XHRcdGhlaWdodDogMzZcblx0XHRcdFx0dGV4dEFsaWduOiBAX3RleHRBbGlnblxuXHRcdFx0XHR3aWR0aDogQHdpZHRoXG5cdFx0XHRcdHRleHQ6IG9wdFxuXHRcdFx0XHRjb2xvcjogXCIjNDg0ODQ4XCJcblx0XHRcdFx0bmFtZTogJy4nXG5cdFx0XHRcdHBhcmVudDogQC5jb250ZW50XG5cdFx0XHRcdHk6ICgzNikgKiBvXG5cdFx0XHRcdHBhZGRpbmc6IHsgaG9yaXpvbnRhbDogMTZ9XG5cdFx0XHRALnVwZGF0ZUNvbnRlbnQoKVxuXG5cdHJlc2V0T3B0aW9uczogKG9wdGlvbkFycmF5KSAtPlxuXHRcdGNoaWxkLmRlc3Ryb3koKSBmb3IgY2hpbGQgaW4gQC5jb250ZW50LmNoaWxkcmVuXG5cdFx0QHNldE9wdGlvbnMob3B0aW9uQXJyYXkpXG5cdFxuXHQjIEN1c3RvbSBkZWZpbml0aW9uc1xuXHRAZGVmaW5lIFwib3B0aW9uc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfb3B0aW9uc1xuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdHJldHVybiBpZiBAX19jb25zdHJ1Y3RvclxuXHRcdFx0QF9vcHRpb25zID0gdmFsdWVcblx0XHRcdEByZXNldE9wdGlvbnMoQF9vcHRpb25zKVxuXHRAZGVmaW5lIFwidmFsdWVcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3ZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRyZXR1cm4gaWYgQF9fY29uc3RydWN0b3Jcblx0XHRcdEBfdmFsdWUgPSB2YWx1ZVxuXG5cblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgQ0xBU1MgLSBQaWNrZXJcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmNsYXNzIGV4cG9ydHMuUGlja2VyIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cdFx0QF9fY29uc3RydWN0b3IgPSB0cnVlXG5cdFx0QF9kcnVtcyA9IG9wdGlvbnMuZHJ1bXMgPyBudWxsXG5cdFx0QF9kcnVtID0gb3B0aW9ucy5kcnVtID8gbnVsbFxuXHRcdEBfeFZhbCA9IDBcblx0XHQjIERlZmF1bHRzXG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLCBcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGgsIGhlaWdodDogMjE2XG5cdFx0XHR5OiBBbGlnbi5ib3R0b21cblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ3aGl0ZVwiXG5cdFx0XHRjbGlwOiB0cnVlXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0XCJib3JkZXItdG9wXCIgOiBcIjFweCBzb2xpZCAjY2NjXCJcblx0XHRcblx0XHQjIEZsaXAgdGhlIGJvb2xlYW4gYWZ0ZXIgdGhlIGNvbnN0cnVjdG9yIGlzIGRvbmUuXG5cdFx0QF9fY29uc3RydWN0b3IgPSBmYWxzZVxuXHRcdEAuc3RhdGVzLmhpZGRlbiA9XG5cdFx0XHR5OiBTY3JlZW4uaGVpZ2h0XG5cdFx0QC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9IHRpbWU6IC4zLCBjdXJ2ZTogU3ByaW5nKGRhbXBpbmc6LjgpXG5cdFx0IyBDaGlsZCBsYXllcnNcblx0XHRAdG9vbGJhciA9IG5ldyBUZXh0TGF5ZXJcblx0XHRcdHdpZHRoOiBAd2lkdGhcblx0XHRcdGhlaWdodDogNDRcblx0XHRcdHBhcmVudDogQFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIiNGQUZBRjhcIlxuXHRcdFx0dGV4dEFsaWduOiBcInJpZ2h0XCJcblx0XHRcdHRleHQ6IFwiRG9uZVwiXG5cdFx0XHRmb250U2l6ZTogMTVcblx0XHRcdGxpbmVIZWlnaHQ6IDNcblx0XHRcdGZvbnRXZWlnaHQ6IFwiYm9sZFwiXG5cdFx0XHRwYWRkaW5nOiB7cmlnaHQ6IDE2fVxuXHRcdFx0Y29sb3I6IFwiIzAwN0FGRlwiXG5cdFx0XHRzdHlsZTpcblx0XHRcdFx0XCJib3JkZXItYm90dG9tXCIgOiBcIjFweCBzb2xpZCAjZGJkYmRiXCJcblx0XHRpZiBAX2RydW1zIGlzIG51bGwgdGhlbiBAX2RydW1zID0gW3tvcHRpb25zOiBAX2RydW19XVxuXG5cdFx0Zm9yIGRydW0sIGQgaW4gQF9kcnVtc1xuXHRcdFx0ZHIgPSBAW1wiZHJ1bSN7ZH1cIl0gPSBuZXcgZXhwb3J0cy5EcnVtXG5cdFx0XHRcdG5hbWU6IFwiZHJ1bSN7ZH1cIlxuXHRcdFx0XHRoZWlnaHQ6IEBoZWlnaHQgLSA0NFxuXHRcdFx0XHRwYXJlbnQ6IEBcblx0XHRcdFx0c3RhcnRJbmRleDogZHJ1bS5zdGFydEluZGV4ID8gMFxuXHRcdFx0XHR3aWR0aDogZHJ1bS53aWR0aCA/IEB3aWR0aFxuXHRcdFx0XHRvcHRpb25zOiBkcnVtLm9wdGlvbnMgPyBbXCJPbmVcIixcIlR3b1wiLFwiVGhyZWVcIixcIkZvdXJcIl1cblx0XHRcdFx0dGV4dEFsaWduOiBkcnVtLnRleHRBbGlnbiA/IFwiY2VudGVyXCJcblx0XHRcdFx0eDogZHJ1bS54ID8gQF94VmFsXG5cdFx0XHRAX3hWYWwgPSBkci5tYXhYXG4iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIiwiZXhwb3J0cy5rZXlib2FyZExheWVyID0gbmV3IExheWVyXG5cdHg6MCwgeTpTY3JlZW4uaGVpZ2h0LCB3aWR0aDpTY3JlZW4ud2lkdGgsIGhlaWdodDo0MzJcblx0aHRtbDpcIjxpbWcgc3R5bGU9J3dpZHRoOiAxMDAlOycgc3JjPSdtb2R1bGVzL2tleWJvYXJkLnBuZycvPlwiXG5cbiNzY3JlZW4gd2lkdGggdnMuIHNpemUgb2YgaW1hZ2Ugd2lkdGhcbmdyb3d0aFJhdGlvID0gU2NyZWVuLndpZHRoIC8gNzMyXG5pbWFnZUhlaWdodCA9IGdyb3d0aFJhdGlvICogNDMyXG5cbiMgRXh0ZW5kcyB0aGUgTGF5ZXJTdHlsZSBjbGFzcyB3aGljaCBkb2VzIHRoZSBwaXhlbCByYXRpbyBjYWxjdWxhdGlvbnMgaW4gZnJhbWVyXG5faW5wdXRTdHlsZSA9XG5cdE9iamVjdC5hc3NpZ24oe30sIEZyYW1lci5MYXllclN0eWxlLFxuXHRcdGNhbGN1bGF0ZVBpeGVsUmF0aW8gPSAobGF5ZXIsIHZhbHVlKSAtPlxuXHRcdFx0KHZhbHVlICogbGF5ZXIuY29udGV4dC5waXhlbE11bHRpcGxpZXIpICsgXCJweFwiXG5cblx0XHRmb250U2l6ZTogKGxheWVyKSAtPlxuXHRcdFx0Y2FsY3VsYXRlUGl4ZWxSYXRpbyhsYXllciwgbGF5ZXIuX3Byb3BlcnRpZXMuZm9udFNpemUpXG5cblx0XHRsaW5lSGVpZ2h0OiAobGF5ZXIpIC0+XG5cdFx0XHQobGF5ZXIuX3Byb3BlcnRpZXMubGluZUhlaWdodCkgKyBcImVtXCJcblxuXHRcdHBhZGRpbmc6IChsYXllcikgLT5cblx0XHRcdHsgcGl4ZWxNdWx0aXBsaWVyIH0gPSBsYXllci5jb250ZXh0XG5cdFx0XHRwYWRkaW5nID0gW11cblx0XHRcdHBhZGRpbmdWYWx1ZSA9IGxheWVyLl9wcm9wZXJ0aWVzLnBhZGRpbmdcblxuXHRcdFx0IyBDaGVjayBpZiB3ZSBoYXZlIGEgc2luZ2xlIG51bWJlciBhcyBpbnRlZ2VyXG5cdFx0XHRpZiBOdW1iZXIuaXNJbnRlZ2VyKHBhZGRpbmdWYWx1ZSlcblx0XHRcdFx0cmV0dXJuIGNhbGN1bGF0ZVBpeGVsUmF0aW8obGF5ZXIsIHBhZGRpbmdWYWx1ZSlcblxuXHRcdFx0IyBJZiB3ZSBoYXZlIG11bHRpcGxlIHZhbHVlcyB0aGV5IGNvbWUgYXMgc3RyaW5nIChlLmcuIFwiMSAyIDMgNFwiKVxuXHRcdFx0cGFkZGluZ1ZhbHVlcyA9IGxheWVyLl9wcm9wZXJ0aWVzLnBhZGRpbmcuc3BsaXQoXCIgXCIpXG5cblx0XHRcdHN3aXRjaCBwYWRkaW5nVmFsdWVzLmxlbmd0aFxuXHRcdFx0XHR3aGVuIDRcblx0XHRcdFx0XHRwYWRkaW5nLnRvcCA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1swXSlcblx0XHRcdFx0XHRwYWRkaW5nLnJpZ2h0ID0gcGFyc2VGbG9hdChwYWRkaW5nVmFsdWVzWzFdKVxuXHRcdFx0XHRcdHBhZGRpbmcuYm90dG9tID0gcGFyc2VGbG9hdChwYWRkaW5nVmFsdWVzWzJdKVxuXHRcdFx0XHRcdHBhZGRpbmcubGVmdCA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1szXSlcblxuXHRcdFx0XHR3aGVuIDNcblx0XHRcdFx0XHRwYWRkaW5nLnRvcCA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1swXSlcblx0XHRcdFx0XHRwYWRkaW5nLnJpZ2h0ID0gcGFyc2VGbG9hdChwYWRkaW5nVmFsdWVzWzFdKVxuXHRcdFx0XHRcdHBhZGRpbmcuYm90dG9tID0gcGFyc2VGbG9hdChwYWRkaW5nVmFsdWVzWzJdKVxuXHRcdFx0XHRcdHBhZGRpbmcubGVmdCA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1sxXSlcblxuXHRcdFx0XHR3aGVuIDJcblx0XHRcdFx0XHRwYWRkaW5nLnRvcCA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1swXSlcblx0XHRcdFx0XHRwYWRkaW5nLnJpZ2h0ID0gcGFyc2VGbG9hdChwYWRkaW5nVmFsdWVzWzFdKVxuXHRcdFx0XHRcdHBhZGRpbmcuYm90dG9tID0gcGFyc2VGbG9hdChwYWRkaW5nVmFsdWVzWzBdKVxuXHRcdFx0XHRcdHBhZGRpbmcubGVmdCA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1sxXSlcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cGFkZGluZy50b3AgPSBwYXJzZUZsb2F0KHBhZGRpbmdWYWx1ZXNbMF0pXG5cdFx0XHRcdFx0cGFkZGluZy5yaWdodCA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1swXSlcblx0XHRcdFx0XHRwYWRkaW5nLmJvdHRvbSA9IHBhcnNlRmxvYXQocGFkZGluZ1ZhbHVlc1swXSlcblx0XHRcdFx0XHRwYWRkaW5nLmxlZnQgPSBwYXJzZUZsb2F0KHBhZGRpbmdWYWx1ZXNbMF0pXG5cblx0XHRcdCMgUmV0dXJuIGFzIDQtdmFsdWUgc3RyaW5nIChlLmcgXCIxcHggMnB4IDNweCA0cHhcIilcblx0XHRcdFwiI3twYWRkaW5nLnRvcCAqIHBpeGVsTXVsdGlwbGllcn1weCAje3BhZGRpbmcucmlnaHQgKiBwaXhlbE11bHRpcGxpZXJ9cHggI3twYWRkaW5nLmJvdHRvbSAqIHBpeGVsTXVsdGlwbGllcn1weCAje3BhZGRpbmcubGVmdCAqIHBpeGVsTXVsdGlwbGllcn1weFwiXG5cdClcblxuZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlcyA9XG5cdHNob3duOlxuXHRcdHk6IFNjcmVlbi5oZWlnaHQgLSBpbWFnZUhlaWdodFxuXG5leHBvcnRzLmtleWJvYXJkTGF5ZXIuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRjdXJ2ZTogXCJzcHJpbmcoNTAwLDUwLDE1KVwiXG5cbmNsYXNzIGV4cG9ydHMuSW5wdXQgZXh0ZW5kcyBMYXllclxuXHRAZGVmaW5lIFwic3R5bGVcIixcblx0XHRnZXQ6IC0+IEBpbnB1dC5zdHlsZVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0Xy5leHRlbmQgQGlucHV0LnN0eWxlLCB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJ2YWx1ZVwiLFxuXHRcdGdldDogLT4gQGlucHV0LnZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAaW5wdXQudmFsdWUgPSB2YWx1ZVxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdG9wdGlvbnMuc2V0dXAgPz0gZmFsc2Vcblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuY2xpcCA/PSBmYWxzZVxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IDYwXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gaWYgb3B0aW9ucy5zZXR1cCB0aGVuIFwicmdiYSgyNTUsIDYwLCA0NywgLjUpXCIgZWxzZSBcInJnYmEoMjU1LCAyNTUsIDI1NSwgLjAxKVwiICMgXCJ0cmFuc3BhcmVudFwiIHNlZW1zIHRvIGNhdXNlIGEgYnVnIGluIGxhdGVzdCBzYWZhcmkgdmVyc2lvblxuXHRcdG9wdGlvbnMuZm9udFNpemUgPz0gMzBcblx0XHRvcHRpb25zLmxpbmVIZWlnaHQgPz0gMVxuXHRcdG9wdGlvbnMucGFkZGluZyA/PSAxMFxuXHRcdG9wdGlvbnMudGV4dCA/PSBcIlwiXG5cdFx0b3B0aW9ucy5wbGFjZWhvbGRlciA/PSBcIlwiXG5cdFx0b3B0aW9ucy52aXJ0dWFsS2V5Ym9hcmQgPz0gaWYgVXRpbHMuaXNNb2JpbGUoKSB0aGVuIGZhbHNlIGVsc2UgdHJ1ZVxuXHRcdG9wdGlvbnMudHlwZSA/PSBcInRleHRcIlxuXHRcdG9wdGlvbnMuZ29CdXR0b24gPz0gZmFsc2Vcblx0XHRvcHRpb25zLmF1dG9Db3JyZWN0ID89IFwib25cIlxuXHRcdG9wdGlvbnMuYXV0b0NvbXBsZXRlID89IFwib25cIlxuXHRcdG9wdGlvbnMuYXV0b0NhcGl0YWxpemUgPz0gXCJvblwiXG5cdFx0b3B0aW9ucy5zcGVsbENoZWNrID89IFwib25cIlxuXHRcdG9wdGlvbnMuYXV0b2ZvY3VzID89IGZhbHNlXG5cdFx0b3B0aW9ucy50ZXh0Q29sb3IgPz0gXCIjMDAwXCJcblx0XHRvcHRpb25zLmZvbnRGYW1pbHkgPz0gXCItYXBwbGUtc3lzdGVtXCJcblx0XHRvcHRpb25zLmZvbnRXZWlnaHQgPz0gXCI1MDBcIlxuXHRcdG9wdGlvbnMuc3VibWl0ID89IGZhbHNlXG5cdFx0b3B0aW9ucy50YWJJbmRleCA/PSAwXG5cdFx0b3B0aW9ucy50ZXh0YXJlYSA/PSBmYWxzZVxuXHRcdG9wdGlvbnMuZGlzYWJsZWQgPz0gZmFsc2VcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdCMgQWRkIGFkZGl0aW9uYWwgcHJvcGVydGllc1xuXHRcdEBfcHJvcGVydGllcy5mb250U2l6ZSA9IG9wdGlvbnMuZm9udFNpemVcblx0XHRAX3Byb3BlcnRpZXMubGluZUhlaWdodCA9IG9wdGlvbnMubGluZUhlaWdodFxuXHRcdEBfcHJvcGVydGllcy5wYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nXG5cblx0XHRAcGxhY2Vob2xkZXJDb2xvciA9IG9wdGlvbnMucGxhY2Vob2xkZXJDb2xvciBpZiBvcHRpb25zLnBsYWNlaG9sZGVyQ29sb3I/XG5cdFx0QGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpZiBvcHRpb25zLnRleHRhcmVhIHRoZW4gJ3RleHRhcmVhJyBlbHNlICdpbnB1dCdcblx0XHRAaW5wdXQuaWQgPSBcImlucHV0LSN7Xy5ub3coKX1cIlxuXG5cdFx0IyBBZGQgc3R5bGluZyB0byB0aGUgaW5wdXQgZWxlbWVudFxuXHRcdEBpbnB1dC5zdHlsZS53aWR0aCA9IF9pbnB1dFN0eWxlW1wid2lkdGhcIl0oQClcblx0XHRAaW5wdXQuc3R5bGUuaGVpZ2h0ID0gX2lucHV0U3R5bGVbXCJoZWlnaHRcIl0oQClcblx0XHRAaW5wdXQuc3R5bGUuZm9udFNpemUgPSBfaW5wdXRTdHlsZVtcImZvbnRTaXplXCJdKEApXG5cdFx0QGlucHV0LnN0eWxlLmxpbmVIZWlnaHQgPSBfaW5wdXRTdHlsZVtcImxpbmVIZWlnaHRcIl0oQClcblx0XHRAaW5wdXQuc3R5bGUub3V0bGluZSA9IFwibm9uZVwiXG5cdFx0QGlucHV0LnN0eWxlLmJvcmRlciA9IFwibm9uZVwiXG5cdFx0QGlucHV0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IG9wdGlvbnMuYmFja2dyb3VuZENvbG9yXG5cdFx0QGlucHV0LnN0eWxlLnBhZGRpbmcgPSBfaW5wdXRTdHlsZVtcInBhZGRpbmdcIl0oQClcblx0XHRAaW5wdXQuc3R5bGUuZm9udEZhbWlseSA9IG9wdGlvbnMuZm9udEZhbWlseVxuXHRcdEBpbnB1dC5zdHlsZS5jb2xvciA9IG9wdGlvbnMudGV4dENvbG9yXG5cdFx0QGlucHV0LnN0eWxlLmZvbnRXZWlnaHQgPSBvcHRpb25zLmZvbnRXZWlnaHRcblxuXHRcdEBpbnB1dC52YWx1ZSA9IG9wdGlvbnMudGV4dFxuXHRcdEBpbnB1dC50eXBlID0gb3B0aW9ucy50eXBlXG5cdFx0QGlucHV0LnBsYWNlaG9sZGVyID0gb3B0aW9ucy5wbGFjZWhvbGRlclxuXHRcdEBpbnB1dC5zZXRBdHRyaWJ1dGUgXCJ0YWJpbmRleFwiLCBvcHRpb25zLnRhYmluZGV4XG5cdFx0QGlucHV0LnNldEF0dHJpYnV0ZSBcImF1dG9jb3JyZWN0XCIsIG9wdGlvbnMuYXV0b0NvcnJlY3Rcblx0XHRAaW5wdXQuc2V0QXR0cmlidXRlIFwiYXV0b2NvbXBsZXRlXCIsIG9wdGlvbnMuYXV0b0NvbXBsZXRlXG5cdFx0QGlucHV0LnNldEF0dHJpYnV0ZSBcImF1dG9jYXBpdGFsaXplXCIsIG9wdGlvbnMuYXV0b0NhcGl0YWxpemVcblx0XHRpZiBvcHRpb25zLmRpc2FibGVkID09IHRydWVcblx0XHRcdEBpbnB1dC5zZXRBdHRyaWJ1dGUgXCJkaXNhYmxlZFwiLCB0cnVlXG5cdFx0aWYgb3B0aW9ucy5hdXRvZm9jdXMgPT0gdHJ1ZVxuXHRcdFx0QGlucHV0LnNldEF0dHJpYnV0ZSBcImF1dG9mb2N1c1wiLCB0cnVlXG5cdFx0QGlucHV0LnNldEF0dHJpYnV0ZSBcInNwZWxsY2hlY2tcIiwgb3B0aW9ucy5zcGVsbENoZWNrXG5cdFx0QGZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiZm9ybVwiXG5cblx0XHRpZiAob3B0aW9ucy5nb0J1dHRvbiAmJiAhb3B0aW9ucy5zdWJtaXQpIHx8ICFvcHRpb25zLnN1Ym1pdFxuXHRcdFx0QGZvcm0uYWN0aW9uID0gXCIjXCJcblx0XHRcdEBmb3JtLmFkZEV2ZW50TGlzdGVuZXIgXCJzdWJtaXRcIiwgKGV2ZW50KSAtPlxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRAZm9ybS5hcHBlbmRDaGlsZCBAaW5wdXRcblx0XHRAX2VsZW1lbnQuYXBwZW5kQ2hpbGQgQGZvcm1cblxuXHRcdEBiYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRAdXBkYXRlUGxhY2Vob2xkZXJDb2xvciBvcHRpb25zLnBsYWNlaG9sZGVyQ29sb3IgaWYgQHBsYWNlaG9sZGVyQ29sb3JcblxuXHRcdCNvbmx5IHNob3cgaG9ub3IgdmlydHVhbCBrZXlib2FyZCBvcHRpb24gd2hlbiBub3Qgb24gbW9iaWxlLFxuXHRcdCNvdGhlcndpc2UgaWdub3JlXG5cdFx0aWYgIVV0aWxzLmlzTW9iaWxlKCkgJiYgb3B0aW9ucy52aXJ0dWFsS2V5Ym9hcmQgaXMgdHJ1ZVxuXHRcdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJmb2N1c1wiLCAtPlxuXHRcdFx0XHRleHBvcnRzLmtleWJvYXJkTGF5ZXIuYnJpbmdUb0Zyb250KClcblx0XHRcdFx0ZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlQ3ljbGUoKVxuXHRcdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJibHVyXCIsIC0+XG5cdFx0XHRcdGV4cG9ydHMua2V5Ym9hcmRMYXllci5hbmltYXRlKFwiZGVmYXVsdFwiKVxuXG5cdHVwZGF0ZVBsYWNlaG9sZGVyQ29sb3I6IChjb2xvcikgLT5cblx0XHRAcGxhY2Vob2xkZXJDb2xvciA9IGNvbG9yXG5cdFx0aWYgQHBhZ2VTdHlsZT9cblx0XHRcdGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQgQHBhZ2VTdHlsZVxuXHRcdEBwYWdlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwic3R5bGVcIlxuXHRcdEBwYWdlU3R5bGUudHlwZSA9IFwidGV4dC9jc3NcIlxuXHRcdGNzcyA9IFwiIyN7QGlucHV0LmlkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAje0BwbGFjZWhvbGRlckNvbG9yfTsgfVwiXG5cdFx0QHBhZ2VTdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSBjc3MpXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCBAcGFnZVN0eWxlXG5cblx0Zm9jdXM6ICgpIC0+XG5cdFx0QGlucHV0LmZvY3VzKClcblxuXHR1bmZvY3VzOiAoKSAtPlxuXHRcdEBpbnB1dC5ibHVyKClcblxuXHRvbkZvY3VzOiAoY2IpIC0+XG5cdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJmb2N1c1wiLCAtPlxuXHRcdFx0Y2IuYXBwbHkoQClcblxuXHRvbkJsdXI6IChjYikgLT5cblx0XHRAaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciBcImJsdXJcIiwgLT5cblx0XHRcdGNiLmFwcGx5KEApXG5cblx0b25VbmZvY3VzOiB0aGlzLm9uQmx1clxuXHRcblx0ZGlzYWJsZTogKCkgLT5cblx0XHRAaW5wdXQuc2V0QXR0cmlidXRlIFwiZGlzYWJsZWRcIiwgdHJ1ZVxuXG5cdGVuYWJsZTogKCkgPT5cblx0XHRAaW5wdXQucmVtb3ZlQXR0cmlidXRlIFwiZGlzYWJsZWRcIiwgdHJ1ZVxuXHRcbiIsIlxuXG5cbiMgJ0ZpcmViYXNlIFJFU1QgQVBJIENsYXNzJyBtb2R1bGUgdjEuMFxuIyBieSBNYXJjIEtyZW5uLCBNYXkgMzFzdCwgMjAxNiB8IG1hcmMua3Jlbm5AZ21haWwuY29tIHwgQG1hcmNfa3Jlbm5cblxuIyBEb2N1bWVudGF0aW9uIG9mIHRoaXMgTW9kdWxlOiBodHRwczovL2dpdGh1Yi5jb20vbWFyY2tyZW5uL2ZyYW1lci1GaXJlYmFzZVxuIyAtLS0tLS0gOiAtLS0tLS0tIEZpcmViYXNlIFJFU1QgQVBJOiBodHRwczovL2ZpcmViYXNlLmdvb2dsZS5jb20vZG9jcy9yZWZlcmVuY2UvcmVzdC9kYXRhYmFzZS9cblxuXG4jIFRvRG86XG4jIEZpeCBvbkNoYW5nZSBcImNvbm5lY3Rpb25cIiwgYHRoaXPCtCBjb250ZXh0XG5cblxuXG4jIEZpcmViYXNlIFJFU1QgQVBJIENsYXNzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY2xhc3MgZXhwb3J0cy5GaXJlYmFzZSBleHRlbmRzIEZyYW1lci5CYXNlQ2xhc3NcblxuXG5cblx0Z2V0Q09SU3VybCA9IChzZXJ2ZXIsIHBhdGgsIHNlY3JldCwgcHJvamVjdCkgLT5cblxuXHRcdHN3aXRjaCBVdGlscy5pc1dlYktpdCgpXG5cdFx0XHR3aGVuIHRydWUgdGhlbiB1cmwgPSBcImh0dHBzOi8vI3tzZXJ2ZXJ9I3twYXRofS5qc29uP2F1dGg9I3tzZWNyZXR9Jm5zPSN7cHJvamVjdH0mc3NlPXRydWVcIiAjIFdlYmtpdCBYU1Mgd29ya2Fyb3VuZFxuXHRcdFx0ZWxzZSAgICAgICAgICAgdXJsID0gXCJodHRwczovLyN7cHJvamVjdH0uZmlyZWJhc2Vpby5jb20je3BhdGh9Lmpzb24/YXV0aD0je3NlY3JldH1cIlxuXG5cdFx0cmV0dXJuIHVybFxuXG5cblx0QC5kZWZpbmUgXCJzdGF0dXNcIixcblx0XHRnZXQ6IC0+IEBfc3RhdHVzICMgcmVhZE9ubHlcblxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXHRcdEBwcm9qZWN0SUQgPSBAb3B0aW9ucy5wcm9qZWN0SUQgPz0gbnVsbFxuXHRcdEBzZWNyZXQgICAgPSBAb3B0aW9ucy5zZWNyZXQgICAgPz0gbnVsbFxuXHRcdEBzZXJ2ZXIgICAgPSBAb3B0aW9ucy5zZXJ2ZXIgICAgPz0gdW5kZWZpbmVkICMgcmVxdWlyZWQgZm9yIFdlYktpdCBYU1Mgd29ya2Fyb3VuZFxuXHRcdEBkZWJ1ZyAgICAgPSBAb3B0aW9ucy5kZWJ1ZyAgICAgPz0gZmFsc2Vcblx0XHRAX3N0YXR1cyAgICAgICAgICAgICAgICAgICAgICAgID89IFwiZGlzY29ubmVjdGVkXCJcblx0XHRzdXBlclxuXG5cblx0XHRpZiBAc2VydmVyIGlzIHVuZGVmaW5lZFxuXHRcdFx0VXRpbHMuZG9tTG9hZEpTT04gXCJodHRwczovLyN7QHByb2plY3RJRH0uZmlyZWJhc2Vpby5jb20vLnNldHRpbmdzL293bmVyLmpzb25cIiwgKGEsc2VydmVyKSAtPlxuXHRcdFx0XHRwcmludCBtc2cgPSBcIkFkZCBfX19fX18gc2VydmVyOlwiICsgJyAgIFwiJyArIHNlcnZlciArICdcIicgKyBcIiBfX19fXyB0byB5b3VyIGluc3RhbmNlIG9mIEZpcmViYXNlLlwiXG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6ICN7bXNnfVwiIGlmIEBkZWJ1Z1xuXG5cblx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBDb25uZWN0aW5nIHRvIEZpcmViYXNlIFByb2plY3QgJyN7QHByb2plY3RJRH0nIC4uLiBcXG4gVVJMOiAnI3tnZXRDT1JTdXJsKEBzZXJ2ZXIsIFwiL1wiLCBAc2VjcmV0LCBAcHJvamVjdElEKX0nXCIgaWYgQGRlYnVnXG5cdFx0QC5vbkNoYW5nZSBcImNvbm5lY3Rpb25cIlxuXG5cblx0cmVxdWVzdCA9IChwcm9qZWN0LCBzZWNyZXQsIHBhdGgsIGNhbGxiYWNrLCBtZXRob2QsIGRhdGEsIHBhcmFtZXRlcnMsIGRlYnVnKSAtPlxuXG5cdFx0dXJsID0gXCJodHRwczovLyN7cHJvamVjdH0uZmlyZWJhc2Vpby5jb20je3BhdGh9Lmpzb24/YXV0aD0je3NlY3JldH1cIlxuXG5cblx0XHR1bmxlc3MgcGFyYW1ldGVycyBpcyB1bmRlZmluZWRcblx0XHRcdGlmIHBhcmFtZXRlcnMuc2hhbGxvdyAgICAgICAgICAgIHRoZW4gdXJsICs9IFwiJnNoYWxsb3c9dHJ1ZVwiXG5cdFx0XHRpZiBwYXJhbWV0ZXJzLmZvcm1hdCBpcyBcImV4cG9ydFwiIHRoZW4gdXJsICs9IFwiJmZvcm1hdD1leHBvcnRcIlxuXG5cdFx0XHRzd2l0Y2ggcGFyYW1ldGVycy5wcmludFxuXHRcdFx0XHR3aGVuIFwicHJldHR5XCIgdGhlbiB1cmwgKz0gXCImcHJpbnQ9cHJldHR5XCJcblx0XHRcdFx0d2hlbiBcInNpbGVudFwiIHRoZW4gdXJsICs9IFwiJnByaW50PXNpbGVudFwiXG5cblx0XHRcdGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmRvd25sb2FkIGlzIFwic3RyaW5nXCJcblx0XHRcdFx0dXJsICs9IFwiJmRvd25sb2FkPSN7cGFyYW1ldGVycy5kb3dubG9hZH1cIlxuXHRcdFx0XHR3aW5kb3cub3Blbih1cmwsXCJfc2VsZlwiKVxuXG5cblx0XHRcdHVybCArPSBcIiZvcmRlckJ5PVwiICsgJ1wiJyArIHBhcmFtZXRlcnMub3JkZXJCeSArICdcIicgaWYgdHlwZW9mIHBhcmFtZXRlcnMub3JkZXJCeSAgICAgIGlzIFwic3RyaW5nXCJcblx0XHRcdHVybCArPSBcIiZsaW1pdFRvRmlyc3Q9I3twYXJhbWV0ZXJzLmxpbWl0VG9GaXJzdH1cIiAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmxpbWl0VG9GaXJzdCBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImbGltaXRUb0xhc3Q9I3twYXJhbWV0ZXJzLmxpbWl0VG9MYXN0fVwiICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5saW1pdFRvTGFzdCAgaXMgXCJudW1iZXJcIlxuXHRcdFx0dXJsICs9IFwiJnN0YXJ0QXQ9I3twYXJhbWV0ZXJzLnN0YXJ0QXR9XCIgICAgICAgICAgICAgaWYgdHlwZW9mIHBhcmFtZXRlcnMuc3RhcnRBdCAgICAgIGlzIFwibnVtYmVyXCJcblx0XHRcdHVybCArPSBcIiZlbmRBdD0je3BhcmFtZXRlcnMuZW5kQXR9XCIgICAgICAgICAgICAgICAgIGlmIHR5cGVvZiBwYXJhbWV0ZXJzLmVuZEF0ICAgICAgICBpcyBcIm51bWJlclwiXG5cdFx0XHR1cmwgKz0gXCImZXF1YWxUbz0je3BhcmFtZXRlcnMuZXF1YWxUb31cIiAgICAgICAgICAgICBpZiB0eXBlb2YgcGFyYW1ldGVycy5lcXVhbFRvICAgICAgaXMgXCJudW1iZXJcIlxuXG5cblx0XHR4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdFxuXHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IE5ldyAnI3ttZXRob2R9Jy1yZXF1ZXN0IHdpdGggZGF0YTogJyN7SlNPTi5zdHJpbmdpZnkoZGF0YSl9JyBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cdFx0eGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gPT5cblxuXHRcdFx0dW5sZXNzIHBhcmFtZXRlcnMgaXMgdW5kZWZpbmVkXG5cdFx0XHRcdGlmIHBhcmFtZXRlcnMucHJpbnQgaXMgXCJzaWxlbnRcIiBvciB0eXBlb2YgcGFyYW1ldGVycy5kb3dubG9hZCBpcyBcInN0cmluZ1wiIHRoZW4gcmV0dXJuICMgdWdoXG5cblx0XHRcdHN3aXRjaCB4aHR0cC5yZWFkeVN0YXRlXG5cdFx0XHRcdHdoZW4gMCB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlcXVlc3Qgbm90IGluaXRpYWxpemVkIFxcbiBVUkw6ICcje3VybH0nXCIgICAgICAgaWYgZGVidWdcblx0XHRcdFx0d2hlbiAxIHRoZW4gY29uc29sZS5sb2cgXCJGaXJlYmFzZTogU2VydmVyIGNvbm5lY3Rpb24gZXN0YWJsaXNoZWQgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXHRcdFx0XHR3aGVuIDIgdGhlbiBjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IHJlY2VpdmVkIFxcbiBVUkw6ICcje3VybH0nXCIgICAgICAgICAgICAgIGlmIGRlYnVnXG5cdFx0XHRcdHdoZW4gMyB0aGVuIGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFByb2Nlc3NpbmcgcmVxdWVzdCBcXG4gVVJMOiAnI3t1cmx9J1wiICAgICAgICAgICAgaWYgZGVidWdcblx0XHRcdFx0d2hlbiA0XG5cdFx0XHRcdFx0Y2FsbGJhY2soSlNPTi5wYXJzZSh4aHR0cC5yZXNwb25zZVRleHQpKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBSZXF1ZXN0IGZpbmlzaGVkLCByZXNwb25zZTogJyN7SlNPTi5wYXJzZSh4aHR0cC5yZXNwb25zZVRleHQpfScgXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBkZWJ1Z1xuXG5cdFx0XHRpZiB4aHR0cC5zdGF0dXMgaXMgXCI0MDRcIlxuXHRcdFx0XHRjb25zb2xlLndhcm4gXCJGaXJlYmFzZTogSW52YWxpZCByZXF1ZXN0LCBwYWdlIG5vdCBmb3VuZCBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIGRlYnVnXG5cblxuXHRcdHhodHRwLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpXG5cdFx0eGh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIilcblx0XHR4aHR0cC5zZW5kKGRhdGEgPSBcIiN7SlNPTi5zdHJpbmdpZnkoZGF0YSl9XCIpXG5cblxuXG5cdCMgQXZhaWxhYmxlIG1ldGhvZHNcblxuXHRnZXQ6ICAgIChwYXRoLCBjYWxsYmFjaywgICAgICAgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJHRVRcIiwgICAgbnVsbCwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRwdXQ6ICAgIChwYXRoLCBkYXRhLCBjYWxsYmFjaywgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJQVVRcIiwgICAgZGF0YSwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRwb3N0OiAgIChwYXRoLCBkYXRhLCBjYWxsYmFjaywgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJQT1NUXCIsICAgZGF0YSwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRwYXRjaDogIChwYXRoLCBkYXRhLCBjYWxsYmFjaywgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJQQVRDSFwiLCAgZGF0YSwgcGFyYW1ldGVycywgQGRlYnVnKVxuXHRkZWxldGU6IChwYXRoLCBjYWxsYmFjaywgICAgICAgcGFyYW1ldGVycykgLT4gcmVxdWVzdChAcHJvamVjdElELCBAc2VjcmV0LCBwYXRoLCBjYWxsYmFjaywgXCJERUxFVEVcIiwgbnVsbCwgcGFyYW1ldGVycywgQGRlYnVnKVxuXG5cblxuXHRvbkNoYW5nZTogKHBhdGgsIGNhbGxiYWNrKSAtPlxuXG5cblx0XHRpZiBwYXRoIGlzIFwiY29ubmVjdGlvblwiXG5cblx0XHRcdHVybCA9IGdldENPUlN1cmwoQHNlcnZlciwgXCIvXCIsIEBzZWNyZXQsIEBwcm9qZWN0SUQpXG5cdFx0XHRjdXJyZW50U3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIlxuXHRcdFx0c291cmNlID0gbmV3IEV2ZW50U291cmNlKHVybClcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJvcGVuXCIsID0+XG5cdFx0XHRcdGlmIGN1cnJlbnRTdGF0dXMgaXMgXCJkaXNjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdEAuX3N0YXR1cyA9IFwiY29ubmVjdGVkXCJcblx0XHRcdFx0XHRjYWxsYmFjayhcImNvbm5lY3RlZFwiKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBDb25uZWN0aW9uIHRvIEZpcmViYXNlIFByb2plY3QgJyN7QHByb2plY3RJRH0nIGVzdGFibGlzaGVkXCIgaWYgQGRlYnVnXG5cdFx0XHRcdGN1cnJlbnRTdGF0dXMgPSBcImNvbm5lY3RlZFwiXG5cblx0XHRcdHNvdXJjZS5hZGRFdmVudExpc3RlbmVyIFwiZXJyb3JcIiwgPT5cblx0XHRcdFx0aWYgY3VycmVudFN0YXR1cyBpcyBcImNvbm5lY3RlZFwiXG5cdFx0XHRcdFx0QC5fc3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIlxuXHRcdFx0XHRcdGNhbGxiYWNrKFwiZGlzY29ubmVjdGVkXCIpIGlmIGNhbGxiYWNrP1xuXHRcdFx0XHRcdGNvbnNvbGUud2FybiBcIkZpcmViYXNlOiBDb25uZWN0aW9uIHRvIEZpcmViYXNlIFByb2plY3QgJyN7QHByb2plY3RJRH0nIGNsb3NlZFwiIGlmIEBkZWJ1Z1xuXHRcdFx0XHRjdXJyZW50U3RhdHVzID0gXCJkaXNjb25uZWN0ZWRcIlxuXG5cblx0XHRlbHNlXG5cblx0XHRcdHVybCA9IGdldENPUlN1cmwoQHNlcnZlciwgcGF0aCwgQHNlY3JldCwgQHByb2plY3RJRClcblx0XHRcdHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwpXG5cdFx0XHRjb25zb2xlLmxvZyBcIkZpcmViYXNlOiBMaXN0ZW5pbmcgdG8gY2hhbmdlcyBtYWRlIHRvICcje3BhdGh9JyBcXG4gVVJMOiAnI3t1cmx9J1wiIGlmIEBkZWJ1Z1xuXG5cdFx0XHRzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lciBcInB1dFwiLCAoZXYpID0+XG5cdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoZXYuZGF0YSkuZGF0YSwgXCJwdXRcIiwgSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLCBfLnJlc3QoSlNPTi5wYXJzZShldi5kYXRhKS5wYXRoLnNwbGl0KFwiL1wiKSwxKSkgaWYgY2FsbGJhY2s/XG5cdFx0XHRcdGNvbnNvbGUubG9nIFwiRmlyZWJhc2U6IFJlY2VpdmVkIGNoYW5nZXMgbWFkZSB0byAnI3twYXRofScgdmlhICdQVVQnOiAje0pTT04ucGFyc2UoZXYuZGF0YSkuZGF0YX0gXFxuIFVSTDogJyN7dXJsfSdcIiBpZiBAZGVidWdcblxuXHRcdFx0c291cmNlLmFkZEV2ZW50TGlzdGVuZXIgXCJwYXRjaFwiLCAoZXYpID0+XG5cdFx0XHRcdGNhbGxiYWNrKEpTT04ucGFyc2UoZXYuZGF0YSkuZGF0YSwgXCJwYXRjaFwiLCBKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGgsIF8ucmVzdChKU09OLnBhcnNlKGV2LmRhdGEpLnBhdGguc3BsaXQoXCIvXCIpLDEpKSBpZiBjYWxsYmFjaz9cblx0XHRcdFx0Y29uc29sZS5sb2cgXCJGaXJlYmFzZTogUmVjZWl2ZWQgY2hhbmdlcyBtYWRlIHRvICcje3BhdGh9JyB2aWEgJ1BBVENIJzogI3tKU09OLnBhcnNlKGV2LmRhdGEpLmRhdGF9IFxcbiBVUkw6ICcje3VybH0nXCIgaWYgQGRlYnVnXG5cbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBSUFBO0FEaUJBLElBQUE7OztBQUFNLE9BQU8sQ0FBQztBQUliLE1BQUE7Ozs7RUFBQSxVQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsSUFBVCxFQUFlLE1BQWYsRUFBdUIsT0FBdkI7QUFFWixRQUFBO0FBQUEsWUFBTyxLQUFLLENBQUMsUUFBTixDQUFBLENBQVA7QUFBQSxXQUNNLElBRE47UUFDZ0IsR0FBQSxHQUFNLFVBQUEsR0FBVyxNQUFYLEdBQW9CLElBQXBCLEdBQXlCLGFBQXpCLEdBQXNDLE1BQXRDLEdBQTZDLE1BQTdDLEdBQW1ELE9BQW5ELEdBQTJEO0FBQTNFO0FBRE47UUFFZ0IsR0FBQSxHQUFNLFVBQUEsR0FBVyxPQUFYLEdBQW1CLGlCQUFuQixHQUFvQyxJQUFwQyxHQUF5QyxhQUF6QyxHQUFzRDtBQUY1RTtBQUlBLFdBQU87RUFOSzs7RUFTYixRQUFDLENBQUMsTUFBRixDQUFTLFFBQVQsRUFDQztJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtHQUREOztFQUdhLGtCQUFDLE9BQUQ7QUFDWixRQUFBO0lBRGEsSUFBQyxDQUFBLDRCQUFELFVBQVM7SUFDdEIsSUFBQyxDQUFBLFNBQUQsaURBQXFCLENBQUMsZ0JBQUQsQ0FBQyxZQUFhO0lB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
