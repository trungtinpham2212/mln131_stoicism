import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Chatbot from './components/Chatbot';
import { MessageCircle, Brain, Sparkles, ArrowRight } from 'lucide-react';

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div 
      className="min-h-screen w-full relative text-white overflow-x-hidden"
      style={{
        background:
         "radial-gradient(70% 55% at 50% 50%, #2a5d77 0%, #184058 18%, #0f2a43 34%, #0a1b30 50%, #071226 66%, #040d1c 80%, #020814 92%, #01040d 97%, #000309 100%), radial-gradient(160% 130% at 10% 10%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%), radial-gradient(160% 130% at 90% 90%, rgba(0,0,0,0) 38%, #000309 76%, #000208 100%)"
      }}
    >
      {/* Philosopher Image - Bottom Right */}
      <motion.div 
        className="fixed pointer-events-none"
        style={{ 
          zIndex: 5,
          bottom: '0',
          right: '0.2rem'
        }}
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 0.6, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
      >
          <img 
            src="/images/zeno.png" 
            alt="Ancient Philosopher"
          className="w-64 h-80 object-cover object-center rounded-tl-3xl"
          style={{
            filter: 'sepia(0.3) contrast(1.1) brightness(0.8)',
            transform: 'perspective(1000px) rotateY(-3deg) rotateX(1deg)'
          }}
        />
      </motion.div>

      {/* Philosopher Image - Bottom Left */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{ 
          zIndex: 1,
          bottom: '0',
          left: '0.4rem'
        }}
        initial={{ opacity: 0, x: -50, y: 50 }}
        animate={{ opacity: 0.45, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
      >
            <img 
              src="/images/marcus.png" 
              alt="Ancient Philosopher"
            className="w-64 h-80 object-cover object-center rounded-tr-3xl"
            style={{
              filter: 'sepia(0.3) contrast(1.1) brightness(0.8)',
              transform: 'perspective(1000px)'
            }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
           
            <div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent" style={{
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '-0.01em'
              }}>
                StoicWisdom
              </h1>
              <p className="text-gray-400 text-sm md:text-base" style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: '500'
              }}>AI Chatbot về Chủ nghĩa Khắc kỷ</p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[12rem] font-bold text-white mb-6" style={{ 
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.02em',
              lineHeight: '1.1'
            }}>
              Khám phá sự khôn ngoan cổ đại
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed" style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: '400',
              letterSpacing: '0.01em'
            }}>
              Hỏi AI về Chủ nghĩa Khắc kỷ và nhận được câu trả lời thông minh, 
              dựa trên triết học của các bậc thầy cổ đại.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            onClick={() => setIsChatbotOpen(true)}
            className="btn btn-primary px-4 py-3 rounded-pill fw-bold text-uppercase position-relative overflow-hidden border-0 shadow-lg my-4"
            style={{
              background: 'linear-gradient(45deg,rgb(42, 51, 95) 0%,rgb(49, 32, 67) 100%)',
              fontSize: '0.95rem',
              minWidth: '250px',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)'
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(45deg,rgb(58, 37, 78) 0%,rgb(36, 44, 81) 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(45deg,rgb(29, 30, 31) 0%,rgb(28, 23, 58) 100%)';
            }}
          >
            {/* Shimmer effect */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateX(100%)';
              }}
            ></div>
            
            {/* Button content */}
            <div className="d-flex align-items-center justify-content-center gap-3 position-relative">
              <i className="bi bi-chat-dots-fill fs-4"></i>
              <span>Trò chuyện với AI</span>
              <i className="bi bi-arrow-right fs-5"></i>
            </div>
          </motion.button>

          {/* Features */}
          <motion.div
            className="row g-4 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { icon: "bi-robot", title: "AI Thông minh" },
              { icon: "bi-book", title: "Tri thức sâu"},
              { icon: "bi-chat-heart", title: "Trò chuyện tự nhiên"}
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="col-md-4"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card bg-transparent border-0 text-center h-100">
                  <div className="card-body d-flex flex-column justify-content-center">
                    <div className="mb-3">
                      <i className={`bi ${feature.icon} text-primary`} style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title text-white fw-bold mb-2" style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.25rem'
                    }}>{feature.title}</h5>
                  
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  );
}

export default App;