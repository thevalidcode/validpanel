interface LivePreviewProps {
  storeName: string;
  brandColor: string;
  domain: string;
  logoUrl: string;
  useCustomDomain: boolean;
}

function LivePreview({
  storeName,
  brandColor,
  logoUrl,
  domain,
  useCustomDomain,
}: LivePreviewProps) {
  return (
    <div className="bg-white shadow rounded-[4px] p-6 h-fit">
      <h3 className="font-semibold mb-3 text-center sm:text-left">
        Live Preview
      </h3>
      <div className="border-2 border-gray-100 flex flex-col p-4 rounded-[4px]">
        <div className="flex items-center mb-4 justify-between flex-wrap gap-2">
          <div className="flex items-center">
            <div
              className="w-6 h-6 rounded-[4px] mr-2 flex items-center justify-center"
              style={{ backgroundColor: brandColor }}
            >
              <img
                src={logoUrl || "/Prev_shop.svg"}
                alt="icon"
                className="w-3 h-3"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800 truncate max-w-[150px]">
                {storeName || "My Store"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {useCustomDomain
                  ? domain
                  : `${domain || "mystore"}.validpanel.com`}
              </p>
            </div>
          </div>
          <img src="/Cart.svg" alt="cart" className="w-5 h-5" />
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-gray-200 p-3 rounded-[4px] bg-[#F3F4F6] w-[48%] sm:w-[45%] text-center"
            >
              <img src="/Preview.svg" alt="product" className="mx-auto" />
              <p className="text-xs text-black mt-1">Product {i}</p>
              <p className="text-xs text-purple-500 font-bold">$29.99</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="w-full text-white py-2 rounded-[4px] text-sm sm:text-base transition"
          style={{ backgroundColor: brandColor }}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default LivePreview;
