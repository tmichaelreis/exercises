# Problem 2 from Interview Cake
# (https://www.interviewcake.com)

# Given yesterday's stock prices, find the largest profit
# that can be made by buying then selling (no shorting)

# Use: ruby maximize_yesterday_stock.rb price1 price2 price3 ...

def init(args)
  stock_array = []

  args.each do |price|
    stock_array << price.to_i
  end

  stock_array
end

def get_max_profit(stock_array)

  best = {
    profit: 0,
    buy_price: 0,
    sell_price: 0
  }

  for i in (0..stock_array.length-2)
    new_best = max_at_step(i, stock_array)

    if new_best[:profit] > best[:profit]
      best = new_best
    end
  end

  puts "sell: $" + best[:sell_price].to_s
  puts "buy: $" + best[:buy_price].to_s
end

def max_at_step(index, array)
  i = index

  step_group = {
    profit: 0
  }

  while i < array.length - 1
    profit = array[i + 1] - array[index]

    if profit >step_group[:profit]
      step_group[:profit] = profit
      step_group[:buy_price] = array[index]
      step_group[:sell_price] = array[i + 1]
    end

    i += 1
  end

  return step_group
end

stocks = init(ARGV)
puts get_max_profit(stocks)
