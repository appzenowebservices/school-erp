"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  Archive,
  FolderDown,
  Download,
  X
} from "lucide-react";
import { getSessionCache } from "../../../../utils/sessionCache";
import Layout from "../../../../layouts/Layout";
import { getStudentRecordFields } from "../../../../api/student";

// -------------------------------------------------
function getFileIcon(name) {
  if (name.includes("pdf")) return <FileText size={16} />;
  if (name.includes("xls")) return <FileSpreadsheet size={16} />;
  if (name.includes("zip")) return <Archive size={16} />;
  return <FolderDown size={16} />;
}
// -------------------------------------------------

export default function DownloadStudentDataPage() {
  const context = getSessionCache("dashboardContext");
  const config = getSessionCache("dashboardConfig");

  const clientId = context?.session;
  const standards = config?.standards || [];

  // dialog state
  const [open, setOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [format, setFormat] = useState("SOFT COPY");

  // data
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  // -------------------------------------------------
  const menu = [
    {
      name: "Download Students Image",
      needsClass: true,
      sub_menu: [
        {
          name: ".zip",
          format: "SOFT COPY",
          url: `client/download-students-image?id=${clientId}`
        },
        {
          name: ".pdf",
          format: "HARD COPY",
          url: `client/students-photo?id=${clientId}`
        }
      ]
    },
    {
      name: "Proof Reading",
      needsClass: true,
      sub_menu: [
        {
          name: ".pdf",
          format: "HARD COPY",
          url: `client/proof-reading?id=${clientId}`
        },
        {
          name: ".xls",
          format: "SOFT COPY",
          url: `client/proof-reading?id=${clientId}&all_students=true`
        }
      ]
    }
  ];
  // -------------------------------------------------

  // fetch fields once
  useEffect(() => {
    getStudentRecordFields(
      context?.profileId,
      context?.session,
      {}
    )
      .then((data) => {
        console.log("data___",data);
        
        return (
          setFields(data?.fields || [])
        )
      })
      .catch(console.error);
  }, []);


  const classes = standards.flatMap(s =>
    (s.classes || []).map(c => ({
      id: c.id,
      name: `${s.name} - ${c.name}`
    }))
  );

  function toggle(list, value, setter) {
    setter(
      list.includes(value)
        ? list.filter(v => v !== value)
        : [...list, value]
    );
  }

  function openDialog(item) {
    setDownloadUrl(item.url);
    setFormat(item.format);
    setSelectedFields([]);
    setSelectedClasses([]);
    setOpen(true);
  }

  function handleDownload() {
    const finalUrl =
      `https://portal.infoeight.com/${downloadUrl}` +
      `&classIds=${selectedClasses.join(",")}` +
      `&fields=${selectedFields.join(",")}` +
      `&format=${format}`;

    window.open(finalUrl, "_blank");
    setOpen(false);
  }

  // -------------------------------------------------
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-bold text-center mb-8">
            Download Center
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {menu.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border shadow"
              >
                <div className="p-4 bg-blue-600 text-white font-semibold rounded-t-xl">
                  {item.name}
                </div>

                <div className="p-4 space-y-2">
                  {item.sub_menu.map((sub, j) => (
                    <button
                      key={j}
                      onClick={() => openDialog(sub)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-slate-50 hover:bg-blue-50"
                    >
                      <div className="flex gap-3 items-center">
                        {getFileIcon(sub.name)}
                        <span className="font-medium">
                          {sub.name.toUpperCase()}
                        </span>
                      </div>
                      <Download size={16} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* =================== DIALOG =================== */}
          {open && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4">

                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Select Classes & Fields
                  </h2>
                  <button onClick={() => setOpen(false)}>
                    <X />
                  </button>
                </div>

                {/* Fields */}
                <div>
                  <p className="font-semibold text-sm mb-2">Fields</p>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
                    {fields.map(f => (
                      <label key={f.key} className="text-sm flex gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(f.key)}
                          onChange={() =>
                            toggle(selectedFields, f.key, setSelectedFields)
                          }
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Classes */}
                <div>
                  <p className="font-semibold text-sm mb-2">Classes</p>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
                    {classes.map(c => (
                      <label key={c.id} className="text-sm flex gap-2">
                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(c.id)}
                          onChange={() =>
                            toggle(selectedClasses, c.id, setSelectedClasses)
                          }
                        />
                        {c.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedFields.length || !selectedClasses.length}
                    onClick={handleDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* ============================================== */}

        </div>
      </div>
    </Layout>
  );
}
