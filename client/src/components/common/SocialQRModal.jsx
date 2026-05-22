import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SocialQRModal = ({ isOpen, onClose, socialName }) => {
  if (socialName !== '微信') return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-80 flex flex-col items-center"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-4 text-gray-300 hover:text-gray-500 text-2xl leading-none"
            >
              &times;
            </button>

            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#07C16015' }}>
              <span className="text-2xl">💬</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">微信</h3>
            <p className="text-sm text-gray-400 mb-5">扫码添加微信</p>

            <div className="bg-white p-3 rounded-xl border-2 border-gray-100 mb-4">
              <img src="/wechat-qr.jpg" alt="微信二维码" className="w-[180px] h-[180px] object-contain" />
            </div>

            <div className="w-full bg-gray-50 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-gray-400 mb-1">微信号</p>
              <p className="text-base font-semibold text-gray-800 tracking-wide">rantatech</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const useSocialModal = () => {
  const [state, setState] = useState({ open: false, name: '' });
  const open = (name) => setState({ open: true, name });
  const close = () => setState({ open: false, name: '' });
  return { ...state, open, close };
};

export default SocialQRModal;
