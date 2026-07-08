import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";

const MOCK_PRODUCTS = [
  {
    _id: "mock_neck_1",
    title: "Starry Nebula Choker",
    description: "A gorgeous celestial neckpiece with dangling starry charms and velvet chains.",
    price: 24.99,
    category: "Necklaces",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"],
    tags: ["Trending", "Bestseller"],
    stock: 15
  },
  {
    _id: "mock_ring_1",
    title: "Cosmic Eclipse Ring Set",
    description: "Stackable obsidian and champagne gold rings reflecting deep cosmic shapes.",
    price: 18.99,
    category: "Rings",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"],
    tags: ["Trending"],
    stock: 8
  },
  {
    _id: "mock_ear_1",
    title: "Nova Crystal Drop Earrings",
    description: "Delicate asymmetrical crystal drop earrings that shine like supernova explosions.",
    price: 22.99,
    category: "Earrings",
    images: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80"],
    tags: ["Bestseller"],
    stock: 12
  },
  {
    _id: "mock_brace_1",
    title: "Astral Celestial Bracelet",
    description: "A thin champagne gold chain lined with dainty cosmic star and moon charms.",
    price: 19.99,
    category: "Bracelets",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80"],
    tags: ["New"],
    stock: 20
  },
];

async function getProduct(id) {
  // Check if it matches mock products first
  const mockProduct = MOCK_PRODUCTS.find((p) => p._id === id);
  if (mockProduct) {
    return mockProduct;
  }

  try {
    await connectDB();
    const product = await Product.findById(id);
    if (product) {
      return JSON.parse(JSON.stringify(product));
    }
  } catch (error) {
    console.error("Error fetching product", error);
  }
  return null;
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "80vh", paddingTop: "180px", textAlign: "center", color: "#9f9fb5" }} className="container">
          <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Star System Lost</h2>
          <p style={{ marginBottom: "2rem" }}>We couldn't find the celestial piece you are looking for.</p>
          <Link href="/catalog" className="btn-primary">
            Back to Catalog
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProductDetailClient product={product} />
      <Footer />
    </>
  );
}
