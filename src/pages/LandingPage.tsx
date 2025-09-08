import { Link } from 'react-router-dom';
import backgroundImage from '@/assests/BgImage.webp';
import logo from '@/assests/Logo.jpg';

// Responsive and slightly narrower button
const buttonBaseStyle = `
  w-4/5 max-w-xs py-3 rounded-lg font-semibold text-base
  flex items-center justify-center
  shadow-lg transition-all duration-150 ease-in
  focus:outline-none
`;
const primaryButtonStyle = `
  bg-[#4285F4] text-white
  hover:bg-[#357ae8] active:bg-[#2463c7] border-none
`;
const secondaryButtonStyle = `
  bg-white/90 text-[#4285F4]
  border-2 border-[#4285F4]
  hover:bg-[#f0f6fc] active:bg-[#e3eefa]
`;

const LandingPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'saturate(1.1) brightness(0.93)',
      }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-12 mt-2 w-full">
          <img
            src={logo}
            alt="JeevanDhara Logo"
            className="h-24 w-24 sm:h-28 sm:w-28 mb-5 rounded-full shadow-2xl bg-white/80"
            style={{
              objectFit: 'cover',
              boxShadow: '0 6px 24px rgba(66,133,244,0.22), 0 2px 4px rgba(0,0,0,0.04)'
            }}
          />
          <h1
            style={{
              fontFamily: 'ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace',
              fontWeight: 800,
              fontSize: '2.2rem',
              textShadow: '0 0 16px rgba(34, 86, 49, 0.18)',
              color: '#f3f7f9',
              letterSpacing: '0.06em',
              textAlign: 'center',
              userSelect: 'none',
              marginTop: '0.2em'
            }}
          >
            JeevanDhara
          </h1>
        </div>
        {/* Buttons stacked vertically */}
        <div className="flex flex-col gap-5 items-center w-full">
          <Link to="/signup" className="w-full flex justify-center">
            <button
              className={`${buttonBaseStyle} ${primaryButtonStyle}`}
              type="button"
            >
              Create Account
            </button>
          </Link>
          <Link to="/login" className="w-full flex justify-center">
            <button
              className={`${buttonBaseStyle} ${secondaryButtonStyle}`}
              type="button"
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
