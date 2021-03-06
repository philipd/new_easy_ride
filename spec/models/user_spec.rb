require 'rails_helper'

RSpec.describe User, type: :model do
  it 'should fail if the email is already used' do
    User.create(first_name: 'first', last_name: 'last', email: 'EMAIL@email.com', password: 'password')
    @user = User.new(
      first_name: 'first name', last_name: 'last name', email: 'email@email.com', password: 'password')
    expect { @user.save! }.to raise_error(ActiveRecord::RecordInvalid)
    expect(@user.errors.full_messages).to eq ['Email has already been taken']
    # expect(@user.errors.full_messages).to eq ['Password can\'t be blank']
  end

  it 'should fail if email is not provided' do
    @user = User.new(
      first_name: 'first name', last_name: 'last name', email: nil, password: 'password')
    expect { @user.save! }.to raise_error(ActiveRecord::RecordInvalid)
    expect(@user.errors.full_messages).to eq ['Email can\'t be blank']
    # expect(@user.errors.full_messages).to eq ['Password can\'t be blank']
  end

end
