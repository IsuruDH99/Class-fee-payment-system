import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Studentview = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Student/get-students");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error("❌ Failed to load student data.");
      }
    };
    fetchStudents();
  }, []);

  const confirmDelete = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
     
      await axios.delete(`http://localhost:5000/Student/delete-student/${selectedStudent.sid}`);
      setStudents((prev) => prev.filter((s) => s.sid !== selectedStudent.sid));
      toast.success("Student successfully deleted!");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("❌ Failed to delete student.");
    }
    setShowModal(false);
  };

  return (
    <div className="mx-auto p-6 rounded-lg w-11/12 max-w-4xl relative">
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

      <h6 className="text-[32px] font-semibold text-center text-gray-700 mb-8">
        Student Records
      </h6>

      <div className="flex justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate("/StudentAdd")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Add New Student
        </button>
      </div>

      <div className="relative overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xm text-black uppercase bg-indigo-500">
            <tr className="text-center">
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Grade</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr
                  key={student.sid}
                  className="bg-white border-b hover:bg-gray-50 text-center transition duration-150"
                >
                  <td className="px-6 py-3 text-base">{student.sid}</td>
                  <td className="px-6 py-3 text-base">{student.studentName}</td>
                  <td className="px-6 py-3 text-base">{student.studentGrade}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => confirmDelete(student)}
                      className="text-sm px-4 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded shadow transition-all duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No students available
                </td>
              </tr>
            )}
          </tbody>
         
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
        <Modal.Header closeButton className="py-2">
          <Modal.Title className="text-sm">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-xs">
          Are you sure you want to delete{" "}
          <span className="font-bold">{selectedStudent?.name}</span> (ID: {selectedStudent?.sid})?
        </Modal.Body>
        <Modal.Footer className="py-2">
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Studentview;