# Source: https://github.com/rails/rails/blob/v7.1.2/activerecord/lib/rails/generators/active_record/migration/templates/create_table_migration.rb.tt
#
# This template comes from your local project under lib/rails/generators/active_record/migration/templates/create_table_migration.rb.tt.
# It is based on Rails 7.1. If your Rails version diverges, please note that the generator is outdated, and changes might be made.
#
class CreatePosts < ActiveRecord::Migration[8.0]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :body
      t.references :user, foreign_key: true, index: true, null: false

      t.timestamps
    end
  end
end
