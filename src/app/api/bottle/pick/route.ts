import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Bottle } from "@/models/bottle";
import type { PickBottleDto } from "@/types/bottle";
import { errorResponse, processTags, geocode } from "@/lib/utils";

const MAX_DISTANCE = 500000; // 最大搜索距离（米）

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body: PickBottleDto = await request.json();
    const { address, maxDistance = 50000, tags } = body;
    
    const query: any = { isActive: true };
    
    if (address) {
      const geoResult = await geocode(address);
      if (geoResult.success) {
        query.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: geoResult.coordinates
            },
            $maxDistance: Math.min(maxDistance, MAX_DISTANCE)
          }
        };
      }
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: processTags(tags) };
    }

    const bottle = await Bottle.pickRandom(query);

    if (!bottle) {
      return errorResponse("No bottles found", 404);
    }

    // 直接返回结果，因为 pickRandom 已经处理了格式转换
    return NextResponse.json(bottle);
  } catch (error) {
    console.error('Error in POST /api/bottle/pick:', error);
    return errorResponse("Internal Server Error");
  }
}