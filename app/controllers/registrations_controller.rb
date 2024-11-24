# frozen_string_literal: true

require "ostruct"

class RegistrationsController < ApplicationController
  def new
    username = FFaker::Name.first_name
    @registration = OpenStruct.new(username:, nickname: "#{username}'s Security Key")
  end

  def create
    respond_to do |format|
      format.json do
        render json: { message: "Registration successful" }
      end
    end
  end
end
