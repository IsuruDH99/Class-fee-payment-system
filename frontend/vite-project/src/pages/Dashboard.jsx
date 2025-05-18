import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import salary from "../Images/salary.jpg";
import manage from "../Images/manage.jpeg";
import product from "../Images/product.jpg";


const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-5 pt-2">
      
      {/* Student Administration Card with Dropdown */}
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold">Student Administration</h5>
          <img
            src={manage}
            alt="Manage Employee"
            className="w-full h-40 object-cover mb-3"
          />
          <Dropdown>
            <Dropdown.Toggle variant="primary">Student Administration</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/StudentAdd")}>
                Add New Students
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/StudentView")}>
                View Student
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      
     
     {/* fees Card */}
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold">Calcuate Fee</h5>
          <img
            src={salary}
            alt="View Attendance"
            className="w-full h-40 object-cover mb-3"
          />
          <Button onClick={() => navigate("/fees")}>
            Calcuate Fee
          </Button>
        </div>
      </div>
      
     
      {/* Manage subject Card with Dropdown */}
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold">Manage Subjects</h5>
          <img
            src={product}
            alt="Manage Products"
            className="w-full h-40 object-cover mb-3"
          />
          <Dropdown>
            <Dropdown.Toggle variant="primary">Manage Subjects</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/subjectedit")}>
                Edit Subjects
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/subjectadd")}>
                Add New Subjects
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
