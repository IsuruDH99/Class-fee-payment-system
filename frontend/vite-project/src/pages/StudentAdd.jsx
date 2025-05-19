import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentAdd = () => {
  const [name, setName] = useState("");
  const [sid, setSid] = useState("");
  const [grade, setGrade] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sidRegex = /^[0-9]{4}$/;

    if (!name || !sid || !grade) {
      showError("Please fill in all fields.");
      return;
    } else if (!sidRegex.test(sid)) {
      showError("ID must be a 4-digit number (e.g., 0001, 1234).");
      return;
    }

    const newStudent = {
      name,
      sid,
      grade
    };

    try {
      await axios.post("http://localhost:5000/Student/add-student", newStudent);
      setName("");
      setSid("");
      setGrade("");
      showSuccess("Student Added Successfully!");
     // setTimeout(() => navigate("/studentview"), 1500);
    } catch (error) {
      console.error("Error adding student:", error);
      if (error.response && error.response.data.error) {
        showError(error.response.data.error);
      } else {
        showError("Failed to add student. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-10">
      <ToastContainer style={{ marginTop: "65px" }} />

      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          Add New Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID Field */}
          <div>
            <label htmlFor="sid" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              id="sid"
              value={sid}
              onChange={(e) => setSid(e.target.value)}
              required
              maxLength={4}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Enter 4-digit SID (e.g., 0001)"
            />
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Student Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Enter student name"
            />
          </div>

          {/* Grade Field */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade
            </label>
            <input
              type="text"
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Enter student grade (e.g., A, B, 10th)"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Add Student
            </button>
            <button
              type="button"
              onClick={() => navigate("/studentview")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              View Students
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAdd;