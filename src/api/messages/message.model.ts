import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../utils/db';

class Message extends Model {}
Message.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
  },
  roomId: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'message',
});

export default Message;
