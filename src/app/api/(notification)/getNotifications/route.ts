import dbConnect from "@/lib/dbConnect";
import NotificationModel, { Notification } from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { email } = await request.json();
    const notifications = await NotificationModel.find({});
    if (!notifications || notifications.length === 0) {
      return NextResponse.json(
        { success: false, message: "No Notifications found" },
        { status: 200 }
      );
    }
    const notif: Notification[] = [];
    notifications.map((n: Notification) => {
      if (n.toUser.includes(email)) notif.push(n);
    });
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Notifications fetched successfully",
        notifications: notif,
      }),
      {
        status: 200,
        headers: {
          Connection: "keep-alive",
          "Content-Encoding": "none",
          "Cache-Control": "no-cache, no-transform",
          "Content-Type": "text/event-stream; charset=utf-8",
        },
      }
    );

    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "Notifications fetched successfully",
    //     notifications,
    //   },
    //   { status: 200 }
    // );
  } catch (error) {
    console.log("Error fetching Notifications", error);
    return NextResponse.json(
      { success: false, message: "Error fetching Notifications" },
      { status: 500 }
    );
  }
}
