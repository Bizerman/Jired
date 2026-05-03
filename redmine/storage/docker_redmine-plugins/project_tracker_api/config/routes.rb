RedmineApp::Application.routes.draw do
  post '/projects/:project_id/trackers/:tracker_id(.:format)', to: 'project_trackers#create', constraints: { format: /(json|xml)/, project_id: /\d+/, tracker_id: /\d+/ }
  post '/issue_priorities(.:format)', to: 'issue_priorities#create', constraints: { format: /(json|xml)/ }
  post '/workflows(.:format)', to: 'workflows#create', constraints: { format: /(json|xml)/ }
  post '/relations(.:format)', to: 'relations#create', constraints: { format: /(json|xml)/ }
end