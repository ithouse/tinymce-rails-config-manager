module TinymceRailsConfigManager
  def self.load!
    require 'tinymce-rails-config-manager/engine'
  end
end

TinymceRailsConfigManager.load!
