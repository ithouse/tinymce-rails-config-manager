(function() {
  var TinyMCEConfigManager,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TinyMCEConfigManager = (function() {
    var DEFAULT_SETTINGS, TEXTAREA_SELECTOR, TinyMCEConfigManagerConfiguration, TinyMCEFunctionSettingManager, TinyMCEListSettingManager, TinyMCESettingManager, TinyMCEValueSettingManager;

    function TinyMCEConfigManager() {}

    TEXTAREA_SELECTOR = "textarea[data-simple!=true]";

    DEFAULT_SETTINGS = {
      theme: "advanced",
      skin: "cirkuit",
      mode: "textareas",
      plugins: "table,fullscreen,lists,paste",
      relative_urls: false,
      theme_advanced_buttons1: "bold,italic,underline,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,|,formatselect,|,image,removeformat,code,fullscreen",
      theme_advanced_buttons2: "tablecontrols,|,paste,pastetext,pasteword,|,anchor,link,unlink",
      theme_advanced_buttons3: "",
      theme_advanced_toolbar_location: "top",
      theme_advanced_toolbar_align: "left"
    };

    TinyMCEConfigManager._instance = null;

    TinyMCEConfigManager.get = function() {
      if (!(this._instance != null)) {
        this._instance = new this;
        this._instance.init();
      }
      return this._instance;
    };

    TinyMCEConfigManager.prototype.init = function() {
      this.defaultConfig = this._createNewConfiguration();
      this.defaultConfig.setAsDefault();
      this.config = this.defaultConfig;
      return this._configs = {};
    };

    TinyMCEConfigManager.prototype.configFor = function(selector) {
      if (!this._configs[selector]) {
        this._configs[selector] = this._createNewConfiguration(this.config.settings);
      }
      return this._configs[selector];
    };

    TinyMCEConfigManager.prototype.load = function(extendedSettings) {
      var config, selector, _ref;
      _ref = this._configs;
      for (selector in _ref) {
        config = _ref[selector];
        this._initializeTinyMCEFor(selector, config, extendedSettings);
      }
      return this._initializeDefaultTinyMCE(extendedSettings);
    };

    TinyMCEConfigManager.prototype.defaultSettings = function() {
      return DEFAULT_SETTINGS;
    };

    TinyMCEConfigManager.prototype.textareaSelector = function() {
      return TEXTAREA_SELECTOR;
    };

    TinyMCEConfigManager.prototype._createNewConfiguration = function(givenSettings) {
      return new TinyMCEConfigManagerConfiguration(this._settings(givenSettings));
    };

    TinyMCEConfigManager.prototype._settings = function(givenSettings) {
      var newSettings;
      newSettings = $.extend(true, {}, this.defaultSettings());
      if (givenSettings) {
        $.extend(true, newSettings, givenSettings);
      }
      return newSettings;
    };

    TinyMCEConfigManager.prototype._initializeTinyMCEFor = function(selector, config, extendedSettings) {
      var newSettings;
      newSettings = $.extend(true, $.extend(true, {}, config.settings), extendedSettings);
      return $(selector).tinymce(newSettings);
    };

    TinyMCEConfigManager.prototype._initializeDefaultTinyMCE = function(extendedSettings) {
      var $selector, config, newSettings, selector, _ref;
      newSettings = $.extend(true, $.extend(true, {}, this.config.settings), extendedSettings);
      $selector = $(this.textareaSelector());
      _ref = this._configs;
      for (selector in _ref) {
        config = _ref[selector];
        $selector = $selector.not(selector);
      }
      return $selector.tinymce(newSettings);
    };

    TinyMCEConfigManager.TinyMCEConfigManagerConfiguration = TinyMCEConfigManagerConfiguration = (function() {

      function TinyMCEConfigManagerConfiguration(settings) {
        this.settings = settings;
        this.callbacks = {};
        this["default"] = false;
      }

      TinyMCEConfigManagerConfiguration.prototype.add = function(keyName, newValue) {
        var listManager;
        listManager = new TinyMCEListSettingManager(this);
        return listManager.add(keyName, newValue);
      };

      TinyMCEConfigManagerConfiguration.prototype.addAfter = function(keyName, newValue, oldValue) {
        var listManager;
        listManager = new TinyMCEListSettingManager(this);
        return listManager.addAfter(keyName, newValue, oldValue);
      };

      TinyMCEConfigManagerConfiguration.prototype.addBefore = function(keyName, newValue, oldValue) {
        var listManager;
        listManager = new TinyMCEListSettingManager(this);
        return listManager.addBefore(keyName, newValue, oldValue);
      };

      TinyMCEConfigManagerConfiguration.prototype.set = function(keyName, newValue) {
        var valueManager;
        valueManager = new TinyMCEValueSettingManager(this);
        return valueManager.set(keyName, newValue);
      };

      TinyMCEConfigManagerConfiguration.prototype.addFunction = function(keyName, newFunction) {
        var functionManager;
        functionManager = new TinyMCEFunctionSettingManager(this);
        return functionManager.add(keyName, newFunction);
      };

      TinyMCEConfigManagerConfiguration.prototype.callCallbacksOn = function(callbackName, args) {
        var callback, _i, _len, _ref, _results;
        _ref = this.callbacks[callbackName];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          _results.push(callback.apply(window, args));
        }
        return _results;
      };

      TinyMCEConfigManagerConfiguration.prototype.setValue = function(keyName, newValue) {
        return this.settings[keyName] = newValue;
      };

      TinyMCEConfigManagerConfiguration.prototype.setAsDefault = function() {
        return this["default"] = true;
      };

      return TinyMCEConfigManagerConfiguration;

    })();

    TinyMCESettingManager = (function() {

      function TinyMCESettingManager(config) {
        this.config = config;
      }

      TinyMCESettingManager.prototype._getValue = function(keyName) {
        return this.config.settings[keyName];
      };

      TinyMCESettingManager.prototype._setValue = function(keyName, newValue) {
        return this.config.setValue(keyName, newValue);
      };

      return TinyMCESettingManager;

    })();

    TinyMCEListSettingManager = (function(_super) {
      var COMPLEX_OPTIONS;

      __extends(TinyMCEListSettingManager, _super);

      function TinyMCEListSettingManager() {
        return TinyMCEListSettingManager.__super__.constructor.apply(this, arguments);
      }

      COMPLEX_OPTIONS = {
        buttons: ['theme_advanced_buttons1', 'theme_advanced_buttons2', 'theme_advanced_buttons3']
      };

      TinyMCEListSettingManager.prototype.add = function(keyName, newValue) {
        var list, listKeyName, newList, _ref, _results;
        _ref = this._valuesList(keyName);
        _results = [];
        for (listKeyName in _ref) {
          list = _ref[listKeyName];
          if (list) {
            if (list.length > 0) {
              newList = list + "," + newValue;
            } else {
              newList = newValue;
            }
            _results.push(this._setValue(listKeyName, newList));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      TinyMCEListSettingManager.prototype.addAfter = function(keyName, newValue, oldValue) {
        var list, listKeyName, newList, _ref, _results;
        _ref = this._valuesList(keyName);
        _results = [];
        for (listKeyName in _ref) {
          list = _ref[listKeyName];
          if (list && this._valueExist(list, oldValue) && !this._valueExist(list, newValue)) {
            newList = list.replace(this._valueRegExp(oldValue), oldValue + "," + newValue);
            _results.push(this._setValue(listKeyName, newList));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      TinyMCEListSettingManager.prototype.addBefore = function(keyName, newValue, oldValue) {
        var list, listKeyName, newList, _ref, _results;
        _ref = this._valuesList(keyName);
        _results = [];
        for (listKeyName in _ref) {
          list = _ref[listKeyName];
          if (list && this._valueExist(list, oldValue) && !this._valueExist(list, newValue)) {
            newList = list.replace(this._valueRegExp(oldValue), newValue + "," + oldValue);
            _results.push(this._setValue(listKeyName, newList));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      TinyMCEListSettingManager.prototype._valueRegExp = function(value) {
        return new RegExp("\\b" + value + "\\b");
      };

      TinyMCEListSettingManager.prototype._valueExist = function(list, value) {
        return list.match(this._valueRegExp(value));
      };

      TinyMCEListSettingManager.prototype._valuesList = function(keyName) {
        var complexKeys, key, result, _i, _len;
        complexKeys = COMPLEX_OPTIONS[keyName];
        result = {};
        if (complexKeys) {
          for (_i = 0, _len = complexKeys.length; _i < _len; _i++) {
            key = complexKeys[_i];
            result[key] = this._getValue(key);
          }
        } else {
          result[keyName] = this._getValue(keyName);
        }
        return result;
      };

      return TinyMCEListSettingManager;

    })(TinyMCESettingManager);

    TinyMCEValueSettingManager = (function(_super) {

      __extends(TinyMCEValueSettingManager, _super);

      function TinyMCEValueSettingManager() {
        return TinyMCEValueSettingManager.__super__.constructor.apply(this, arguments);
      }

      TinyMCEValueSettingManager.prototype.set = function(keyName, newValue) {
        return this._setValue(keyName, newValue);
      };

      return TinyMCEValueSettingManager;

    })(TinyMCESettingManager);

    TinyMCEFunctionSettingManager = (function(_super) {

      __extends(TinyMCEFunctionSettingManager, _super);

      function TinyMCEFunctionSettingManager() {
        return TinyMCEFunctionSettingManager.__super__.constructor.apply(this, arguments);
      }

      TinyMCEFunctionSettingManager.prototype.add = function(keyName, newFunction) {
        var config;
        this._addCallback(keyName, newFunction);
        config = this.config;
        return this._setValue(keyName, function(_arguments) {
          this["arguments"] = _arguments;
          return config.callCallbacksOn(keyName, arguments);
        });
      };

      TinyMCEFunctionSettingManager.prototype._addCallback = function(keyName, newFunction) {
        if (!this.config.callbacks[keyName]) {
          return this.config.callbacks[keyName] = [newFunction];
        } else {
          return this.config.callbacks[keyName].push(newFunction);
        }
      };

      return TinyMCEFunctionSettingManager;

    })(TinyMCESettingManager);

    return TinyMCEConfigManager;

  })();

  window.TinyMCEConfigManager = TinyMCEConfigManager;

}).call(this);
