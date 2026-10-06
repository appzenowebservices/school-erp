import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getDesignationPermissions } from "../../api/designation";

export default function PermissionsViewer({  Context }) {
  const [openProduct, setOpenProduct] = useState(null);

  const [designationsPermissions, setDesignationsPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchDesignationPermissions = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await getDesignationPermissions(
        Context?.profileId,
        Context?.session
      );

      if (res?.data?.success) {
        setDesignationsPermissions(res.data.results || []);
        setTotal(res.data.results.count || 0);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log("Permissions fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignationPermissions(1);
  }, []);

  const totalPages = Math.ceil(total / limit);
console.log('designationsPermissions___',designationsPermissions);

  return (
    <div className="space-y-4">
      {/* School Info */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold">
          {designationsPermissions?.school?.full_name || "School"}
        </h2>
        <p className="text-sm text-gray-500">School ID: {designationsPermissions.school?.id}</p>
      </div>

      {/* Products */}
      {designationsPermissions?.products?.map((product) => {
        const isOpen = openProduct === product.id;

        return (
          <div
            key={product.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            {/* Product Header */}
            <button
              onClick={() => setOpenProduct(isOpen ? null : product.id)}
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-gray-800 border-b"
            >
              <span>{product.name}</span>
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {/* Permissions Table */}
            {isOpen && (
              <div className="p-4 overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border text-left">Permission</th>
                      <th className="p-2 border text-center">Client</th>
                      <th className="p-2 border text-center">Class Teacher</th>
                      <th className="p-2 border text-center">Subject Teacher</th>
                      <th className="p-2 border text-center">Student</th>
                    </tr>
                  </thead>

                  <tbody>
                    {product.permissions.map((perm) => (
                      <tr key={perm.id} className="border-b">
                        <td className="p-2 border">{perm.name}</td>
                        <td className="p-2 border text-center">
                          {perm.has_client_access === "1" ? "✔️" : "—"}
                        </td>
                        <td className="p-2 border text-center">
                          {perm.has_class_teacher_access === "1" ? "✔️" : "—"}
                        </td>
                        <td className="p-2 border text-center">
                          {perm.has_subject_teacher_access === "1" ? "✔️" : "—"}
                        </td>
                        <td className="p-2 border text-center">
                          {perm.has_student_access === "1" ? "✔️" : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination UI (if needed) */}
                {total > limit && (
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      disabled={page === 1}
                      onClick={() => fetchDesignationPermissions(page - 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => fetchDesignationPermissions(page + 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
