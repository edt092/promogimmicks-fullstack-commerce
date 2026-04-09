export default function GoldenShimmerText() {
  return (
    <div className="relative pt-4 pb-8 flex justify-center">
      {/* Glow sweep - now blue */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30 blur-2xl">
        <div className="golden-glow-sweep absolute inset-y-0 w-1/2" />
      </div>

      <div className="relative text-center">
        <span className="golden-shimmer-100 text-6xl md:text-7xl lg:text-8xl font-extrabold">
          100%
        </span>
        <p className="golden-shimmer-personalizable text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
          Personalizable
        </p>
      </div>
    </div>
  );
}
