# init.rb
require 'redmine'

Redmine::Plugin.register :project_tracker_api do
  name 'Project Tracker API'
  author 'Your Name'
  description 'Adds an API endpoint to assign a tracker to a project'
  version '1.0.0'
end