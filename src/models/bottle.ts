import mongoose, { Schema, model, models, Model } from 'mongoose';
import type { IBottle } from '@/types/bottle';

// 添加模型接口
interface IBottleModel extends Model<IBottle> {
  pickRandom(query: any): Promise<any>;
}

// 添加一个工具函数来转换对象
function toPublicObject(bottle: any) {
  return {
    id: bottle._id,
    content: bottle.content,
    type: bottle.type,
    address: bottle.address,
    tags: bottle.tags,
    createdAt: bottle.createdAt
  };
}

const bottleSchema = new Schema<IBottle>({
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [5000, 'Content cannot be longer than 5000 characters']
  },
  type: {
    type: String,
    enum: ['text'],
    default: 'text'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  pickedCount: {
    type: Number,
    default: 0
  },
  lastPickedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  address: {
    type: String,
    required: false
  },
  tags: [{
    type: String,
    maxlength: 20
  }]
}, {
  timestamps: true
});

// 修改后的 pickRandom 方法
bottleSchema.statics.pickRandom = async function(query: any) {
  // 分离地理查询和其他查询条件
  const geoQuery = query.location ? { location: query.location } : {};
  const otherQuery = { ...query };
  delete otherQuery.location;

  let bottle = null;
  
  try {
    // 如果有地理位置查询
    if (Object.keys(geoQuery).length > 0) {
      const bottles = await this.find({ ...geoQuery, ...otherQuery }).lean();
      
      // 如果找到了结果，随机选择一个
      if (bottles.length > 0) {
        bottle = bottles[Math.floor(Math.random() * bottles.length)];
      }
    } else {
      // 没有地理位置查询时使用 aggregate
      const bottles = await this.aggregate([
        { $match: otherQuery },
        { $sample: { size: 1 } }
      ]);
      
      if (bottles.length > 0) {
        bottle = bottles[0];
      }
    }

    // 更新被捡起的漂流瓶信息
    if (bottle) {
      await this.findByIdAndUpdate(bottle._id, {
        $inc: { pickedCount: 1 },
        lastPickedAt: new Date()
      });

      // 转换为公开格式
      return toPublicObject(bottle);
    }

    return null;
  } catch (error) {
    console.error('Error in pickRandom:', error);
    throw error;
  }
};

// 实例方法
bottleSchema.methods.toPublic = function() {
  return toPublicObject(this);
};

// 添加索引
bottleSchema.index({ location: '2dsphere' });
bottleSchema.index({ isActive: 1, createdAt: -1 });
bottleSchema.index({ tags: 1, isActive: 1 });

// 修改模型创建，添加类型
export const Bottle = (models.Bottle || model<IBottle, IBottleModel>('Bottle', bottleSchema)) as IBottleModel;