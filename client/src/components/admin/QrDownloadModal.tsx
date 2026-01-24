type Props = {
  open: boolean;
  qrImage: string;
  table: string;
  onClose: () => void;
};

const QrDownloadModal: React.FC<Props> = ({
  open,
  qrImage,
  table,
  onClose,
}) => {
  if (!open) return null;

  const downloadQr = () => {
    const a = document.createElement("a");
    a.href = qrImage; // qrImage is already Base64
    a.download = `${table}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 text-center">
        <h2 className="text-lg font-bold mb-4">QR for {table}</h2>

        <img src={qrImage} className="w-40 h-40 mx-auto mb-4" />

        <div className="flex gap-3 justify-center">
          <button
            onClick={downloadQr}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrDownloadModal;
