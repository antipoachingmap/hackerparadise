class PoachingReportsController < ApplicationController
  before_action :set_poaching_report, only: [:show, :edit, :update, :destroy]

  # GET /poaching_reports
  # GET /poaching_reports.json
  def index
    @poaching_reports = PoachingReport.all
  end

  # GET /poaching_reports/1
  # GET /poaching_reports/1.json
  def show
  end

  # GET /poaching_reports/new
  def new
    @poaching_report = PoachingReport.new
  end

  # GET /poaching_reports/1/edit
  def edit
  end

  # POST /poaching_reports
  # POST /poaching_reports.json
  def create

    skip_before_action :verify_authenticity_token

    @poaching_report = PoachingReport.new(poaching_report_params)

    respond_to do |format|
      if @poaching_report.save
        format.html { redirect_to @poaching_report, notice: 'Poaching report was successfully created.' }
        format.json { render :show, status: :created, location: @poaching_report }
      else
        format.html { render :new }
        format.json { render json: @poaching_report.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /poaching_reports/1
  # PATCH/PUT /poaching_reports/1.json
  def update
    respond_to do |format|
      if @poaching_report.update(poaching_report_params)
        format.html { redirect_to @poaching_report, notice: 'Poaching report was successfully updated.' }
        format.json { render :show, status: :ok, location: @poaching_report }
      else
        format.html { render :edit }
        format.json { render json: @poaching_report.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poaching_reports/1
  # DELETE /poaching_reports/1.json
  def destroy
    @poaching_report.destroy
    respond_to do |format|
      format.html { redirect_to poaching_reports_url, notice: 'Poaching report was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_poaching_report
      @poaching_report = PoachingReport.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def poaching_report_params
      params[:poaching_report].permit(:latitude, :longitude, :location, :species, :victim_count, :event_datetime, :description)
    end
end
