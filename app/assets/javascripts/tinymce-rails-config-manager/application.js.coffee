# TinyMCEConfigManager class makes it easier to manage configuration for TinyMCE.
# There are only one instance of TinyMCEConfigManager and to access it call
#     TinyMCEConfigManager.get()
# To access default configuration call
#     TinyMCEConfigManager.get().config.[someMethod]
# To access configuration for specific selector call
#     TinyMCEConfigManager.get().configFor("#myTextFieldID").[someMethod]
# To load tinymce call
#     TinyMCEConfigManager.load([optional settings here])
# Those selector that are used with selector specific configurations are not used with default selector in when tinyMCE is initialized with default selector
class TinyMCEConfigManager

  TEXTAREA_SELECTOR = "textarea[data-simple!=true]"
  DEFAULT_SETTINGS = {
    theme: "advanced",
    skin: "cirkuit",
    mode: "textareas",
    plugins: "table,fullscreen,lists,paste",
    theme_advanced_buttons1 : "bold,italic,underline,|,bullist,numlist,|,justifyleft,justifycenter,justifyright,|,formatselect,|,image,removeformat,code,fullscreen",
    theme_advanced_buttons2 : "tablecontrols,|,paste,pastetext,pasteword,|,anchor,link,unlink",
    theme_advanced_buttons3 : "",
    theme_advanced_toolbar_location: "top",
    theme_advanced_toolbar_align: "left",
    theme_advanced_resizing: true
  }
    
  @_instance: null

  @get: ->
    if not @_instance?
      @_instance = new @
      @_instance.init()
    @_instance

  init: ->
    @defaultConfig = @_createNewConfiguration()
    @config = @defaultConfig
    @_configs = {}

  configFor: (selector) ->
    unless @_configs[selector]
      @_configs[selector] = @_createNewConfiguration(@config.settings)
    @_configs[selector]

  load: (extendedSettings) ->
    for selector, config of @_configs
      @_initializeTinyMCEFor(selector, config, extendedSettings)
    @_initializeDefaultTinyMCE(extendedSettings)

  defaultSettings: ->
    DEFAULT_SETTINGS

  textareaSelector: ->
    TEXTAREA_SELECTOR

  _createNewConfiguration: (givenSettings) ->
    new TinyMCEConfigManagerConfiguration(@_settings(givenSettings))

  _settings: (givenSettings) ->
    newSettings = $.extend(true, {}, @defaultSettings())
    if givenSettings
      $.extend(true, newSettings, givenSettings)
    newSettings

  _initializeTinyMCEFor: (selector, config, extendedSettings) ->
    newSettings = $.extend(true, $.extend(true, {}, config.settings), extendedSettings)
    $(selector).tinymce(newSettings)

  _initializeDefaultTinyMCE: (extendedSettings) ->
    newSettings = $.extend(true, $.extend(true, {}, @config.settings), extendedSettings)
    $selector = $(@textareaSelector())
    for selector, config in @_configs
      $selector = $selector.not(selector)
    $selector.tinymce(newSettings)

  # TinyMCEConfigManagerConfiguration allow to change values of tinyMCE configuration.
  class TinyMCEConfigManagerConfiguration

    constructor: (settings) ->
      @settings = settings
      @callbacks = {}

    add: (keyName, newValue) ->
      listManager = new TinyMCEListSettingManager(this)
      listManager.add(keyName, newValue)

    addAfter: (keyName, newValue, oldValue) ->
      listManager = new TinyMCEListSettingManager(this)
      listManager.addAfter(keyName, newValue, oldValue)

    addBefore: (keyName, newValue, oldValue) ->
      listManager = new TinyMCEListSettingManager(this)
      listManager.addBefore(keyName, newValue, oldValue)
    
    set: (keyName, newValue) ->
      valueManager = new TinyMCEValueSettingManager(this)
      valueManager.set(keyName, newValue)

    addFunction: (keyName, newFunction) ->
      functionManager = new TinyMCEFunctionSettingManager(this)
      functionManager.add(keyName, newFunction)

    callCallbacksOn: (callbackName, args) ->
      for callback in @callbacks[callbackName]
        callback.apply(window, args)

    setValue: (keyName, newValue) ->
      @settings[keyName] = newValue


  class TinyMCESettingManager
    constructor: (config) ->
      @config = config

    _getValue: (keyName) ->
      @config.settings[keyName]

    _setValue: (keyName, newValue) ->
      @config.setValue(keyName, newValue)

  # Manage options that consist of string values that are seperated with commas
  class TinyMCEListSettingManager extends TinyMCESettingManager
    COMPLEX_OPTIONS = {
      buttons: ['theme_advanced_buttons1', 'theme_advanced_buttons2', 'theme_advanced_buttons3']
    }
    
    add:(keyName, newValue) ->
      for listKeyName, list of @_valuesList(keyName)
        if list
          if list.length > 0
            newList = list + "," + newValue
          else
            newList = newValue
          @_setValue(listKeyName, newList)

    addAfter: (keyName, newValue, oldValue) ->
      for listKeyName, list of @_valuesList(keyName)
        if list && @_valueExist(list, oldValue) and not @_valueExist(list, newValue)
          newList = list.replace(@_valueRegExp(oldValue),  oldValue + "," + newValue)
          @_setValue(listKeyName, newList)

    addBefore: (keyName, newValue, oldValue) ->
      for listKeyName, list of @_valuesList(keyName)
        if list && @_valueExist(list, oldValue) and not @_valueExist(list, newValue)
          newList = list.replace(@_valueRegExp(oldValue),  newValue + "," + oldValue)
          @_setValue(listKeyName, newList)

    _valueRegExp: (value)->
      new RegExp("\\b" + value + "\\b")

    _valueExist: (list, value) ->
      list.match(@_valueRegExp(value))

    _valuesList: (keyName) ->
      complexKeys = COMPLEX_OPTIONS[keyName]
      result = {}
      if complexKeys
        for key in complexKeys
          result[key] = @_getValue(key)
      else
        result[keyName] = @_getValue(keyName)
      result


  class TinyMCEValueSettingManager extends TinyMCESettingManager

    set: (keyName, newValue) ->
      @_setValue(keyName, newValue)

  class TinyMCEFunctionSettingManager extends TinyMCESettingManager

    add: (keyName, newFunction) ->
      @_addCallback(keyName, newFunction)
      config = @config
      @_setValue(keyName, (@arguments)->
        config.callCallbacksOn(keyName, arguments)
      )

    _addCallback: (keyName, newFunction) ->
      unless @config.callbacks[keyName]
        @config.callbacks[keyName] = [newFunction]
      else
        @config.callbacks[keyName].push(newFunction)


window.TinyMCEConfigManager = TinyMCEConfigManager

