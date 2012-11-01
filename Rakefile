#!/usr/bin/env rake
begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end
begin
  require 'rdoc/task'
rescue LoadError
  require 'rdoc/rdoc'
  require 'rake/rdoctask'
  RDoc::Task = Rake::RDocTask
end

RDoc::Task.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'TinymceRailsConfigManager'
  rdoc.options << '--line-numbers'
  rdoc.rdoc_files.include('README.rdoc')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

Bundler::GemHelper.install_tasks

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
