import { NextResponse } from "next/server";
import type { ApiError } from "@/types/bottle";

const AMAP_KEY = process.env.AMAP_KEY;

// 添加类型定义
export type GeocodingResult = {
  success: boolean;
  coordinates?: [number, number];
  formatted_address?: string;
};

export function errorResponse(message: string, status: number = 500, details?: any) {
  return NextResponse.json(
    { message, ...(details && { details }) } as ApiError,
    { status }
  );
}

export function isValidCoordinates(longitude: number, latitude: number): boolean {
  return (
    typeof longitude === 'number' &&
    typeof latitude === 'number' &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
}

export function processTags(tags?: string[]): string[] {
  if (!tags) return [];
  return tags
    .filter(Boolean)
    .map(tag => tag.trim())
    .filter(tag => tag.length <= 20)
    .slice(0, 5);
}

// 修改返回类型
export async function geocode(address: string): Promise<GeocodingResult> {
  if (!AMAP_KEY) {
    console.error('AMAP_KEY not found in environment variables');
    return { success: false };
  }

  try {
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${AMAP_KEY}&output=json`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '0') {
      console.error('地理编码API调用失败:', data.info);
      return { success: false };
    }
    
    if (data.geocodes && data.geocodes[0]) {
      const [lng, lat] = data.geocodes[0].location.split(',');
      return {
        coordinates: [parseFloat(lng), parseFloat(lat)],
        formatted_address: data.geocodes[0].formatted_address,
        success: true
      };
    }

    return { success: false };
  } catch (error) {
    console.error('地理编码失败:', error);
    return { success: false };
  }
}