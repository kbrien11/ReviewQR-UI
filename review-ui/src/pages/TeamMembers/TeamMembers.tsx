import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";

export default function TeamMembers() {
  const [users, setUsers] = useState([{ username: "", email: "" }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { business } = useParams();

  const addRow = () => {
    setUsers([...users, { username: "", email: "" }]);
  };

  const removeRow = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const updateField = (index, field, value) => {
    const updated = [...users];
    updated[index][field] = value;
    setUsers(updated);
  };

  const submitUsers = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://reviewqrapi.onrender.com/auth/staff/bulk-add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ users }),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      setUsers([{ username: "", email: "" }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log(business)

  return (
    <div className="min-h-screen bg-gray-50">

<PageHeader businessName={business} title="Team Members" />


      {/* ⭐ PAGE CONTENT */}
      <div className="p-6 max-w-3xl mx-auto">

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Add staff to your business so they can log in and manage reviews.
        </p>

        {/* Card */}
        <div className="
          bg-white/80 backdrop-blur-xl shadow-sm border border-gray-200 
          rounded-xl p-4 space-y-4
        ">
          {users.map((user, index) => (
            <div
              key={index}
              className="
                flex flex-col md:flex-row gap-3 items-start md:items-center 
                border border-gray-200 rounded-lg p-3 bg-white shadow-xs
                transition-all
              "
            >
              <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => updateField(index, "username", e.target.value)}
                className="
                  w-full md:w-1/3 px-3 py-2 rounded-md border border-gray-300 
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                "
              />

              <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => updateField(index, "email", e.target.value)}
                className="
                  w-full md:w-1/2 px-3 py-2 rounded-md border border-gray-300 
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                "
              />

              {users.length > 1 && (
                <button
                  onClick={() => removeRow(index)}
                  className="text-red-500 text-sm font-medium hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* Add Row Button */}
          <button
            onClick={addRow}
            className="
              w-full py-2 rounded-md border border-gray-300 text-gray-700 
              hover:bg-gray-100 transition-all font-medium
            "
          >
            + Add Another User
          </button>

          {/* Submit */}
          <button
            onClick={submitUsers}
            disabled={loading}
            className="
              w-full py-3 rounded-md bg-indigo-600 text-white font-semibold 
              hover:bg-indigo-700 transition-all mt-2
              disabled:opacity-50
            "
          >
            {loading ? "Adding..." : "Add Team Members"}
          </button>

          {success && (
            <p className="text-green-600 text-sm mt-2">
              Users added successfully.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}