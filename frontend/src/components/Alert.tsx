import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Alert = ({ message, type, onClose }: AlertProps) => {
  const colors = {
    success: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:text-green-200',
    error: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`border rounded-lg p-4 flex items-center gap-3 animate-in ${colors[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-sm font-semibold hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};
