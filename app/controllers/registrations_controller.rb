# frozen_string_literal: true

require "ostruct"

class RegistrationsController < ApplicationController
  def new
    @registration = OpenStruct.new(username: FFaker::Name.first_name)
  end
end
