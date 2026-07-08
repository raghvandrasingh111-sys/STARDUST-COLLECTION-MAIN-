import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/adminAuth";

// GET a single product by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update a product (Admin only)
export async function PUT(request, { params }) {
  try {
    const { isAdmin, error } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { title, description, price, category, images, stock, tags } = body;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = Number(stock);
    if (tags !== undefined) product.tags = tags;

    await product.save();
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a product (Admin only)
export async function DELETE(request, { params }) {
  try {
    const { isAdmin, error } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
