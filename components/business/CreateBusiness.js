import { useState } from "react";
import { Switch } from "../ui/Switch/switch";
import { FaRegCheckCircle } from "react-icons/fa";
import { InputWithIcon } from "../ui/input/inputWithIcon";
import AssignCategories from "./AssignCategories";

const businessTypes = [
  "food & restaurant", "genral store", "medics", "electronics", "tailoring", "furniture",
];

export default function CreateBusiness() {
  const [form, setForm] = useState({
    name: "",
    type: "other",
    description: "",
    website: "",
    socialLinks: { instagram: "", facebook: "", linkedin: "" },
    logo: null,
    bannerImage: null,
    selectedModules: [],
  });

  const availableModules = ["Inventory", "Orders", "Logistics", "Analytics"]; // Replace with DB fetch

  const handleModuleToggle = (mod) => {
    setForm((prev) => {
      const selected = prev.selectedModules.includes(mod)
        ? prev.selectedModules.filter((m) => m !== mod)
        : [...prev.selectedModules, mod];
      return { ...prev, selectedModules: selected };
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-2xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🛍️ Create a New Store</h2>

                <AssignCategories />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <InputWithIcon
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="E.g. Kirana Junction"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Business Type</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {businessTypes.map((type) => (
              <option key={type} value={type}>{type.replace("_", " ")}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="w-full mt-1 p-2 border rounded-md"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Tell us more about your business..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Website</label>
          <InputWithIcon
            type="url"
            className="w-full mt-1 p-2 border rounded-md"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Instagram</label>
          <InputWithIcon
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            value={form.socialLinks.instagram}
            onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Facebook</label>
          <InputWithIcon
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            value={form.socialLinks.facebook}
            onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">LinkedIn</label>
          <InputWithIcon
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            value={form.socialLinks.linkedin}
            onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-1">
          <label className="text-sm font-medium">Upload Logo</label>
          <InputWithIcon type="file" accept="image/*" onChange={(e) => setForm({ ...form, logo: e.target.files[0] })} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Upload Banner</label>
          <InputWithIcon type="file" accept="image/*" onChange={(e) => setForm({ ...form, bannerImage: e.target.files[0] })} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">📦 Select Modules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableModules.map((mod) => (
            <div key={mod}>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.selectedModules.includes(mod)}
                  onChange={() => handleModuleToggle(mod)}
                  className={`${form.selectedModules.includes(mod) ? "bg-green-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">{mod}</span>
                  <span
                    className={`${form.selectedModules.includes(mod) ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full`}
                  />
                </Switch>
                <p>{mod}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
        <FaRegCheckCircle className="w-5 h-5" />
        Create Business
      </button>
    </div>
  );
}
