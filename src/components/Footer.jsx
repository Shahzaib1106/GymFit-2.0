export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 sm:flex-row sm:items-center lg:px-8">
        <div>
          <p className="text-xl font-black">
            GYM<span className="text-orange-500">FIT</span>
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Your fitness. Your journey. Your transformation.
          </p>
        </div>

        <p className="text-xs text-gray-600">
          © 2026 GymFit 2.0. All rights reserved.
        </p>
      </div>
    </footer>
  );
}