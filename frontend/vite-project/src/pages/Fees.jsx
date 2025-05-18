import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Fees = () => {
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState("");

  const [studentsList, setStudentsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [totalFee, setTotalFee] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    generateAvailableMonths();
    fetchStudents();
    fetchSubjects();
  }, []);

  useEffect(() => {
    const filtered = studentsList.filter((student) =>
      `${student.id} - ${student.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, studentsList]);

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
    for (let i = 0; i < 24; i++) {
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
    const res = await axios.get("http://localhost:3001/students");
    setStudentsList(res.data);
  };

  const fetchSubjects = async () => {
    const res = await axios.get("http://localhost:3001/subjects/get-subjects");
    setSubjects(res.data);
  };

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) => {
      const exists = prev.find((s) => s.subjectCode === subject.subjectCode);
      return exists
        ? prev.filter((s) => s.subjectCode !== subject.subjectCode)
        : [...prev, subject];
    });
  };

  const handleGenerateReceipt = () => {
    setIsModalOpen(true);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedStudent(null);
    setSelectedSubjects([]);
    setTotalFee(0);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Fees Collection</h2>

      {/* Month Picker */}
      <div className="mb-6 flex justify-center">
        <label htmlFor="monthYear" className="text-lg font-medium text-gray-600 mr-2">
          Select Month:
        </label>
        <select
          id="monthYear"
          value={selectedMonthYear}
          onChange={(e) => setSelectedMonthYear(e.target.value)}
          className="border rounded-lg p-2 text-gray-700"
        >
          {availableMonths.map((monthYear) => (
            <option key={monthYear} value={monthYear}>
              {monthYear}
            </option>
          ))}
        </select>
      </div>

      {/* Student Picker */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-700">Search Student by ID or Name:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {filteredStudents.length > 0 && (
          <ul className="border mt-1 max-h-48 overflow-y-auto rounded">
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedStudent(student);
                  setSearchTerm(`${student.id} - ${student.name}`);
                }}
              >
                {student.id} - {student.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Subject Checkboxes */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Select Subjects:</label>
        <div className="grid grid-cols-2 gap-2">
          {subjects.map((subject) => (
            <label key={subject.subjectCode} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedSubjects.some((s) => s.subjectCode === subject.subjectCode)}
                onChange={() => handleSubjectToggle(subject)}
              />
              {subject.subjectCode} - {subject.subjectName}
            </label>
          ))}
        </div>
      </div>

      {/* Total Fee */}
      <div className="mb-6 text-lg font-semibold text-center">
        Total Fee: Rs. {totalFee}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleGenerateReceipt}
          disabled={!selectedStudent || selectedSubjects.length === 0}
        >
          Generate Receipt
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={handleClear}
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
            width: "500px",
            padding: "20px",
            borderRadius: "10px",
          },
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Receipt</h2>
        <p>Date: {new Date().toLocaleDateString()}</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
        <p className="mt-4 font-semibold">Student: {selectedStudent?.name}</p>
        <ul className="list-disc pl-5 mt-2">
          {selectedSubjects.map((s) => (
            <li key={s.subjectCode}>
              {s.subjectCode} - {s.subjectName}: Rs. {s.fee}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-bold">Total Fee: Rs. {totalFee}</p>
        <div className="text-center mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Fees;
