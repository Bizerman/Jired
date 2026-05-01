# config/routes.rb
RedmineApp::Application.routes.draw do
  post '/projects/:project_id/trackers/:tracker_id(.:format)', to: 'project_trackers#create', constraints: { format: /(json|xml)/, project_id: /\d+/, tracker_id: /\d+/ }
end