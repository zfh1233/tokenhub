import UploadForm from '../components/tutorial/UploadForm';

const UploadTutorial = () => (
  <div className="min-h-screen bg-surface">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">上传教程</h1>
      <UploadForm />
    </div>
  </div>
);

export default UploadTutorial;
