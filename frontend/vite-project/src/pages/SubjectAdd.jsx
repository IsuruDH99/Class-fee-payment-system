import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubjectAdd = () => {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectFee, setSubjectFee] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/subject/add-subject",
        {
          subjectCode,
          subjectName,
          subjectFee,
        }
      );

      if (response.status === 201) {
        toast.success("Subject added successfully!");
        setSubjectCode("");
        setSubjectName("");
        setSubjectFee("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding subject.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-2 pb-48">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">

        {/* Toast container */}
        <ToastContainer
          position="top-center"
          autoClose={1200}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ marginTop: "65px" }}
        />

        {/* Page title */}
        <h2 className="text-[28px] font-bold mb-6 text-blue-600 text-center">
          Add Subject
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-bold text-lg">
          {[
            { id: "subjectCode", label: "Subject Code", value: subjectCode, setter: setSubjectCode },
            { id: "subjectName", label: "Subject Name", value: subjectName, setter: setSubjectName },
            { id: "subjectFee", label: "Subject Fee", value: subjectFee, setter: setSubjectFee },
          ].map(({ id, label, value, setter }) => (
            <div key={id} className="grid grid-cols-3 items-center gap-4">
              <label htmlFor={id} className="text-base font-medium text-gray-700">
                {label}
              </label>
              <input
                type="text"
                id={id}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                className="col-span-2 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectAdd;
