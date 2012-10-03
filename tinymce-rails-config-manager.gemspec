$:.push File.expand_path("../lib", __FILE__)

require "tinymce-rails-config-manager/version"
Gem::Specification.new do |s|
  s.name        = "tinymce-rails-config-manager"
  s.version     = TinymceRailsConfigManager::VERSION
  s.authors     = ["ITHouse (Latvia) and Arturs Meisters"]
  s.email       = ["support@ithouse.lv"]
  s.homepage    = "http://github.com/ithouse/tinymce-rails-config-manager"
  s.summary     = "Simple tinyMCE configuration manager."
  s.description = "Simple tinyMCE configuration manager that makes it easier to manage different configurations without changing templates"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "rails", "~> 3.2.8"
  s.add_dependency "jquery-rails", ">= 2.1.3"
  s.add_dependency "tinymce-rails", ">= 3.5.6"
end
