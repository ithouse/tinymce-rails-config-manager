# TinymceRailsConfigManager
Simple tinyMCE configuration manager

## Instructions

1. Add **tinymce-rails-config-manager** 

  ```ruby
  gem 'tinymce-rails-config-manager'
  ```

2. Include asset in your JS manifest file

  ` //= require tinymce-rails-config-manager `

## Usage

### How to change setting properties

* To add new property (added only once)

  This will add **template** to plugin option existing value

  ```javascript
  TinyMCEConfigManager.get().config.add("plugin", "template")
  ```

* To add new value after some other (added only once; buttons is shortcut to all theme_advanced_buttonsX)

  This will add fullscreen button after bold

  ```javascript
  TinyMCEConfigManager.get().config.addAfter("buttons", "fullscreen", "bold")
  ```

* To add new value before some other (added only once)
  
  This will add fullscreen button before bold

  ```javascript
  TinyMCEConfigManager.get().config.addBefore("buttons", "fullscreen", "bold")
  ```

* To set property
  
  This will set value **right** for theme_advanced_toolbar_align

  ```javascript
  TinyMCEConfigManager.get().config.set("theme_advanced_toolbar_align", "right")
  ```

* To add callback (new callback function will be added with every call)

  This will add callback for **setup**

  ```javascript
  TinyMCEConfigManager.get().config.addFunction("setup", function(editor){ /*do something here*/})
  ```


### How to change settings

To add or change settings for specific textareas use 

```javascript
TinyMCEConfigManager.get().configFor("#my_special_textarea")
```

and then use all property modifiers as mentioned above. Default settings will be loaded for all other textareas.


This project rocks and uses MIT-LICENSE.

