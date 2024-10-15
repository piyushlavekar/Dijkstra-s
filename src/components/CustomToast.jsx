import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

const CustomToast = ({ message }) => {
  return (
    <div className="flex items-center justify-between bg-blue-500 text-white p-3 rounded">
      <span>{message}</span>
      <button onClick={() => toast.dismiss()} className="ml-4">
        <FaTimes size={16} />
      </button>
    </div>
  );
};
