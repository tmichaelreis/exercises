# Problem 2 from Interview Cake
# (https://www.interviewcake.com)

# Given an array of integers, find the product of every integer
# except the integer at that index.

# Use specific input:
# ruby get_products_of_all_ints_except_at_index.rb input

# Use randomly generated array:
# ruby get_products_of_all_ints_except_at_index.rb


def get_products_of_all_ints_except_at_index(arr)
  arr_length = arr.length

  products_before = [1]
  products_after = Array.new(arr_length + 1){ 1 }

  product_array = []

  (0..arr_length - 2).each do |i|
    products_before << arr[i] * products_before[i]

    products_after[arr_length - 2 - i] = arr[arr_length - 1 - i] * products_after[arr_length - 1 - i]
  end

  (0..arr_length - 1).each do |i|
    product_array << products_before[i] * products_after[i]
  end

  product_array
end

def get_args_as_array
  args = []

  ARGV.each do |arg|
    args << arg.to_i
  end

  args
end

def test_method_result
  (get_products_of_all_ints_except_at_index([1, 2, 6, 5, 9]) == [540, 270, 90, 108, 60]).to_s
end

input_array = get_args_as_array

if input_array.length == 0
  input_array = Array.new(1000){ Random.rand(1...99) }
end

t1 = Time.now
output = get_products_of_all_ints_except_at_index(input_array)
puts output
t2 = Time.now

puts "Test passed? " + test_method_result
puts "Time elapsed: " + (t2 - t1).to_s
