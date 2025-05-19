module.exports = (sequelize, DataTypes) => {
  // Define FeeRecord model
  const FeeRecord = sequelize.define('FeeRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    monthYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'FeeRecords'
  });

  // Define FeeRecordSubject model
  const FeeRecordSubject = sequelize.define('FeeRecordSubject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subjectFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'FeeRecordSubjects'
  });

  // Set up associations
  FeeRecord.associate = (models) => {
    FeeRecord.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student'
    });
    FeeRecord.belongsToMany(models.Subject, {
      through: FeeRecordSubject,
      foreignKey: 'feeRecordId',
      as: 'subjects'
    });
  };

  FeeRecordSubject.associate = (models) => {
    FeeRecordSubject.belongsTo(models.FeeRecord, {
      foreignKey: 'feeRecordId',
      as: 'feeRecord'
    });
    FeeRecordSubject.belongsTo(models.Subject, {
      foreignKey: 'subjectCode',
      as: 'subject'
    });
  };

  return { FeeRecord, FeeRecordSubject };
};