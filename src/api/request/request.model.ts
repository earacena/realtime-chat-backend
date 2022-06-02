import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../utils/db';

class Request extends Model {}
Request.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM('contact'),
    allowNull: false,
  },
  dateRequested: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  fromUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted'),
    allowNull: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'request',
});

export default Request;
