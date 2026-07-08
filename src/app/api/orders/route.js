import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

// GET all orders (Admin only)
export async function GET(request) {
  try {
    const { isAdmin, error } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error }, { status: 403 });
    }

    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create a new order (Authenticated or Guest Customer)
export async function POST(request) {
  try {
    await connectDB();
    const authHeader = request.headers.get("Authorization");
    let userId = "guest";
    let customerEmail = "guest@example.com";

    // If auth header is provided, try to verify the user
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
        customerEmail = user.email || customerEmail;
      }
    }

    const body = await request.json();
    const { items, totalAmount, shippingDetails } = body;

    if (!items || items.length === 0 || !totalAmount || !shippingDetails) {
      return NextResponse.json({ success: false, error: "Missing order details" }, { status: 400 });
    }

    // Verify stock and prices from DB
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ success: false, error: `Product ${item.title} not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${item.title}` }, { status: 400 });
      }
      
      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId,
      customerEmail,
      items,
      totalAmount,
      shippingDetails
    });

    await newOrder.save();
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
