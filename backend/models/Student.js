module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      studentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      studentGrade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    });
  
    return Student;
  };