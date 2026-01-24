
const FullscreenLoader = ({ text = "Processing..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl px-8 py-6 shadow-xl flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-slate-700 rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default FullscreenLoader;
