'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap');
      `}</style>

      <div
        className="flex flex-col items-center h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/RollupRadar/project23/main/images/tappo2.svg')`,
          backgroundSize: 'contain', // Ensures the image fits within the screen width
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {/* Transparent Text Section */}
        <div className="flex flex-col items-center w-full text-white mt-auto mb-10 bg-opacity-75">
          <p className="text-3xl mb-2 shadow-lg">
            <Link
              href="/clicker"
              className="text-4xl font-bold text-transparent bg-clip-text relative hover"
              style={{
                fontFamily: 'ZCOOL KuaiLe, sans-serif',
                backgroundImage: 'linear-gradient(90deg, #FFFFFF, #0ECBFF)',
              }}
            >
              START
              <span className="absolute inset-0 bg-white opacity-30 blur-md" />
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
