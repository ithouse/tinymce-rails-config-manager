(function() {

  describe('TinyMCEConfigManager', function() {
    describe('static methods', function() {
      return it("allow to access single instance", function() {
        var manager;
        manager = TinyMCEConfigManager.get();
        return expect(manager).not.toBeNull();
      });
    });
    return describe('prototype methods', function() {
      var instance;
      instance = null;
      beforeEach(function() {
        return instance = TinyMCEConfigManager.get();
      });
      describe('#init', function() {
        it("create config on init", function() {
          instance.init();
          return expect(instance.config).toBeDefined();
        });
        return it("create defaultConfig as config alias", function() {
          instance.init();
          return expect(instance.defaultConfig).toBeDefined();
        });
      });
      describe('#configFor(selector)', function() {
        return it("return new configuration", function() {
          expect(instance.configFor("#someSelector") instanceof TinyMCEConfigManager.TinyMCEConfigManagerConfiguration).toBeTruthy();
          return expect(instance.configFor("#someSelector")).not.toBe(instance.config);
        });
      });
      describe('#defaultSettings', function() {
        return it("have default settings", function() {
          return expect(instance.defaultSettings).toBeDefined();
        });
      });
      describe('#textareaSelector', function() {
        return it("have selector", function() {
          return expect(instance.textareaSelector).toBeDefined();
        });
      });
      return describe('#load', function() {
        beforeEach(function() {
          return jQuery.fn.tinymce = function() {};
        });
        return it("always should load default config", function() {
          var spyEvent;
          spyEvent = spyOnEvent(instance.textareaSelector(), 'tinymce');
          instance.load();
          return expect('tinymce').toHaveBeenTriggeredOn(instance.textareaSelector());
        });
      });
    });
  });

}).call(this);
