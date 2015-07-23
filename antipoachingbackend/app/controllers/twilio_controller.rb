require 'twilio-ruby'

class TwilioController < ApplicationController
  include Webhookable

  after_filter :set_header

  skip_before_action :verify_authenticity_token

  def sms
    @account_sid = ENV["TWILIO_SID"]
    @auth_token = ENV["TWILIO_AUTH"]

    @client = Twilio::REST::Client.new(@account_sid, @auth_token)
    @account = @client.accounts.get(@account_sid)

    if !params.has_key?(:From) || !params.has_key?(:Body)
      render status: 400, json: {reason: 'No from or body param'}.to_json
      return
    end


    report = PoachingReport.create do |report|

      msg = params["Body"]
      eventParts = msg.split(',')

      if (eventParts.length >= 3)

        report.latitude, report.longitude = eventParts[0].split(' ')

        report.victim_count, report.species = eventParts[1].split(' ')

        report.description = eventParts[2]
      end

      report.raw_sms = params["Body"]
      report.is_clean = false
      report.sms_number = params["From"]



    end

    @account.messages.create(
        from: '+12562724563',
        to: params["From"],
        body: 'Thank you for reporting this poaching incident'
    )

    render status: 200, json: report.to_json

  end

end
