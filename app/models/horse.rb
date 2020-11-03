class Horse < ApplicationRecord
  has_many :rides
  has_many :reports
  has_many :bookings, through: :rides

  def has_ride_on_day?(day)
    !bookings.where("start_time::date = ?", day).empty?
  end

  def bookings_by_day(day)
    bookings.where("start_time::date = ?", day)
  end

  def rides_by_day(day)
    rides.joins(:booking).where("start_time::date = ?", day)
  end
end
