# frozen_string_literal: true

# Source: https://github.com/rails/rails/blob/7-1-stable/activerecord/lib/rails/generators/active_record/model/templates/model.rb.tt
class ::User < ApplicationRecord
  include PasskeysRails::Authenticatable

  has_many :posts, dependent: :destroy

  def registering_with(params)
    self.name = params[:username]

    nil
  end
end
