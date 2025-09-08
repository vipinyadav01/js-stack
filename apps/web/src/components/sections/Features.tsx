export function Features() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Fast Setup</h3>
              <p className="text-gray-600">Get your project running in seconds</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Modern Stack</h3>
              <p className="text-gray-600">Latest technologies and best practices</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Customizable</h3>
              <p className="text-gray-600">Choose your preferred tools and frameworks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
