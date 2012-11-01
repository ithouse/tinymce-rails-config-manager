describe 'TinyMCEConfigManager', ->

  describe 'static methods', ->
    it "allow to access single instance", ->
      manager = TinyMCEConfigManager.get()
      expect(manager).not.toBeNull()

  describe 'prototype methods', ->
    instance = null
    beforeEach ->
      instance = TinyMCEConfigManager.get()

    describe '#init', ->
      it "create config on init", ->
        instance.init()
        expect(instance.config).toBeDefined()

      it "create defaultConfig as config alias", ->
        instance.init()
        expect(instance.defaultConfig).toBeDefined()

    describe '#configFor(selector)', ->
      it "return new configuration", ->
        expect(instance.configFor("#someSelector") instanceof TinyMCEConfigManager.TinyMCEConfigManagerConfiguration).toBeTruthy()
        expect(instance.configFor("#someSelector")).not.toBe(instance.config)

    describe '#defaultSettings', ->
      it "have default settings", ->
        expect(instance.defaultSettings).toBeDefined()

    describe '#textareaSelector', ->
      it "have selector", ->
        expect(instance.textareaSelector).toBeDefined()

    describe '#load', ->
      beforeEach ->
        jQuery.fn.tinymce = ->

      it "always should load default config", ->
        spyEvent = spyOnEvent(instance.textareaSelector(), 'tinymce')
        instance.load()
        expect('tinymce').toHaveBeenTriggeredOn(instance.textareaSelector())