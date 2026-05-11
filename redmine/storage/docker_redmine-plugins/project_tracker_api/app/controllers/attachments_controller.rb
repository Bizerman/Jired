class AttachmentsController < ApplicationController
  accept_api_auth :create

  def create
    file = params[:file]
    unless file
      render json: { error: 'No file provided' }, status: :unprocessable_entity
      return
    end

    attachment = Attachment.new(
      file: file,
      author: User.current,
      container_type: nil,
      container_id: nil,
      description: params[:description].to_s
    )

    if attachment.save
      render json: {
        upload: {
          token: attachment.token,
          filename: attachment.filename,
          content_type: attachment.content_type,
          filesize: attachment.filesize
        }
      }, status: :created
    else
      render json: { errors: attachment.errors.full_messages }, status: :unprocessable_entity
    end
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end
end