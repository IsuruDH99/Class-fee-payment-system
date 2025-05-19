module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define("Subject", {
      subjectCode: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
    SubjectName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subjectFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
    });
  
    return Subject;
  };