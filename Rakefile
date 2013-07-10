require 'rubygems'
require 'bundler'
require 'rspec/core/rake_task'
require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

Bundler::GemHelper.install_tasks
task :default => :jasmine

namespace :jasmine do
  desc "Compile CoffeeScript files" 
  task :compile do 
    require 'coffee-script'
    source_files = Dir["./app/assets/javascripts/**/*.coffee"]
    source_specs = Dir["./spec/javascripts/**/*.coffee"]

    dest_dir = "./spec/javascripts/generated"
    spec_dest_dir = File.join(dest_dir, "spec")
    js_dest_dir = File.join(dest_dir, "javascripts")

    [spec_dest_dir, js_dest_dir].each do |dir|
      unless File.directory?(dir)
        Dir.mkdir(dir)
      end
    end

    { spec_dest_dir => source_specs, js_dest_dir => source_files}.each do |dest_dir, files|
      files.each do |file_path|
        dest_path = File.join(dest_dir, File.basename(file_path, ".coffee"))
        File.open(dest_path, "w") do |f|
          f.write(CoffeeScript.compile(File.read(file_path)))
        end
      end
    end
  end

  namespace :ci do
    desc "Run Jasmine CI for CoffeeScripts"
    task :coffee do
      Rake::Task['jasmine:compile'].invoke
      Rake::Task['jasmine:ci'].invoke
    end
  end

  desc "Run Jasmine for CoffeeScripts"
  task :coffee do 
    Rake::Task['jasmine:compile'].invoke
    Rake::Task['jasmine'].invoke
  end
end
