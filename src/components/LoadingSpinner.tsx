export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-slate-900 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}
