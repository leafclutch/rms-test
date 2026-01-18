import { useState } from "react";
import TableSelector from "../../components/admin/TableSelector";
import QrDownloadModal from "../../components/admin/QrDownloadModal";
import FullscreenLoader from "../../components/common/FullscreenLoader";
import { generateQrApi } from "../../api/admin";
import { BASE_URL } from "../../api/axios";

const GenerateQr = () => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [table, setTable] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTableSelect = async (tableCode: string) => {
    try {
      setLoading(true);

      const data = await generateQrApi(tableCode);

      setTable(tableCode);
      setQrImage(`${BASE_URL}${data.table.qrImage}`);
      setOpen(true);
    } catch {
      alert("QR generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-6">
      {loading && <FullscreenLoader text="Generating QR code..." />}

      <h1 className="text-xl font-bold mb-6">Generate Table QR</h1>

      <TableSelector mode="admin" onSelect={handleTableSelect} />

      {qrImage && (
        <QrDownloadModal
          open={open}
          qrImage={qrImage}
          table={table}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default GenerateQr;
