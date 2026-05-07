import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
export async function PUT(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, bio, image } = await req.json();
    await connectToDatabase();
    const updatedUser = await User.findByIdAndUpdate(
      (session.user as any).id,
      { 
        $set: { 
          name, 
          bio, 
          image 
        } 
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        image: updatedUser.image,
        role: updatedUser.role,
      }
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
