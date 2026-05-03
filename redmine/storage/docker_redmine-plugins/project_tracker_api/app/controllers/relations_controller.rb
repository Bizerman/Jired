# app/controllers/relations_controller.rb
class RelationsController < ApplicationController
  before_action :require_admin
  accept_api_auth :create

  def create
    issue = Issue.find(params[:relation][:issue_id])
    issue_to = Issue.find(params[:relation][:issue_to_id])
    relation_type = params[:relation][:relation_type]

    relation = IssueRelation.new(
      issue_from: issue,
      issue_to: issue_to,
      relation_type: relation_type
    )

    if relation.save
      render json: { relation: relation }, status: :created
    else
      render json: { errors: relation.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.message }, status: :not_found
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end