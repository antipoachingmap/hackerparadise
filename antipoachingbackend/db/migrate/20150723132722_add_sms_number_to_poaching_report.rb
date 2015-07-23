class AddSmsNumberToPoachingReport < ActiveRecord::Migration
  def change
    add_column :poaching_reports, :sms_number, :string
  end
end
