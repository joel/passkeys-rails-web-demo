require "rails_helper"

RSpec.describe "posts/index" do
  before do
    assign(:posts, [
             Post.create!(
               title: "Title",
               body: "MyText",
               user: nil
             ),
             Post.create!(
               title: "Title",
               body: "MyText",
               user: nil
             )
           ])
  end

  it "renders a list of posts" do
    render
    cell_selector = "div>p"
    assert_select cell_selector, text: Regexp.new("Title".to_s), count: 2
    assert_select cell_selector, text: Regexp.new("MyText".to_s), count: 2
    assert_select cell_selector, text: Regexp.new(nil.to_s), count: 2
  end
end
