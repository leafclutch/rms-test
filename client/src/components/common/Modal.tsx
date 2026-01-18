type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
  };
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, size = 'md', children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className={`bg-white rounded-xl shadow-lg w-full ${sizeClasses[size]} mx-4`}>
          {title && (
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  