const OrderFilters = () => {
  return (
    <div className=" px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-white border-gray-200 px-6 py-6 rounded-lg">
        <div>
          <label
            htmlFor="order-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Order Type
          </label>
          <select
            id="order-type"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option>All Orders</option>
            <option>Store Order</option>
            <option>Shop Order</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Failed</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="date-range"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date Range
          </label>
          <input
            type="text"
            id="date-range"
            placeholder="mm/dd/yyyy"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by user, service, order ID..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
