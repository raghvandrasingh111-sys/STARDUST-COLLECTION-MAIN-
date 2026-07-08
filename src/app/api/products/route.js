import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyAdmin } from "@/lib/adminAuth";

// GET all products with filtering, search, and sorting
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort"); // "price_asc", "price_desc", "newest"

    let query = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") {
      sortOption = { price: 1 };
    } else if (sort === "price_desc") {
      sortOption = { price: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOption);
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create a product (Admin only)
export async function POST(request) {
  try {
    const { isAdmin, error } = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { title, description, price, category, images, stock, tags } = body;

    if (!title || !description || price === undefined || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = new Product({
      title,
      description,
      price: Number(price),
      category,
      images: images || [],
      stock: stock !== undefined ? Number(stock) : 0,
      tags: tags || []
    });

    await newProduct.save();
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
