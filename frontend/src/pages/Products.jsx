import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { getProducts, getWishlist } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getWishlist()
      .then(({ data }) => setSavedIds(new Set(data.wishlist.map((p) => p._id))))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    const timer = setTimeout(async () => {
      try {
        const { data } = await getProducts({ search: search || undefined, category: category || undefined, sort: sort || undefined });
        if (!cancelled) setProducts(data.products);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, category, sort]);

  return (
    <div>
      <h1>Products</h1>
      <SearchBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} sort={sort} setSort={setSort} />
      {loading && <p className="state">Loading products...</p>}
      {!loading && error && <p className="state error">Something went wrong while loading products.</p>}
      {!loading && !error && products.length === 0 && <p className="state">No products found.</p>}
      {!loading && !error && products.length > 0 && (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} initiallySaved={savedIds.has(p._id)} />
          ))}
        </div>
      )}
    </div>
  );
}
