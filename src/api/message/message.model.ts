import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utils/db';

class Message extends Model {}
Message.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderUsername: {
    type: DataTypes.TEXT,
  },
  recipientUsername: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  timestamps: false,
  underscored: true,
  modelName: 'message',
});

export default Message;
