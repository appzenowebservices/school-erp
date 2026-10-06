"use client";
import { useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import SignatureUploadViewer from "./SignatureUploadViewer";

export default function SignatureUploadModal({
  open,
  onClose,
  selectedStaff,
}) {
  const [show, setShow] = useState(open);

  // Sync internal state with parent
  if (show !== open) setShow(open);

  if (!show) return null;

  // const renderDocCard = (label, key, fileUrl) => (
  return (
    <>

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 relative">

          <SignatureUploadViewer
            staffDetail={selectedStaff}
            onClose={onClose}
            // setShow={setSignatureUrl}  // ← Pass state setter to close modal
            // onClose={() => setSignatureUrl(null)}  // ← OR callback

          />

        </div>
      </div>
    </>
  );

}
