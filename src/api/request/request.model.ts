import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utils/db';

class Request extends Model {}
Request.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  requestType: {
    type: DataTypes.ENUM('contact'),
    allowNull: false,
  },
  requestFromUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestToUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestStatus: {
    type: DataTypes.ENUM('pending', 'accepted'),
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'request',
});

export default Request;
