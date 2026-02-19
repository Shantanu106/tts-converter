import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader className="animate-spin text-blue-500" size={32} />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};
