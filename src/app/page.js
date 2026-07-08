import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ShopByBudget from "@/components/ShopByBudget";
import TryAtHomeButton from "@/components/TryAtHomeButton";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import styles from "./page.module.css";

const MOCK_PRODUCTS = [
  {
    _id: "mock_neck_1",
    title: "Starry Nebula Choker",
    description: "A gorgeous celestial neckpiece with dangling starry charms and velvet chains.",
    price: 24.99,
    category: "Necklaces",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"],
    tags: ["Trending", "Bestseller"],
  },
  {
    _id: "mock_ring_1",
    title: "Cosmic Eclipse Ring Set",
    description: "Stackable obsidian and champagne gold rings reflecting deep cosmic shapes.",
    price: 18.99,
    category: "Rings",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80"],
    tags: ["Trending"],
  },
  {
    _id: "mock_ear_1",
    title: "Nova Crystal Drop Earrings",
    description: "Delicate asymmetrical crystal drop earrings that shine like supernova explosions.",
    price: 22.99,
    category: "Earrings",
    images: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80"],
    tags: ["Bestseller"],
  },
  {
    _id: "mock_brace_1",
    title: "Astral Celestial Bracelet",
    description: "A thin champagne gold chain lined with dainty cosmic star and moon charms.",
    price: 19.99,
    category: "Bracelets",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80"],
    tags: ["New"],
  },
  {
    _id: "mock_ring_2",
    title: "Dainty Solitaire Ring",
    description: "Elegant 18Kt gold ring with a single sparkling cubic zirconia stone.",
    price: 29.99,
    category: "Rings",
    images: ["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&auto=format&fit=crop&q=80"],
    tags: ["Trending"],
  },
  {
    _id: "mock_ear_2",
    title: "Celestial Hoop Earrings",
    description: "Classy gold-plated hoop earrings embedded with fine crystal stars.",
    price: 21.49,
    category: "Earrings",
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80"],
    tags: ["New"],
  }
];

async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(12);
    if (products.length > 0) {
      return JSON.parse(JSON.stringify(products));
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB, using mock data instead", error);
  }
  return MOCK_PRODUCTS;
}

export default async function Home() {
  const products = await getProducts();

  const CATEGORIES = [
    { name: "Rings", icon: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&auto=format&fit=crop&q=80" },
    { name: "Earrings", icon: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=200&auto=format&fit=crop&q=80" },
    { name: "Necklaces", icon: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80" },
    { name: "Bracelets", icon: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&auto=format&fit=crop&q=80" },
    { name: "Solitaires", icon: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=200&auto=format&fit=crop&q=80" },
    { name: "All Jewellery", icon: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=200&auto=format&fit=crop&q=80" }
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* 1. Hero Banner Slideshow */}
        <section className={styles.heroSection}>
          <HeroCarousel />
        </section>

        {/* 2. Circular Category Highlights */}
        <section className={`${styles.categorySection} container`}>
          <div className={styles.categoryHeader}>
            <h2>Shop by Category</h2>
            <p>Explore our wide range of lightweight everyday jewellery</p>
          </div>
          <div className={styles.categoryCircleGrid}>
            {CATEGORIES.map((cat, idx) => (
              <Link key={idx} href={`/catalog?category=${cat.name === "All Jewellery" ? "All" : cat.name}`}>
                <div className={styles.categoryCircleItem}>
                  <div className={styles.circleImageWrapper}>
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      fill
                      className={styles.circleImage}
                      sizes="120px"
                    />
                  </div>
                  <span className={styles.circleName}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Shop by Budget Section (Client Component Interactivity) */}
        <section className={`${styles.budgetSection} container`}>
          <div className={styles.sectionTitleWrapper}>
            <span className={styles.sectionSubtitle}>Budget Friendly Luxury</span>
            <h2 className={styles.sectionTitle}>Trending Pieces</h2>
          </div>
          <ShopByBudget products={products} />
        </section>

        {/* 4. CaratLane Signature "Try at Home" Promotion Card */}
        <section className="container">
          <div className={styles.tryAtHomeBanner}>
            <div className={styles.tryContent}>
              <span className={styles.tryTag}>Signature Service</span>
              <h2 className={styles.tryTitle}>Try Jewellery At Home</h2>
              <p className={styles.tryDescription}>
                Can't decide which piece suits you best? Book a free Home Trial! We will bring 
                your favorite jewellery to your doorstep. Zero booking charges, zero obligation to buy.
              </p>
              
              <div className={styles.tryBenefits}>
                <div className={styles.benefitItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Choose up to 5 items online</span>
                </div>
                <div className={styles.benefitItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>100% Free & Insured Trial</span>
                </div>
                <div className={styles.benefitItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Try at your comfort, no pressure</span>
                </div>
              </div>

              <div>
                <TryAtHomeButton />
              </div>
            </div>
            <div className={styles.tryImageWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&auto=format&fit=crop&q=80"
                alt="Try at Home Consultation"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 992px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* 5. Tanishq Partnership Assurance Banner */}
        <section className={styles.assuranceSection}>
          <div className={`${styles.assuranceContent} container`}>
            <div className={styles.assuranceHeader}>
              <h2>The Tanishq Assurance</h2>
              <p>Backed by the Trust and Quality standard of TATA Group</p>
            </div>
            <div className={styles.assuranceGrid}>
              <div className={styles.assuranceCard}>
                <h4>BIS Hallmarked Gold</h4>
                <p>Every single gram of gold used is verified and stamped by Govt. laboratories.</p>
              </div>
              <div className={styles.assuranceCard}>
                <h4>Certified Diamonds</h4>
                <p>Diamonds are certified by international grading entities (SGL, IGI or GIA).</p>
              </div>
              <div className={styles.assuranceCard}>
                <h4>Transparent Pricing</h4>
                <p>Get a detailed break-up of gold weight, stone values, and making charges.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

