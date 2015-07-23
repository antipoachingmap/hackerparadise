class CreatePoachingReports < ActiveRecord::Migration
  def change
    create_table :poaching_reports do |t|

      t.string :raw_sms

      t.float :latitude
      t.float :longitude
      t.string :location

      t.string :species
      t.integer :victim_count

      t.datetime :event_datetime

      t.string :description

      t.text :photos, array: true, default:[]

      t.datetime :submission_datetime

      t.string :submission_channel

      t.boolean :is_clean
      t.integer :cleaned_by
      t.boolean :locked

      t.timestamps null: false
    end
  end
end
