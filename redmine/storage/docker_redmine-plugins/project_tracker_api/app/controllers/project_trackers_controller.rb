# app/controllers/project_trackers_controller.rb
class ProjectTrackersController < ApplicationController
  before_action :require_admin
  accept_api_auth :create

  def create
    project = Project.find(params[:project_id])
    tracker = Tracker.find(params[:tracker_id])

    if project.trackers.include?(tracker)
      render json: { message: 'Tracker already assigned' }, status: :ok
      return
    end

    project.trackers << tracker
    project.save!

    render json: { message: 'Tracker added to project' }, status: :created
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.message }, status: :not_found
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end