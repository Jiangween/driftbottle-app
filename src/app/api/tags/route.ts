import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Bottle } from "@/models/bottle";
import { errorResponse } from "@/lib/utils";

export async function GET() {
  try {
    await connectDB();
    
    const tags = await Bottle.distinct('tags');
    
    const tagStats = await Bottle.aggregate([
      { $unwind: '$tags' },
      { $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      total: tags.length,
      tags: tagStats
    });
  } catch (error) {
    console.error('Error in GET /api/tags:', error);
    return errorResponse("Internal Server Error");
  }
}