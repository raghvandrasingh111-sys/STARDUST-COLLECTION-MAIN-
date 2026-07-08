"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./HeroCarousel.module.css";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1600&auto=format&fit=crop&q=80",
    subtitle: "The Solitaire Edit",
    title: "Timeless Sparkle, Made For You",
    description: "Discover premium 18Kt gold solitaire rings. Perfect for couples and lifetime milestones.",
    link: "/catalog?category=Rings",
    cta: "Shop Solitaires"
  },
  {
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&auto=format&fit=crop&q=80",
    subtitle: "Royal Heritage",
    title: "Crafting Love & Tradition",
    description: "Lightweight traditional neckpieces with anti-tarnish coating. Wear royalty every single day.",
    link: "/catalog?category=Necklaces",
    cta: "Explore Necklaces"
  },
  {
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1600&auto=format&fit=crop&q=80",
    subtitle: "Adaa Collection",
    title: "Dainty Drops & Ear Studs",
    description: "Dazzle in curated diamond-stud earrings that complement your office and party look.",
    link: "/catalog?category=Earrings",
    cta: "Browse Earrings"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // 6 seconds auto-scroll
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className={styles.carouselContainer}>
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`${styles.slide} ${idx === currentSlide ? styles.activeSlide : ""}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={idx === 0}
            className={styles.backgroundImage}
            sizes="100vw"
          />
          <div className={styles.overlay}>
            <div className={styles.content}>
              <span className={styles.subtitle}>{slide.subtitle}</span>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.description}>{slide.description}</p>
              <Link href={slide.link} className="btn-primary">
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className={styles.indicators}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.indicatorDot} ${idx === currentSlide ? styles.activeDot : ""}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Slide Controls */}
      <button className={`${styles.navBtn} ${styles.prev}`} onClick={prevSlide} aria-label="Previous slide">
        &#10094;
      </button>
      <button className={`${styles.navBtn} ${styles.next}`} onClick={nextSlide} aria-label="Next slide">
        &#10095;
      </button>
    </div>
  );
}
