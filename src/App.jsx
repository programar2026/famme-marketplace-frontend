import React, { useState, useEffect, useMemo } from "react";
import { api } from "./api.js";

/* Ícones simples em SVG, sem dependências externas */
const Icon = {
  Heart: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={p.filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.6C12 6.2 13.5 5 15.5 5 19 5 21.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
    </svg>
  ),
  Search: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Bag: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M6 8h12l1 13H5L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  User: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  Back: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Close: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Trash: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Logout: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Chevron: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

const CATEGORIES = [
  { id: "vestidos-casuais", label: "Vestidos Casuais" },
  { id: "vestidos-gala", label: "Vestidos de Gala" },
  { id: "sapatos", label: "Sapatos" },
  { id: "malas", label: "Malas" },
  { id: "acessorios", label: "Acessórios" },
  { id: "maquilhagem", label: "Maquilhagem" },
  { id: "cabelos", label: "Cabelos e Perucas" },
  { id: "lingerie", label: "Lingerie" },
  { id: "praia", label: "Moda Praia" },
  { id: "beleza", label: "Produtos de Beleza" },
];

const kz = (n) => Number(n || 0).toLocaleString("pt-PT") + " Kz";

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="topbar with-line">
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        {onBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Voltar">
            <Icon.Back />
          </button>
        )}
        <h1 className="topbar-title">{title}</h1>
      </div>
      {right}
    </div>
  );
}

function ProductCard({ product, onOpen, favorite, onToggleFav }) {
  return (
    <button className="product-card" onClick={() => onOpen(product)}>
      <div className="product-frame" style={{ background: `linear-gradient(160deg, hsl(${product.tone} 20% 88%), hsl(${(product.tone + 10) % 360} 15% 78%))` }}>
        {product.stock === 0 && <span className="badge">Esgotado</span>}
        <button
          className="product-fav"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(product.id);
          }}
          aria-label="Favorito"
        >
          <Icon.Heart filled={favorite} />
        </button>
      </div>
      <p className="product-seller">{product.store_name}</p>
      <p className="product-name serif">{product.name}</p>
      <p className="product-price">{kz(product.price_kz)}</p>
    </button>
  );
}

function BottomNav({ screen, setScreen, cartCount, isSeller }) {
  const items = [
    { id: "home", icon: Icon.Bag, label: "Loja" },
    { id: "search", icon: Icon.Search, label: "Procurar" },
    { id: "cart", icon: Icon.Heart, label: "Carrinho", badge: cartCount },
    { id: isSeller ? "painel" : "conta", icon: Icon.User, label: isSeller ? "Painel" : "Conta" },
  ];
  return (
    <div className="bottom-nav">
      {items.map(({ id, icon: Ico, label, badge }) => {
        const active = screen === id || (["produto", "categoria"].includes(screen) && id === "home");
        return (
          <button key={id} className={`nav-item ${active ? "active" : ""}`} onClick={() => setScreen(id)}>
            <span style={{ position: "relative" }}>
              <Ico color={active ? "#2B2420" : "#8A7F73"} />
              {badge > 0 && <span className="nav-badge">{badge}</span>}
            </span>
            <span className="nav-label">{label}</span>
            {active && <span className="nav-dot" />}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input {...props} />
    </label>
  );
}

function Button({ children, variant = "solid", ...props }) {
  const cls = variant === "solid" ? "btn btn-solid" : variant === "accent" ? "btn btn-accent" : "btn btn-outline";
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState(() => loadLocal("femme_favorites", []));
  const [cart, setCart] = useState(() => loadLocal("femme_cart", []));
  const [toast, setToast] = useState(null);
  const [seller, setSeller] = useState(() => loadLocal("femme_seller", null));
  const [busy, setBusy] = useState(false);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => {
    api
      .listProducts()
      .then((data) => setProducts(data.map((p) => ({ ...p, tone: 24 + (p.id.charCodeAt(0) % 40) }))))
      .catch(() => flash("Não foi possível carregar as peças. O servidor pode estar a ligar — tenta novamente em instantes."))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => saveLocal("femme_favorites", favorites), [favorites]);
  useEffect(() => saveLocal("femme_cart", cart), [cart]);

  const toggleFav = (id) => setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));
  const cartTotal = cart.reduce((s, p) => s + Number(p.price_kz), 0);

  const featured = useMemo(() => products.filter((p) => favorites.includes(p.id) || p.tone % 6 === 0).slice(0, 6), [products, favorites]);

  const runSearch = async (text) => {
    setQuery(text);
    if (!text.trim()) return setSearchResults([]);
    try {
      const data = await api.listProducts({ q: text.trim() });
      setSearchResults(data.map((p) => ({ ...p, tone: 24 + (p.id.charCodeAt(0) % 40) })));
    } catch {
      flash("Não foi possível procurar agora.");
    }
  };

  const openProduct = (p) => {
    setActiveProduct(p);
    setScreen("produto");
  };
  const openCategory = (cat) => {
    setActiveCategory(cat);
    setScreen("categoria");
  };

  const checkout = async () => {
    if (!cart.length) return;
    setBusy(true);
    try {
      await api.createOrder({
        items: cart.map((c) => ({ product_id: c.id, quantity: 1 })),
      });
      setCart([]);
      flash("Encomenda criada com sucesso. Aguarda confirmação de pagamento.");
      setScreen("home");
    } catch (err) {
      flash(err.message);
    } finally {
      setBusy(false);
    }
  };

  const logoutSeller = () => {
    localStorage.removeItem("femme_token");
    setSeller(null);
    saveLocal("femme_seller", null);
    setScreen("home");
  };

  return (
    <div className="app-shell">
      {toast && <div className="toast">{toast}</div>}

      {screen === "home" && (
        <Home
          products={products}
          loading={loadingProducts}
          featured={featured}
          favorites={favorites}
          onToggleFav={toggleFav}
          onOpen={openProduct}
          onOpenCategory={openCategory}
          onSearchClick={() => setScreen("search")}
        />
      )}

      {screen === "categoria" && activeCategory && (
        <>
          <TopBar title={activeCategory.label} onBack={() => setScreen("home")} />
          <div className="product-grid" style={{ paddingTop: 16 }}>
            {products.filter((p) => p.category_id === activeCategory.id).length === 0 && (
              <p className="muted" style={{ gridColumn: "1 / -1" }}>
                Ainda sem peças nesta categoria.
              </p>
            )}
            {products
              .filter((p) => p.category_id === activeCategory.id)
              .map((p) => (
                <ProductCard key={p.id} product={p} onOpen={openProduct} favorite={favorites.includes(p.id)} onToggleFav={toggleFav} />
              ))}
          </div>
        </>
      )}

      {screen === "search" && (
        <>
          <TopBar title="Procurar" onBack={() => setScreen("home")} />
          <div className="search-input-row">
            <Icon.Search />
            <input autoFocus value={query} onChange={(e) => runSearch(e.target.value)} placeholder="Nome da peça ou da loja…" />
            {query && (
              <button className="icon-btn" onClick={() => runSearch("")}>
                <Icon.Close />
              </button>
            )}
          </div>
          <div className="product-grid" style={{ paddingTop: 24 }}>
            {query.trim() === "" && <p className="muted">Escreve para procurar peças ou vendedoras.</p>}
            {query.trim() !== "" && searchResults.length === 0 && <p className="muted">Sem resultados para "{query}".</p>}
            {searchResults.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={openProduct} favorite={favorites.includes(p.id)} onToggleFav={toggleFav} />
            ))}
          </div>
        </>
      )}

      {screen === "produto" && activeProduct && (
        <ProductScreen
          product={activeProduct}
          favorite={favorites.includes(activeProduct.id)}
          onToggleFav={toggleFav}
          onBack={() => setScreen(activeCategory ? "categoria" : "home")}
          onAddToCart={() => {
            addToCart(activeProduct);
            flash("Adicionado ao carrinho.");
          }}
        />
      )}

      {screen === "cart" && <CartScreen cart={cart} total={cartTotal} onRemove={removeFromCart} onBack={() => setScreen("home")} onCheckout={checkout} busy={busy} />}

      {screen === "conta" && !seller && (
        <AccountScreen
          favorites={products.filter((p) => favorites.includes(p.id))}
          onOpen={openProduct}
          onToggleFav={toggleFav}
          onGoRegister={() => setScreen("registoVendedora")}
          onGoLogin={() => setScreen("loginVendedora")}
        />
      )}

      {screen === "registoVendedora" && (
        <SellerForm
          mode="registo"
          onBack={() => setScreen("conta")}
          onSwitch={() => setScreen("loginVendedora")}
          onSubmit={async (form) => {
            const data = await api.registerSeller(form);
            localStorage.setItem("femme_token", data.token);
            setSeller(data.seller);
            saveLocal("femme_seller", data.seller);
            flash(`Loja "${data.seller.store_name}" criada.`);
            setScreen("painel");
          }}
        />
      )}

      {screen === "loginVendedora" && (
        <SellerForm
          mode="login"
          onBack={() => setScreen("conta")}
          onSwitch={() => setScreen("registoVendedora")}
          onSubmit={async (form) => {
            const data = await api.loginSeller(form);
            localStorage.setItem("femme_token", data.token);
            setSeller(data.seller);
            saveLocal("femme_seller", data.seller);
            setScreen("painel");
          }}
        />
      )}

      {screen === "painel" && seller && (
        <SellerPanel
          seller={seller}
          products={products.filter((p) => p.seller_id === seller.id)}
          onLogout={logoutSeller}
          onProductCreated={(p) => setProducts((prev) => [...prev, { ...p, tone: 24 + (p.id.charCodeAt(0) % 40) }])}
          onProductDeleted={(id) => setProducts((prev) => prev.filter((p) => p.id !== id))}
          flash={flash}
        />
      )}

      <BottomNav screen={screen} setScreen={setScreen} cartCount={cart.length} isSeller={!!seller} />
    </div>
  );
}

function Home({ products, loading, featured, favorites, onToggleFav, onOpen, onOpenCategory, onSearchClick }) {
  return (
    <>
      <div className="hero">
        <p className="hero-eyebrow">Nova coleção</p>
        <h1 className="hero-title serif">
          Moda de
          <br />
          várias criadoras.
        </h1>
        <p className="hero-subtitle">
          {loading ? "A carregar peças…" : products.length === 0 ? "Ainda sem peças publicadas — sê a primeira vendedora." : `${products.length} peças disponíveis.`}
        </p>
      </div>

      <button className="search-trigger" onClick={onSearchClick}>
        <Icon.Search />
        <span>Procurar peças, vendedoras…</span>
      </button>

      <div className="section-label">
        <span>Categorias</span>
        <span className="count">{CATEGORIES.length}</span>
      </div>
      <div className="category-list">
        {CATEGORIES.map((cat, i) => (
          <button key={cat.id} className="category-row" onClick={() => onOpenCategory(cat)}>
            <span style={{ display: "flex", alignItems: "baseline" }}>
              <span className="index">{String(i + 1).padStart(2, "0")}</span>
              <span className="label serif">{cat.label}</span>
            </span>
            <Icon.Chevron style={{ transform: "rotate(180deg)" }} color="#8A7F73" />
          </button>
        ))}
      </div>

      {featured.length > 0 && (
        <>
          <div className="section-label">
            <span>Em destaque</span>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={onOpen} favorite={favorites.includes(p.id)} onToggleFav={onToggleFav} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

function ProductScreen({ product, favorite, onToggleFav, onBack, onAddToCart }) {
  const category = CATEGORIES.find((c) => c.id === product.category_id);
  return (
    <>
      <TopBar
        title={category ? category.label : ""}
        onBack={onBack}
        right={
          <button className="icon-btn" onClick={() => onToggleFav(product.id)}>
            <Icon.Heart filled={favorite} />
          </button>
        }
      />
      <div style={{ padding: "0 24px" }}>
        <div
          className="product-frame"
          style={{ background: `linear-gradient(160deg, hsl(${product.tone} 20% 88%), hsl(${(product.tone + 10) % 360} 15% 78%))` }}
        />
      </div>
      <div style={{ padding: "20px 24px 16px", flex: 1 }}>
        <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)" }}>{product.store_name}</p>
        <h2 className="serif" style={{ fontSize: 22, margin: "6px 0 0", fontWeight: 400 }}>
          {product.name}
        </h2>
        <p style={{ fontSize: 16, margin: "8px 0 0" }}>{kz(product.price_kz)}</p>

        <div className="divider" style={{ borderTop: "1px solid var(--line)", margin: "20px 0 0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, margin: 0, fontWeight: 500 }}>{product.store_name}</p>
            <p className="muted" style={{ margin: "2px 0 0" }}>{product.city}</p>
          </div>
          <span className="muted" style={{ color: product.stock > 0 ? "#8A7F73" : "var(--danger)" }}>
            {product.stock > 0 ? `${product.stock} em stock` : "Esgotado"}
          </span>
        </div>
      </div>
      <div style={{ padding: "8px 24px 28px" }}>
        <Button onClick={onAddToCart} disabled={product.stock <= 0}>
          {product.stock > 0 ? "Adicionar ao carrinho" : "Esgotado"}
        </Button>
      </div>
    </>
  );
}

function CartScreen({ cart, total, onRemove, onBack, onCheckout, busy }) {
  return (
    <>
      <TopBar title="Carrinho" onBack={onBack} />
      <div style={{ padding: "0 24px", flex: 1 }}>
        {cart.length === 0 ? (
          <div className="empty-state">
            <Icon.Heart color="#E1D3C5" />
            <p style={{ marginTop: 16 }}>O teu carrinho está vazio.</p>
          </div>
        ) : (
          cart.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
              <div style={{ width: 64, aspectRatio: "4 / 5", background: `hsl(${p.tone} 20% 86%)`, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="product-seller">{p.store_name}</p>
                <p className="product-name serif">{p.name}</p>
                <p className="product-price">{kz(p.price_kz)}</p>
              </div>
              <button className="icon-btn" onClick={() => onRemove(i)}>
                <Icon.Close />
              </button>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div style={{ padding: "16px 24px 28px", borderTop: "1px solid var(--ink)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span className="muted" style={{ textTransform: "uppercase", letterSpacing: "0.16em" }}>
              Total ({cart.length})
            </span>
            <span className="serif" style={{ fontSize: 17 }}>{kz(total)}</span>
          </div>
          <Button variant="accent" onClick={onCheckout} disabled={busy}>
            {busy ? "A processar…" : "Finalizar compra"}
          </Button>
          <p className="muted" style={{ textAlign: "center", marginTop: 12 }}>
            Pagamento simulado — liga o Multicaixa Express quando tiveres a conta comercial.
          </p>
        </div>
      )}
