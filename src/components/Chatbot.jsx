import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbot = ({ isOpen, onClose, initialMessage = '' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialMessage && !messages.length) {
      setInput(initialMessage);
      // Auto send the initial message after a short delay
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 500);
    }
  }, [isOpen, initialMessage]);

  const handleSendMessage = async (messageText = null) => {
    const messageToSend = messageText || input;
    if (!messageToSend.trim() || isLoading) {
      return;
    }

    const userMessage = { text: messageToSend, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          maxOutputTokens: 700,
          temperature: 0.8,
          topP: 0.9,
          topK: 20
        }
      });
      
      const prompt = `Khắc kỷ: ${messageToSend}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = { 
        text: text, 
        sender: 'bot', 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        text: 'Xin lỗi, tôi gặp lỗi khi xử lý câu hỏi của bạn. Vui lòng thử lại sau.', 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ zIndex: 9999 }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          onClick={onClose}
        />

        {/* Chat Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="position-relative w-100"
          style={{ maxWidth: '900px', maxHeight: '85vh' }}
        >
          <div className="border-0 shadow-2xl rounded-2xl overflow-hidden"
               style={{ 
                 background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 50%, rgba(15, 23, 42, 0.98) 100%)',
                 border: '1px solid rgba(255, 255, 255, 0.05)',
                 boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.02)'
               }}>
            {/* Header */}
            <div className="p-4 border-bottom" style={{ 
              background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="rounded-circle p-3 me-3 shadow-lg" style={{
                    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.9) 0%, rgba(71, 85, 105, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-robot text-gray-300 fs-4"></i>
                  </div>
                  <div>
                    <h4 className="text-white fw-bold mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>AI Khắc kỷ</h4>
                    <small className="text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>Chuyên gia về triết học cổ đại</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white position-relative overflow-hidden"
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                ></button>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4" style={{ 
              height: '60vh', 
              overflowY: 'auto',
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.3) 100%)'
            }}>
              {messages.length === 0 ? (
                <div className="text-center py-5">
                  <div className="rounded-circle d-inline-block mb-4 shadow-lg" style={{
                    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.9) 0%, rgba(71, 85, 105, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-robot text-gray-300" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <h3 className="text-white fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Xin chào!</h3>
                  <p className="text-gray-300 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Tôi có thể giúp bạn tìm hiểu về Chủ nghĩa Khắc kỷ và cách áp dụng vào cuộc sống hiện đại.
                  </p>
                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    {["Khắc kỷ là gì?", "Cách thực hành?", "Marcus Aurelius?"].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion)}
                        className="btn btn-outline-light btn-sm px-4 py-2 rounded-pill"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#ffffff',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-3`}
                  >
                    <div className={`d-flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`} style={{ maxWidth: '80%' }}>
                      {/* Avatar */}
                      <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-primary' 
                          : 'bg-success'
                      }`} style={{ width: '2rem', height: '2rem' }}>
                        {message.sender === 'user' ? (
                          <i className="bi bi-person-fill text-white"></i>
                        ) : (
                          <i className="bi bi-robot text-white"></i>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`rounded-3 px-3 py-2 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-secondary text-white'
                      }`}>
                        <div className="small">
                          {message.sender === 'bot' ? (
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                                ul: ({children}) => <ul className="list-unstyled mb-2">{children}</ul>,
                                ol: ({children}) => <ol className="mb-2">{children}</ol>,
                                li: ({children}) => <li className="mb-1">{children}</li>,
                                strong: ({children}) => <strong className="fw-bold text-info">{children}</strong>,
                                em: ({children}) => <em className="fst-italic text-warning">{children}</em>,
                                code: ({children}) => <code className="bg-dark px-1 py-0 rounded text-white">{children}</code>,
                                blockquote: ({children}) => <blockquote className="border-start border-info border-3 ps-3 fst-italic text-muted">{children}</blockquote>
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                          ) : (
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                          )}
                        </div>
                        <small className={`text-muted ${
                          message.sender === 'user' ? 'text-white-50' : 'text-white-50'
                        }`}>
                          {message.timestamp.toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </small>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="d-flex justify-content-start"
                  >
                    <div className="d-flex gap-3">
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '2rem', height: '2rem' }}>
                        <i className="bi bi-robot text-white"></i>
                      </div>
                      <div className="bg-secondary rounded-3 px-3 py-2 shadow-sm">
                        {streamingText ? (
                          <div className="small text-white">
                            {streamingText}
                            <span className="text-info">|</span>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center gap-2">
                            <div className="spinner-border spinner-border-sm text-info" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <small className="text-white-50">Đang suy nghĩ...</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

            {/* Input Area */}
            <div className="p-4" style={{ 
              background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div className="d-flex gap-2" style={{ position: 'relative', zIndex: 10 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hỏi tôi về Chủ nghĩa Khắc kỷ..."
                  className="form-control text-white flex-grow-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    padding: '12px 16px',
                    outline: 'none'
                  }}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked!', { input, isLoading });
                    handleSendMessage();
                  }}
                  disabled={!input.trim() || isLoading}
                  style={{
                    background: !input.trim() || isLoading 
                      ? 'rgba(51, 65, 85, 0.5)' 
                      : 'linear-gradient(135deg, rgba(51, 65, 85, 0.9) 0%, rgba(71, 85, 105, 0.9) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    color: !input.trim() || isLoading ? '#64748b' : '#e2e8f0',
                    fontWeight: '600',
                    cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '60px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!(!input.trim() || isLoading)) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(!input.trim() || isLoading)) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <i className="bi bi-send"></i>
                  )}
                </button>
              </div>
              
              {/* API Key Notice */}
              {!import.meta.env.VITE_GEMINI_API_KEY && (
                <div className="alert alert-warning alert-dismissible fade show mt-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Thêm VITE_GEMINI_API_KEY vào file .env
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;