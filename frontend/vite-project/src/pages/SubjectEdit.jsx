import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// Set the app root for accessibility (required by react-modal)
Modal.setAppElement("#root");

const SubjectEdit = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({
    subjectCode: "",
    subjectName: "",
    fee: "",
  });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/subject/get-subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      showError("Failed to load subjects");
    }
  };

  const openModal = (subject) => {
    setCurrentSubject(subject);
    setIsModalOpen(true);
    setDeleteConfirm(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteConfirm(false);
  };

  const handleFeeChange = (e) => {
    setCurrentSubject({ ...currentSubject, fee: e.target.value });
  };

  const handleUpdate = async () => {
    if (!currentSubject.fee || isNaN(currentSubject.fee)) {
      showError("Please enter a valid fee amount");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/subject/update-fee/${currentSubject.subjectCode}`,
        {
          fee: currentSubject.fee,
        }
      );

      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject.subjectCode === currentSubject.subjectCode
            ? { ...subject, fee: currentSubject.fee }
            : subject
        )
      );

      showSuccess("Subject fee updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Failed to update fee:", error);
      showError(error.response?.data?.message || "Failed to update fee");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:5000/subject/delete-subject/${currentSubject.subjectCode}`
      );

      setSubjects((prevSubjects) =>
        prevSubjects.filter(
          (subject) => subject.subjectCode !== currentSubject.subjectCode
        )
      );

      showSuccess("Subject deleted successfully!");
      closeModal();
    } catch (error) {
      console.error("Failed to delete subject:", error);
      showError(error.response?.data?.message || "Failed to delete subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-4xl mx-auto">
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

      <h1 className="text-2xl font-bold mb-4">Edit Subject Fee</h1>

      <table className="w-full text-left border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-2">Subject Code</th>
            <th className="p-2">Subject Name</th>
            <th className="p-2">Fee (Rs.)</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No subjects found.
              </td>
            </tr>
          ) : (
            subjects.map((subject) => (
              <tr key={subject.subjectCode} className="border-b">
                <td className="p-2">{subject.subjectCode}</td>
                <td className="p-2">{subject.subjectName}</td>
                <td className="p-2">Rs. {subject.fee}</td>
                <td className="p-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => openModal(subject)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for editing fee */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Subject Fee"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            padding: "25px",
            borderRadius: "8px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {currentSubject.subjectName} ({currentSubject.subjectCode})
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Subject Name</label>
          <input
            type="text"
            value={currentSubject.subjectName}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Fee (Rs.)</label>
          <input
            type="number"
            value={currentSubject.fee}
            onChange={handleFeeChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex justify-between mt-8">
          <div>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                <FaTrash className="inline mr-2" />
                Delete Subject
              </button>
            ) : (
              <div className="space-x-2">
                <span className="text-red-600 font-medium">Are you sure?</span>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!deleteConfirm && (
            <div className="space-x-2">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Subject"}
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SubjectEdit;
