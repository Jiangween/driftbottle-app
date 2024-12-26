import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Bottle } from "@/models/bottle";
import type { CreateBottleDto } from "@/types/bottle";
import { errorResponse, isValidCoordinates, processTags, geocode } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body: CreateBottleDto = await request.json();
    
    if (!body.content?.trim()) {
      return errorResponse("Content is required", 400);
    }

    // 处理位置信息
    let location;
    let address = body.address;

    if (address) {
      const geoResult = await geocode(address);
      if (geoResult.success) {
        location = {
          type: 'Point',
          coordinates: geoResult.coordinates
        };
        address = geoResult.formatted_address || address;
      } else {
        console.warn(`地址 "${address}" 无法解析为坐标`);
        address = '未知地址';
      }
    } else if (body.location) {
      const { longitude, latitude } = body.location;
      if (!isValidCoordinates(longitude, latitude)) {
        return errorResponse("Invalid coordinates", 400);
      }
      location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    }

    const bottle = await Bottle.create({
      content: body.content.trim(),
      type: body.type || 'text',
      location,
      address,
      tags: processTags(body.tags),
      createdAt: new Date()
    });

    return NextResponse.json(bottle.toPublic(), { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/bottle:', error);
    return errorResponse("Internal Server Error");
  }
}