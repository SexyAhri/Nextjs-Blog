"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      })
      .catch(console.error);
  }, []);

  if (categories.length === 0) return null;

  return (
    <nav className="category-nav">
      <div className="category-nav-container">
        <Link
          href="/"
          className={`category-nav-item ${pathname === "/" ? "active" : ""}`}
        >
          全部
        </Link>
        {categories.map((cat) => {
          const isActive = pathname === `/category/${cat.slug}`;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`category-nav-item ${isActive ? "active" : ""}`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
