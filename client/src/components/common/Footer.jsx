import SocialQRModal, { useSocialModal } from './SocialQRModal';

const WECHAT_ICON = 'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.133 0 .241-.11.241-.246 0-.06-.023-.118-.039-.177l-.326-1.233a.492.492 0 01.177-.554C23.024 18.076 24 16.944 24 14.834c0-3.252-2.83-5.94-7.062-5.976zM14.53 13.39c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z';

const Footer = () => {
  const socialModal = useSocialModal();

  return (
    <>
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-5">
              <button onClick={() => socialModal.open('微信')} title="微信"
                className="w-9 h-9 rounded-full bg-gray-50 hover:bg-primary-50 flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors cursor-pointer">
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d={WECHAT_ICON} /></svg>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-400">
              <span>🧠 OpenTokenHub — 探索 AI 的无限可能</span>
              <span className="hidden sm:inline">·</span>
              <span>© {new Date().getFullYear()} OpenTokenHub</span>
            </div>
          </div>
        </div>
      </footer>
      <SocialQRModal isOpen={socialModal.open} onClose={socialModal.close} socialName={socialModal.name} />
    </>
  );
};

export default Footer;
