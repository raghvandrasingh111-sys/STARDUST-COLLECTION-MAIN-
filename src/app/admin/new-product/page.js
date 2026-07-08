"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload, X } from "lucide-react";
import styles from "./new-product.module.css";

export default function NewProduct() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Necklaces");
  const [stock, setStock] = useState("10");
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState([]); // Array of URLs
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Authenticate
  useEffect(() => {
    async function checkAuth() {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        setCheckingAuth(false);
        return;
      }
      
      setSession(currentSession);
      const email = currentSession.user?.email || "";
      const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
      const adminEmails = adminEmailsEnv.split(",").map(e => e.trim().toLowerCase());
      
      if (adminEmails.includes(email.toLowerCase())) {
        setIsAdmin(true);
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, []);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        console.warn("Supabase Storage upload failed. Using mock premium image URL for local testing.", error);
        
        const fallbackUrls = [
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80"
        ];
        // Pick one at random
        const fallbackUrl = fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)];
        
        setImages((prev) => [...prev, fallbackUrl]);
        alert("Upload simulation active: A high-quality placeholder image was added. Make sure to create a public bucket named 'product-images' in Supabase to upload custom photos!");
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImages((prev) => [...prev, publicUrl]);
    } catch (err) {
      alert("Error uploading image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload or add at least one product image.");
      return;
    }

    setSubmitting(true);
    try {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          category,
          stock: Number(stock),
          images,
          tags
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      if (data.success) {
        alert("Product added successfully! Returning to Dashboard.");
        router.push("/admin");
      }
    } catch (err) {
      alert("Error creating product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <>
        <Navbar />
        <main className={`${styles.main} container`} style={{ textAlign: "center", color: "#9f9fb5" }}>
          Checking access rights...
        </main>
        <Footer />
      </>
    );
  }

  if (!session || !isAdmin) {
    return (
      <>
        <Navbar />
        <main className={`${styles.main} container`}>
          <div className={styles.unauthorized}>
            <h2>Access Denied</h2>
            <p>You must be an administrator to view this page.</p>
            <Link href="/" className="btn-primary" style={{ marginTop: '1rem' }}>
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`${styles.main} container`}>
        <button onClick={() => router.push("/admin")} className={styles.backBtn} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className={styles.title}>Upload Celestial Product</h1>

        <div className={styles.card}>
          <form onSubmit={handleFormSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Product Title</label>
              <input
                id="title"
                type="text"
                required
                placeholder="Starry Nebula Necklace"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                required
                placeholder="Provide a starry description detailing design notes, aesthetic vibes, and care details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price ($ USD)</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="24.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  id="stock"
                  type="number"
                  required
                  placeholder="15"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="Necklaces">Necklaces</option>
                  <option value="Rings">Rings</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelets">Bracelets</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input
                  id="tags"
                  type="text"
                  placeholder="trending, bestseller, new"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            {/* File Upload Zone */}
            <div className={styles.formGroup}>
              <label>Product Images</label>
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className={styles.fileUploadZone}
              >
                <Upload size={32} className={styles.uploadIcon} />
                <span className={styles.uploadLabel}>
                  {uploadingImage ? "Uploading file..." : "Click to select a product picture"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  disabled={uploadingImage}
                />
              </div>

              {images.length > 0 && (
                <div className={styles.imagePreviewGrid}>
                  {images.map((imgUrl, index) => (
                    <div key={index} className={styles.previewWrapper}>
                      <Image
                        src={imgUrl}
                        alt={`Preview ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="80px"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className={styles.removePreviewBtn}
                        aria-label="Remove picture"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={submitting || uploadingImage} 
              className="btn-primary" 
              style={{ width: "100%", marginTop: "1rem" }}
            >
              {submitting ? "Writing product into stars..." : "Publish Product ✨"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
