require "rails_helper"

RSpec.describe "users/edit" do
  let(:user) do
    User.create!(
      name: "MyString"
    )
  end

  before do
    assign(:user, user)
  end

  it "renders the edit user form" do
    render

    assert_select "form[action=?][method=?]", user_path(user), "post" do
      assert_select "input[name=?]", "user[name]"
    end
  end
end
