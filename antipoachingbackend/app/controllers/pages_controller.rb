class PagesController < ApplicationController
  def index
    @report = PoachingReport.new
  end
end
