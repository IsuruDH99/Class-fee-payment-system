module.exports = (sequelize, DataTypes) => {
  // Define FeeRecord model
  const FeeRecord = sequelize.define('FeeRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    monthYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    
  });
  return  FeeRecord;
};