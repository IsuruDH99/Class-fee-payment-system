import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";

// Set the app root for accessibility (required by react-modal)
Modal.setAppElement("#root");

const SubjectEdit = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({
    subjectCode: "",
    subjectName: "",
    fee: ""
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:3001/subjects/get-subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  };

  const openModal = (subject) => {
    setCurrentSubject(subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFeeChange = (e) => {
    setCurrentSubject({ ...currentSubject, fee: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/subjects/update-fee/${currentSubject.subjectCode}`, {
        fee: currentSubject.fee,
      });

      // Update state with updated fee
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject.subjectCode === currentSubject.subjectCode
            ? { ...subject, fee: currentSubject.fee }
            : subject
        )
      );

      setSuccessMessage("Subject fee updated successfully!");
      closeModal();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update fee:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Subject Fee</h1>

      {successMessage && (
        <div className="bg-green-500 text-white px-4 py-2 mb-4 rounded">
          {successMessage}
        </div>
      )}

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
              <td colSpan={4} className="text-center p-4 text-gray-500">No subjects found.</td>
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
                    Edit Fee
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
            width: "400px",
            padding: "20px",
            borderRadius: "8px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          Edit Fee for {currentSubject.subjectName}
        </h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Subject Code</label>
          <input
            type="text"
            value={currentSubject.subjectCode}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

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
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SubjectEdit;
