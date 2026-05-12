# frozen_string_literal: true

module RedmineExtendedApi
  module Patches
    module AttachmentsControllerPatch
      extend ActiveSupport::Concern

      included do
        accept_api_auth :upload
        accept_api_auth :download
        accept_api_auth :destroy
      end

      def upload
        file = params[:file]
        unless file
          render json: { error: 'No file provided' }, status: :unprocessable_entity
          return
        end

        @attachment = Attachment.new(
          file: file,
          author: User.current,
          container: nil
        )
        @attachment.filename = file.original_filename
        @attachment.content_type = file.content_type || 'application/octet-stream'

        if @attachment.save
          respond_to do |format|
            format.js
            format.json { render json: { upload: { token: @attachment.token, filename: @attachment.filename, content_type: @attachment.content_type, filesize: @attachment.filesize } } }
          end
        else
          respond_to do |format|
            format.js
            format.json { render json: { errors: @attachment.errors.full_messages }, status: :unprocessable_entity }
          end
        end
      end

      def download
        if @attachment = Attachment.find(params[:id])
          if @attachment.visible? && @attachment.readable?
            send_file @attachment.diskfile, filename: @attachment.filename, type: @attachment.content_type, disposition: 'attachment'
          else
            render_403
          end
        else
          render_404
        end
      end

      # Удаление с поддержкой JSON
      def destroy
        @attachment = Attachment.find(params[:id])
        if @attachment.container.attachments.delete(@attachment)
          respond_to do |format|
            format.json { render json: { success: true } }
            format.js
          end
        else
          respond_to do |format|
            format.json { render json: { errors: @attachment.errors.full_messages }, status: :unprocessable_entity }
            format.js
          end
        end
      end
    end
  end
end