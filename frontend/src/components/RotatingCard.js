import React, { useState } from 'react';

const RotatingCard = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`relative w-72 h-56 perspective group cursor-pointer`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{ perspective: '1200px' }}
    >
      <div
        className={`absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? 'rotate-y-180' : ''}`}
      >
        <div className="absolute w-full h-full bg-white/90 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-green-300 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 rotate-y-180 [backface-visibility:hidden]">
          {back}
        </div>
      </div>
    </div>
  );
};

export default RotatingCard;
