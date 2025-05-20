import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const Fees = () => {
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");

 useEffect(() => {
    generateAvailableMonths();
    fetchStudents();
    fetchSubjects();
  }, []);

  useEffect(() => {
    const total = selectedSubjects.reduce(
      (sum, sub) => sum + Number(sub.fee),
      0
    );
    setTotalFee(total);
  }, [selectedSubjects]);

  const generateAvailableMonths = () => {
    const now = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const formatted = `${d.toLocaleString("default", {
        month: "long",
      })} ${d.getFullYear()}`;
      months.push(formatted);
    }
    setAvailableMonths(months);
    setSelectedMonthYear(months[0]);
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/Student/get-students");
      setStudentsList(response.data);
    } catch (error) {
      toast.error("Failed to fetch students");
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/subject/get-subjects");
      setSubjects(res.data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
      console.error("Error fetching subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.subjectCode === subject.subjectCode);
      return exists
        ? prev.filter((s) => s.subjectCode !== subject.subjectCode)
        : [...prev, {
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            fee: Number(subject.fee) // Convert to number here
          }];
    });
  };

  const handleGenerateReceipt = async () => {
    try {
      setIsLoading(true);
      
      const receiptNum = `REC-${Date.now().toString().slice(-6)}`;
      setReceiptNumber(receiptNum);

      const response = await axios.post("http://localhost:5000/feerecord/create", {
        studentId: selectedStudent.sid,
        monthYear: selectedMonthYear,
        totalAmount: totalFee
      });

      if (response.data.success) {
        toast.success("Receipt generated successfully!");
        setIsModalOpen(true);
      } else {
        toast.error(response.data.message || "Failed to generate receipt");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error generating receipt");
      console.error("Error generating receipt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedStudent(null);
    setSelectedSubjects([]);
    setTotalFee(0);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-center">Fees Collection</h2>

      {/* Select Student Dropdown */}
      <div className="mb-4 flex items-center gap-2 ml-1">
        <label className="w-32 text-gray-700 font-medium">
          Select Student:
        </label>
        <select
          value={selectedStudent ? selectedStudent.sid : ""}
          onChange={(e) => {
            const studentId = e.target.value;
            const student = studentsList.find(s => s.sid === studentId);
            setSelectedStudent(student || null);
          }}
          className="w-48 p-2 border rounded text-sm"
          disabled={isLoading}
        >
          <option value="">-- Select Student --</option>
          {studentsList.map((student) => (
            <option key={student.sid} value={student.sid}>
              {student.sid} - {student.studentName}
            </option>
          ))}
        </select>
      </div>

      {/* Select Month */}
      <div className="mb-6 flex items-center gap-4 ml-1">
        <label className="w-32 text-gray-700 font-medium">Select Month:</label>
        <select
          id="monthYear"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          className="w-48 border rounded p-1.5 text-sm text-gray-700"
          disabled={isLoading}
        >
          {availableMonths.map((monthYear) => (
            <option key={monthYear} value={monthYear}>
              {monthYear}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Student Info */}
      {selectedStudent && (
        <div className="mb-4 p-2 bg-gray-50 rounded text-sm">
          <span className="font-medium">Selected:</span> {selectedStudent.sid} - {selectedStudent.studentName}
          <br />
          {/* <span className="font-medium">Class:</span> {selectedStudent.className || 'N/A'} */}
        </div>
      )}

      {/* Select Subjects */}
      <div className="mb-4 flex gap-4 ml-1">
        <label className="w-32 text-gray-700 font-medium pt-2">Select Subjects:</label>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {subjects.map((subject) => (
            <label key={subject.subjectCode} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={selectedSubjects.some((s) => s.subjectCode === subject.subjectCode)}
                onChange={() => handleSubjectToggle(subject)}
                className="h-3 w-3 text-blue-600 rounded focus:ring-blue-500"
                disabled={isLoading || !selectedStudent}
              />
              {subject.subjectCode} - {subject.subjectName} (Rs. {subject.fee})
            </label>
          ))}
        </div>
      </div>

      {/* Total Fee */}
      <div className="mb-4 text-md font-semibold text-center px-4 py-2 rounded bg-blue-100">
        Total Fee: Rs. {totalFee.toFixed(2)}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm ${
            !selectedStudent || selectedSubjects.length === 0 || isLoading
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleGenerateReceipt}
          disabled={!selectedStudent || selectedSubjects.length === 0 || isLoading}
        >
          {isLoading ? "Processing..." : "Generate Receipt"}
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
          onClick={handleClear}
          disabled={isLoading}
        >
          Clear
        </button>
      </div>

      {/* Receipt Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Receipt"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            width: "400px",
            maxWidth: "90%",
            padding: "20px",
            borderRadius: "8px",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">FEE RECEIPT</h2>
          <p className="text-xs text-gray-500">Receipt No: {receiptNumber}</p>
        </div>
        
        <div className="text-sm space-y-2 mb-4">
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
        
        <div className="border-t border-b py-3 mb-3">
          <p className="font-medium">Student ID: {selectedStudent?.sid}</p>
          <p className="font-medium">Name: {selectedStudent?.studentName}</p>
          <p className="font-medium">Month: {selectedMonthYear}</p>
        </div>
        
        <ul className="text-sm mb-4 space-y-2">
          {selectedSubjects.map((s) => (
            <li key={s.subjectCode} className="flex justify-between">
              <span>{s.subjectCode} - {s.subjectName}</span>
              <span>Rs. {typeof s.fee === 'number' ? s.fee.toFixed(2) : Number(s.fee).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        
        <div className="border-t pt-3 font-bold text-sm flex justify-between">
          <span>Total Fee:</span>
          <span>Rs. {typeof totalFee === 'number' ? totalFee.toFixed(2) : Number(totalFee).toFixed(2)}</span>
        </div>
        
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
          <button 
            className="ml-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
            onClick={() => {
              window.print();
              setIsModalOpen(false);
            }}
          >
            Print Receipt
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Fees;