import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import RotatingCard from '../components/RotatingCard';


const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl bg-white/90 rounded-2xl shadow-xl flex flex-col md:flex-row items-center p-6 md:p-8 mb-10">
          {/* Main content row: text and rotating card */}
          <div className="flex-1 flex flex-col items-start justify-center mb-8 md:mb-0 md:mr-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4 leading-tight">Your Health, Our Priority</h1>
            <p className="text-base md:text-lg text-gray-700 mb-6">Book appointments, connect with doctors online or in-person, and manage your health easily.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
                onClick={() => navigate('/choose-login')}
              >
                Login
              </button>
              <button
                className="w-full sm:w-auto bg-white border-2 border-blue-500 text-blue-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all"
                onClick={() => navigate('/choose-register')}
              >
                Register
              </button>
            </div>
          </div>
          {/* Rotating Card Carousel RIGHT SIDE */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {(() => {
              const cards = [
                {
                  front: (
                    <div className="flex flex-col items-center">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#42a5f5"/></svg>
                      <h3 className="text-lg font-bold text-blue-700 mt-2">Book Instantly</h3>
                      <p className="text-gray-600 mt-1">Find doctors and book appointments in seconds.</p>
                    </div>
                  ),
                  back: (
                    <div className="flex flex-col items-center">
                      <span className="text-blue-700 font-bold text-xl mb-2">Fast Booking</span>
                      <p className="text-white text-center">Our platform lets you book appointments with top doctors in just a few clicks. No waiting, no hassle.</p>
                    </div>
                  )
                },
                {
                  front: (
                    <div className="flex flex-col items-center">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 13h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0H7v-2h2v2z" fill="#26c6da"/></svg>
                      <h3 className="text-lg font-bold text-blue-700 mt-2">Telemedicine</h3>
                      <p className="text-gray-600 mt-1">Video consults with specialists from home.</p>
                    </div>
                  ),
                  back: (
                    <div className="flex flex-col items-center">
                      <span className="text-blue-700 font-bold text-xl mb-2">Remote Care</span>
                      <p className="text-white text-center">Connect with doctors via secure video calls. Get expert advice and prescriptions without leaving your home.</p>
                    </div>
                  )
                },
                {
                  front: (
                    <div className="flex flex-col items-center">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#81c784"/></svg>
                      <h3 className="text-lg font-bold text-blue-700 mt-2">In-Person Visits</h3>
                      <p className="text-gray-600 mt-1">Visit clinics with real-time directions and info.</p>
                    </div>
                  ),
                  back: (
                    <div className="flex flex-col items-center">
                      <span className="text-blue-700 font-bold text-xl mb-2">Clinic Access</span>
                      <p className="text-white text-center">Easily find clinics, get directions, and check in for your appointments with ease.</p>
                    </div>
                  )
                }
              ];
              const [active, setActive] = React.useState(0);
              useEffect(() => {
                const timer = setInterval(() => setActive(a => (a + 1) % cards.length), 3500);
                return () => clearInterval(timer);
              }, []);
              return (
                <div className="flex flex-col items-center justify-center" style={{minHeight:'230px'}}>
                  <div className="transition-all duration-700" style={{width:'260px',height:'200px'}}>
                    <RotatingCard front={cards[active].front} back={cards[active].back} />
                  </div>
                  <div className="flex flex-row gap-2 mt-2">
                    {cards.map((_, idx) => (
                      <button key={idx} className={`w-2.5 h-2.5 rounded-full ${active===idx?'bg-blue-500':'bg-gray-300'} transition-all`} onClick={()=>setActive(idx)} aria-label={`Show card ${idx+1}`}></button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-center text-center">
            <div className="mb-3">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#42a5f5"/></svg>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Book Online</h3>
            <p className="text-gray-600">Find doctors and book appointments instantly.</p>
          </div>
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-center text-center">
            <div className="mb-3">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 13h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0H7v-2h2v2z" fill="#26c6da"/></svg>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">Telemedicine</h3>
            <p className="text-gray-600">Join secure video calls for remote consultations.</p>
          </div>
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col items-center text-center">
            <div className="mb-3">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="#81c784"/></svg>
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">In-Person Visits</h3>
            <p className="text-gray-600">Visit clinics with real-time directions and info.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

