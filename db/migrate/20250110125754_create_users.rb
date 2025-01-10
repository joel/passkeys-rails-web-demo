# Source: https://github.com/rails/rails/blob/v7.1.2/activerecord/lib/rails/generators/active_record/migration/templates/create_table_migration.rb.tt
#
# This template comes from your local project under lib/rails/generators/active_record/migration/templates/create_table_migration.rb.tt.
# It is based on Rails 7.1. If your Rails version diverges, please note that the generator is outdated, and changes might be made.
#
class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name

      t.timestamps
    end
  end
end
