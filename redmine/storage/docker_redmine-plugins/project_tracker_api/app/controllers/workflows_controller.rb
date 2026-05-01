class WorkflowsController < ApplicationController
  before_action :require_admin
  accept_api_auth :create

  def create
    tracker = Tracker.find(params[:tracker_id])

    # Ищем не‑встроенные роли
    roles = Role.where(builtin: 0).to_a

    # Если нет ни одной роли – создаём «Менеджер»
    if roles.empty?
      role = Role.create!(
        name: 'Менеджер',
        assignable: true,
        permissions: [
          :add_project, :edit_project, :manage_members, :manage_versions,
          :view_issues, :add_issues, :edit_issues, :manage_issue_relations,
          :manage_subtasks, :set_issues_private, :set_own_issues_private,
          :view_private_issues, :edit_issue_notes, :edit_own_issue_notes,
          :view_issue_watchers, :add_issue_watchers, :delete_issue_watchers,
          :manage_public_queries, :save_queries, :view_gantt, :view_calendar,
          :log_time, :view_time_entries, :edit_time_entries, :edit_own_time_entries,
          :manage_project_activities
        ]
      )
      roles = [role]
    end

    all_statuses = IssueStatus.all.to_a
    if all_statuses.empty?
      render json: { error: 'No issue statuses in the system.' }, status: :unprocessable_entity
      return
    end

    # Строим все разрешённые переходы для каждой роли
    WorkflowTransition.transaction do
      roles.each do |r|
        all_statuses.each do |old_status|
          all_statuses.each do |new_status|
            next if old_status == new_status
            WorkflowTransition.find_or_create_by!(
              tracker: tracker,
              role: r,
              old_status: old_status,
              new_status: new_status
            )
          end
        end
      end
    end

    render json: { message: "Workflow configured for roles: #{roles.map(&:name).join(', ')}" }, status: :created
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.message }, status: :not_found
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end