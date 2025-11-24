"use client"

import { useState, useEffect } from "react"
import paolo from "../paolo.jpg";
import frinz from "../frinz.jpg";
import holan from "../holan.jpg";
import kate from "../kate.jpg";

const API_URL = "http://localhost:5000/api"

const authAnimationStyles = `
  @keyframes slideInLeft {
    from {
      transform: translateX(0);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
  
  @keyframes slideInFromRight {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  .auth-left-panel {
    animation: slideInFromRight 0.6s ease-out;
    transition: background-color 0.6s ease-out;
  }
  
  .auth-right-panel {
    animation: slideInLeft 0.6s ease-out;
  }
`

// Add styles to document
const styleSheet = document.createElement("style")
styleSheet.textContent = authAnimationStyles
if (!document.head.querySelector("style[data-auth-animations]")) {
  styleSheet.setAttribute("data-auth-animations", "true")
  document.head.appendChild(styleSheet)
}

const SearchIntellisense = ({ products, onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const generateSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const lowerQuery = query.toLowerCase()

    const filteredProducts = products.filter(
      (product) => product.name.toLowerCase().includes(lowerQuery) || product.brand.toLowerCase().includes(lowerQuery),
    )

    const exactMatches = filteredProducts.filter((p) => p.name.toLowerCase().startsWith(lowerQuery))
    const partialMatches = filteredProducts.filter((p) => !p.name.toLowerCase().startsWith(lowerQuery))

    const suggestions = [...exactMatches, ...partialMatches].slice(0, 8)

    setSuggestions(suggestions)
    setShowSuggestions(true)
    setSelectedIndex(-1)
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    onChange(query)
    generateSuggestions(query)
  }

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.name)
    setShowSuggestions(false)
    setSuggestions([])
    onSelect(suggestion)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setShowSuggestions(false)
        break
      default:
        break
    }
  }

  const highlightMatch = (text, query) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} style={{ fontWeight: "700", color: "#3b82f6" }}>
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type="text"
        placeholder="🔍 Search for products..."
        value={value}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value && setShowSuggestions(true)}
        style={{
          width: "100%",
          padding: "1rem 1.5rem",
          borderRadius: "50px",
          border: showSuggestions && suggestions.length > 0 ? "2px solid #3b82f6" : "2px solid transparent",
          fontSize: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.2s",
          boxSizing: "border-box",
        }}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "2px solid #3b82f6",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: "400px",
            overflowY: "auto",
            marginTop: "-4px",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion._id}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              style={{
                padding: "1rem 1.5rem",
                cursor: "pointer",
                background: index === selectedIndex ? "#f0f9ff" : index % 2 === 0 ? "#fafbfc" : "white",
                borderBottom: index < suggestions.length - 1 ? "1px solid #e5e7eb" : "none",
                transition: "background 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>📱</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#0f172a",
                    marginBottom: "0.25rem",
                  }}
                >
                  {highlightMatch(suggestion.name, value)}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{suggestion.brand}</div>
              </div>
              {index === selectedIndex && (
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#3b82f6",
                    fontWeight: "600",
                  }}
                >
                  ↩️
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && suggestions.length === 0 && value.trim() && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "2px solid #ef4444",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            padding: "1.5rem",
            textAlign: "center",
            color: "#64748b",
            marginTop: "-4px",
          }}
        >
          No products found for "{value}"
        </div>
      )}
    </div>
  )
}

const UserStore = ({ setIsAdminLoggedIn }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState("home")
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [sortBy, setSortBy] = useState("default")
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  })

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  })

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
  })

  useEffect(() => {
    checkAuthStatus()
    fetchProducts()
    loadCartFromStorage()
    loadWishlistFromStorage()
  }, [])

  useEffect(() => {
    if (isAuthenticated && currentUser?._id) {
      loadUserProfile()
    }
  }, [isAuthenticated, currentUser?._id])

  useEffect(() => {
    if (cart.length > 0) {
      // Only save if cart is not empty
      saveCartToStorage()
    } else {
      // Clear storage if cart is empty
      localStorage.removeItem("nextech_cart")
    }
  }, [cart])

  useEffect(() => {
    if (wishlist.length > 0) {
      // Only save if wishlist is not empty
      saveWishlistToStorage()
    } else {
      // Clear storage if wishlist is empty
      localStorage.removeItem("nextech_wishlist")
    }
  }, [wishlist])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const checkAuthStatus = () => {
    const token = localStorage.getItem("nextech_user_token")
    const user = localStorage.getItem("nextech_user")
    const adminToken = localStorage.getItem("nextech_admin_token")

    if (adminToken) {
      setIsAuthenticated(true)
      setCurrentUser(JSON.parse(user))
      setCurrentPage("admin") // Assume admin lands on an admin page
    } else if (token && user) {
      setIsAuthenticated(true)
      const userData = JSON.parse(user)
      setCurrentUser(userData)
      setProfileForm({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        currentPassword: "",
        newPassword: "",
      })
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      setProducts(data.filter((p) => p.status === "active"))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/user/${currentUser?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("nextech_user_token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("nextech_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const saveCartToStorage = () => {
    localStorage.setItem("nextech_cart", JSON.stringify(cart))
  }

  const loadWishlistFromStorage = () => {
    const savedWishlist = localStorage.getItem("nextech_wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }

  const saveWishlistToStorage = () => {
    localStorage.setItem("nextech_wishlist", JSON.stringify(wishlist))
  }

  const formatPrice = (price) => "₱" + price.toLocaleString("en-PH")

  const handleAuth = async () => {
    if (authMode === "register") {
      if (!authForm.name || !authForm.email || !authForm.password || !authForm.phone) {
        alert("Please fill in all required fields")
        return
      }
    } else {
      if (!authForm.email || !authForm.password) {
        alert("Please fill in all fields")
        return
      }
    }

    setLoading(true)

    try {
      if (authMode === "login" && authForm.email === "admin@" && authForm.password === "admin123") {
        console.log("[v0] Admin login detected")
        localStorage.setItem("nextech_admin_token", "admin_token_" + Date.now())
        localStorage.setItem(
          "nextech_user",
          JSON.stringify({
            name: "Admin",
            email: "admin@",
            isAdmin: true,
          }),
        )
        if (setIsAdminLoggedIn) {
          setIsAdminLoggedIn(true)
        }
        setIsAuthenticated(true)
        setCurrentUser({ name: "Admin", email: "admin@", isAdmin: true })
        setShowAuthModal(false)
        setAuthForm({ name: "", email: "", password: "", phone: "", address: "" })
        alert("Admin login successful!")
        // Removed setCurrentPage("admin") here, it will be handled by the parent if needed
        setLoading(false)
        return
      }

      const endpoint = authMode === "login" ? "/users/login" : "/users/register"
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          authMode === "register"
            ? authForm
            : {
                email: authForm.email,
                password: authForm.password,
              },
        ),
      })

   const data = await response.json()

      if (data.success) {
        if (authMode === "login") {
          // Only auto-login for login mode
          localStorage.setItem("nextech_user_token", data.token)
          localStorage.setItem("nextech_user", JSON.stringify(data.user))
          setIsAuthenticated(true)
          setCurrentUser(data.user)
          setShowAuthModal(false)
          setAuthForm({ name: "", email: "", password: "", phone: "", address: "" })
          alert("Login successful!")
          setCurrentPage("home")
        } else {
          // For registration, just show success and switch to login mode
          alert("Registration successful! Please sign in with your credentials.")
          setAuthMode("login")
          setAuthForm({ name: "", email: "", password: "", phone: "", address: "" })
        }
      } else {
        alert(data.message || "Authentication failed")
      }
    } catch (error) {
      console.error("Auth error:", error)
      alert("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("nextech_user_token")
    localStorage.removeItem("nextech_user")
    localStorage.removeItem("nextech_admin_token")
    setIsAuthenticated(false)
    setCurrentUser(null)
    setCart([])
    setWishlist([])
    setOrders([])
    setCurrentPage("home") // Reset to home page
    alert("Logged out successfully!")
    // Notify parent App component that admin has logged out
    if (setIsAdminLoggedIn) {
      setIsAdminLoggedIn(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!profileForm.name || !profileForm.email || !profileForm.phone) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/users/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("nextech_user_token")}`,
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          address: profileForm.address,
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCurrentUser(data.user)
        localStorage.setItem("nextech_user", JSON.stringify(data.user))
        alert("Profile updated successfully!")
        setProfileForm({ ...profileForm, currentPassword: "", newPassword: "" })
      } else {
        alert(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart")
      setShowAuthModal(true)
      return
    }

    const existingItem = cart.find((item) => item._id === product._id)
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("Cannot add more items than available in stock")
        return
      }
      setCart(cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    const product = products.find((p) => p._id === productId)
    if (newQuantity > product.stock) {
      alert("Cannot exceed available stock")
      return
    }
    setCart(cart.map((item) => (item._id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleWishlist = (product) => {
    if (!isAuthenticated) {
      alert("Please login to add items to wishlist")
      setShowAuthModal(true)
      return
    }

    const exists = wishlist.find((item) => item._id === product._id)
    if (exists) {
      setWishlist(wishlist.filter((item) => item._id !== product._id))
    } else {
      setWishlist([...wishlist, product])
    }
  }

  const moveToCart = (product) => {
    addToCart(product)
    setWishlist(wishlist.filter((item) => item._id !== product._id))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("nextech_user_token")
      const response = await fetch(`${API_URL}/users/profile/${currentUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCheckoutForm({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            paymentMethod: "cod",
          })
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const handleCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)

    const orderData = {
      orderId: `ORD-${Date.now()}`,
      customer: checkoutForm.name,
      email: checkoutForm.email,
      phone: checkoutForm.phone,
      address: checkoutForm.address,
      date: new Date().toISOString(),
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: getCartTotal(),
      status: "Processing",
      paymentMethod: checkoutForm.paymentMethod,
      userId: currentUser?._id,
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("nextech_user_token")}`,
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        alert("Order placed successfully! Order ID: " + orderData.orderId)
        clearCart()
        setCheckoutForm({ name: "", email: "", phone: "", address: "", paymentMethod: "cod" })
        setShowCheckout(false)
        setShowCart(false)
        fetchProducts()
        fetchOrders()
        setCurrentPage("orders")
      } else {
        const error = await response.json()
        console.error("Order error:", error)
        alert("Failed to place order. Please try again.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getFilteredProducts = () => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedBrand !== "all") {
      filtered = filtered.filter((p) => p.brand === selectedBrand)
    }

    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "newest") {
      filtered = [...filtered].reverse()
    }

    return filtered
  }

  const getNewArrivals = () => products.slice(0, 4)
  const getBestSelling = () => products.filter((p) => p.stock < 20).slice(0, 4)
  const getRecommendations = (category) => {
    return products.slice(0, 4)
  }

  const brands = ["all", ...new Set(products.map((p) => p.brand))]

  const renderNavigation = () => (
    <nav
      style={{
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "1rem 0",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setCurrentPage("home")}
              style={{
                background: currentPage === "home" ? "#3b82f6" : "transparent",
                color: currentPage === "home" ? "white" : "#374151",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
               Home
            </button>

            <button
              onClick={() => setCurrentPage("shop")}
              style={{
                background: currentPage === "shop" ? "#3b82f6" : "transparent",
                color: currentPage === "shop" ? "white" : "#374151",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
               Shop
            </button>

            {isAuthenticated && !currentUser?.isAdmin && (
              <>
                <button
                  onClick={() => setCurrentPage("wishlist")}
                  style={{
                    background: currentPage === "wishlist" ? "#3b82f6" : "transparent",
                    color: currentPage === "wishlist" ? "white" : "#374151",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    position: "relative",
                  }}
                >
                   Wishlist
                  {wishlist.length > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0.25rem",
                        right: "0.25rem",
                        background: "#ef4444",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        fontSize: "0.7rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentPage("orders")}
                  style={{
                    background: currentPage === "orders" ? "#3b82f6" : "transparent",
                    color: currentPage === "orders" ? "white" : "#374151",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                   Orders
                </button>

                <button
                  onClick={() => setCurrentPage("recommendations")}
                  style={{
                    background: currentPage === "recommendations" ? "#3b82f6" : "transparent",
                    color: currentPage === "recommendations" ? "white" : "#374151",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                   Recommendations
                </button>
              </>
            )}

            {isAuthenticated && currentUser?.isAdmin && (
              <button
                onClick={() => setCurrentPage("admin")}
                style={{
                  background: currentPage === "admin" ? "#3b82f6" : "transparent",
                  color: currentPage === "admin" ? "white" : "#374151",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                }}
              >
                 Admin
              </button>
            )}
            
            <button
              onClick={() => setCurrentPage("about")}
              style={{
                background: currentPage === "about" ? "#3b82f6" : "transparent",
                color: currentPage === "about" ? "white" : "#374151",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
               About
            </button>
          </div>

         <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
  {isAuthenticated ? (
    <>
      <button
        onClick={() => setCurrentPage("account")}
        style={{
          background: currentPage === "account" ? "#3b82f6" : "transparent",
          color: currentPage === "account" ? "white" : "#374151",
          border: "none",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "1rem",
        }}
      >
        👤 Account
      </button>
    </>
  ) : (
    <></> // nothing displayed when not logged in
  )}
</div>

        </div>
      </div>
    </nav>
  )

  const renderProductCard = (product, showWishlist = true) => (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.3s",
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)"
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"
      }}
    >
      {showWishlist &&
        isAuthenticated &&
        !currentUser?.isAdmin && ( // Show wishlist button only for regular users
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleWishlist(product)
            }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: wishlist.find((item) => item._id === product._id) ? "#ef4444" : "#f3f4f6",
              border: "none",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            {wishlist.find((item) => item._id === product._id) ? "❤️" : "🤍"}
          </button>
        )}

      <div
        onClick={() => {
          setSelectedProduct(product)
          setCurrentPage("product-detail")
        }}
        style={{
          height: "200px",
          textAlign: "center",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {product.image ? (
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ color: "#d1d5db", fontSize: "3rem" }}>📦</span>
        )}
      </div>

      <div style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600", marginBottom: "0.5rem" }}>
        {product.brand}
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "#1f2937" }}>{product.name}</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3b82f6" }}>{formatPrice(product.price)}</div>
        <div
          style={{
            fontSize: "0.85rem",
            color: product.stock < 15 ? "#ef4444" : "#10b981",
            fontWeight: "600",
          }}
        >
          {product.stock} in stock
        </div>
      </div>
      <button
        onClick={() => addToCart(product)}
        disabled={product.stock === 0 || (isAuthenticated && currentUser?.isAdmin)} // Disable for out of stock or admin
        style={{
          width: "100%",
          background: product.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "#e5e7eb" : "#3b82f6",
          color: product.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "#9ca3af" : "white",
          border: "none",
          padding: "0.875rem",
          borderRadius: "8px",
          cursor: product.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "1rem",
        }}
      >
        {product.stock === 0
          ? "Out of Stock"
          : isAuthenticated && currentUser?.isAdmin
            ? "Admin Cannot Buy"
            : "🛒 Add to Cart"}
      </button>
    </div>
  )

  const renderHomePage = () => (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "4rem 3rem",
          color: "white",
          marginBottom: "3rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem" }}>Welcome to NexTech Store</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", opacity: 0.9 }}>
          Discover the latest smartphones and gadgets
        </p>
        <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
          <SearchIntellisense
            products={products}
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={(product) => {
              setSelectedProduct(product)
              setCurrentPage("product-detail")
            }}
          />
        </div>
      </div>

      {/* New Arrivals */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700" }}>🆕 New Arrivals</h2>
          <button
            onClick={() => {
              setCurrentPage("shop")
              setSortBy("newest")
            }}
            style={{
              background: "transparent",
              color: "#3b82f6",
              border: "2px solid #3b82f6",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            View All →
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {getNewArrivals().map((product) => renderProductCard(product))}
        </div>
      </section>

      {/* Best Selling */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "700" }}>🔥 Trending / Best-Selling</h2>
          <button
            onClick={() => setCurrentPage("shop")}
            style={{
              background: "transparent",
              color: "#3b82f6",
              border: "2px solid #3b82f6",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            View All →
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {getBestSelling().map((product) => renderProductCard(product))}
        </div>
      </section>

      {/* Personalized Recommendations (Authenticated Users) */}
      {isAuthenticated &&
        !currentUser?.isAdmin && ( // Show recommendations only for regular users
          <section>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}
            >
              <h2 style={{ fontSize: "2rem", fontWeight: "700" }}>✨ Recommended for You</h2>
              <button
                onClick={() => setCurrentPage("recommendations")}
                style={{
                  background: "transparent",
                  color: "#3b82f6",
                  border: "2px solid #3b82f6",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                View All →
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "2rem",
              }}
            >
              {getRecommendations("personal").map((product) => renderProductCard(product))}
            </div>
          </section>
        )}
    </div>
  )

  const renderShopPage = () => (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>🛍️ Shop</h1>

      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 200px", gap: "1rem" }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "0.875rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
            }}
          />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            style={{
              padding: "0.875rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand === "all" ? "All Brands" : brand}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "0.875rem",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <option value="default">Sort By</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem", color: "#6b7280" }}>
          Loading products...
        </div>
      ) : getFilteredProducts().length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem", color: "#6b7280" }}>
          No products found
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {getFilteredProducts().map((product) => renderProductCard(product))}
        </div>
      )}
    </div>
  )

  const renderProductDetail = () => {
    if (!selectedProduct) return null

    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <button
          onClick={() => setCurrentPage("shop")}
          style={{
            background: "#e5e7eb",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            marginBottom: "2rem",
          }}
        >
           Back to Shop
        </button>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "3rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
            <div>
              <div
                style={{
                  fontSize: "5rem",
                  textAlign: "center",
                  marginBottom: "2rem",
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span style={{ color: "#d1d5db", fontSize: "4rem" }}>📦</span>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.9rem", color: "#6b7280", fontWeight: "600", marginBottom: "0.5rem" }}>
                {selectedProduct.brand}
              </div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>{selectedProduct.name}</h1>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#3b82f6", marginBottom: "1.5rem" }}>
                {formatPrice(selectedProduct.price)}
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontWeight: "600" }}>Availability:</span>
                  <span
                    style={{
                      color: selectedProduct.stock > 0 ? "#10b981" : "#ef4444",
                      fontWeight: "700",
                    }}
                  >
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : "Out of Stock"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "600" }}>Status:</span>
                  <span
                    style={{
                      background: selectedProduct.status === "active" ? "#d1fae5" : "#fee2e2",
                      color: selectedProduct.status === "active" ? "#065f46" : "#991b1b",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {selectedProduct.status}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <button
                  onClick={() => addToCart(selectedProduct)}
                  disabled={selectedProduct.stock === 0 || (isAuthenticated && currentUser?.isAdmin)} // Disable for out of stock or admin
                  style={{
                    flex: 1,
                    background:
                      selectedProduct.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "#e5e7eb" : "#3b82f6",
                    color:
                      selectedProduct.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "#9ca3af" : "white",
                    border: "none",
                    padding: "1.25rem",
                    borderRadius: "8px",
                    cursor:
                      selectedProduct.stock === 0 || (isAuthenticated && currentUser?.isAdmin)
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                  }}
                >
                  {selectedProduct.stock === 0
                    ? "Out of Stock"
                    : isAuthenticated && currentUser?.isAdmin
                      ? "Admin Cannot Buy"
                      : "🛒 Add to Cart"}
                </button>

                {isAuthenticated &&
                  !currentUser?.isAdmin && ( // Show wishlist button only for regular users
                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      style={{
                        background: wishlist.find((item) => item._id === selectedProduct._id) ? "#ef4444" : "#f3f4f6",
                        color: wishlist.find((item) => item._id === selectedProduct._id) ? "white" : "#374151",
                        border: "none",
                        padding: "1.25rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        minWidth: "60px",
                      }}
                    >
                      {wishlist.find((item) => item._id === selectedProduct._id) ? "❤️" : "🤍"}
                    </button>
                  )}
              </div>

              <div
                style={{
                  borderTop: "2px solid #e5e7eb",
                  paddingTop: "1.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "1rem" }}>Product Description</h3>
                <p style={{ color: "#6b7280", lineHeight: "1.8" }}>
                  High-quality {selectedProduct.brand} {selectedProduct.name} featuring the latest technology and
                  premium build quality. Perfect for everyday use with excellent performance and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderWishlistPage = () => (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "4rem",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>❤️</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>Your wishlist is empty</h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Start adding products you love!</p>
          <button
            onClick={() => setCurrentPage("shop")}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
            }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {wishlist.map((product) => {
            const isBase64Image = typeof product.image === "string" && product.image.startsWith("data:image")
            const isEmoji = typeof product.image === "string" && !product.image.startsWith("data:")

            return (
              <div
                key={product._id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>

                <div
                  style={{
                    height: "220px",
                    background: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {isBase64Image ? (
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : isEmoji ? (
                    <div style={{ fontSize: "4rem" }}>{product.image}</div>
                  ) : (
                    <div style={{ fontSize: "4rem" }}>📦</div>
                  )}
                </div>

                <div style={{ fontSize: "0.85rem", color: "#6b7280", fontWeight: "600", marginBottom: "0.5rem" }}>
                  {product.brand}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "#1f2937" }}>
                  {product.name}
                </h3>
                <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3b82f6", marginBottom: "1rem" }}>
                  {formatPrice(product.price)}
                </div>
                <button
                  onClick={() => moveToCart(product)}
                  disabled={product.stock === 0 || (isAuthenticated && currentUser?.isAdmin)}
                  style={{
                    width: "100%",
                    background:
                      product.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "#e5e7eb" : "#10b981",
                    color: product.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "#9ca3af" : "white",
                    border: "none",
                    padding: "0.875rem",
                    borderRadius: "8px",
                    cursor:
                      product.stock === 0 || (isAuthenticated && currentUser?.isAdmin) ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : isAuthenticated && currentUser?.isAdmin
                      ? "Admin Cannot Buy"
                      : "🛒 Move to Cart"}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderOrdersPage = () => (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>📦 Purchase History</h1>

      {orders.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "4rem",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>📦</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>No orders yet</h2>
          <p style={{ color: "#6b7280", marginBottom: "2rem" }}>Start shopping to see your orders here!</p>
          <button
            onClick={() => setCurrentPage("shop")}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "1rem",
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Order ID</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#3b82f6" }}>{order.orderId}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Date</div>
                  <div style={{ fontWeight: "600" }}>{new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Status</div>
                  <span
                    style={{
                      background:
                        order.status === "Delivered"
                          ? "#d1fae5"
                          : order.status === "Shipped"
                            ? "#dbeafe"
                            : order.status === "Processing"
                              ? "#fef3c7"
                              : "#fee2e2",
                      color:
                        order.status === "Delivered"
                          ? "#065f46"
                          : order.status === "Shipped"
                            ? "#1e40af"
                            : order.status === "Processing"
                              ? "#b45309"
                              : "#991b1b",
                      padding: "0.5rem 1rem",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>Total</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3b82f6" }}>
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: "2px solid #f3f4f6",
                  paddingTop: "1.5rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>Items:</div>
                <div style={{ color: "#6b7280" }}>
                  {order.items &&
                    order.items.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: "0.5rem" }}>
                        {item.name} x{item.quantity} - {formatPrice(item.price * item.quantity)}
                      </div>
                    ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  🔍 Track Order
                </button>
                {order.status === "Delivered" && (
                  <button
                    style={{
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    ↩️ Return / Refund
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderRecommendationsPage = () => (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>💡 Recommendations</h1>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem" }}>📚 For School Use</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {getRecommendations("school").map((product) => renderProductCard(product))}
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem" }}>🎮 For Gaming</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {getRecommendations("gaming").map((product) => renderProductCard(product))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem" }}>💼 For Business</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {getRecommendations("business").map((product) => renderProductCard(product))}
        </div>
      </section>
    </div>
  )

  const renderAboutPage = () => (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>ℹ️ About Us</h1>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "3rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem" }}>Project Overview</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#6b7280", marginBottom: "1.5rem" }}>
          NexTech Store is a modern e-commerce platform dedicated to providing the latest smartphones and gadgets to
          tech enthusiasts. Our mission is to make technology accessible to everyone with competitive pricing and
          excellent customer service.
        </p>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#6b7280" }}>
          We offer a wide range of products from leading brands, ensuring quality and authenticity in every purchase.
          Our platform provides a seamless shopping experience with features like wishlists, personalized
          recommendations, and order tracking.
        </p>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem" }}>Developer Team</h2>

       <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "2rem",
  }}
>
  {[
    { name: "Milaya, Jan Paolo L.", role: "Back End Developer", img: paolo },
    { name: "Katindig, Frinz Mathew", role: "Frontend Developer", img: frinz },
    { name: "Domingo, Holan R.", role: "Documentation", img: holan },
    { name: "Mariano, Kate Margarette", role: "Documentation", img: kate},
  ].map((dev, index) => (
    <div
      key={index}
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Profile Image */}
      <img
        src={dev.img}
        alt={dev.name}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "1rem",
          border: "3px solid #e5e7eb",
        }}
      />

      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: "700",
          marginBottom: "0.5rem",
        }}
      >
        {dev.name}
      </h3>

      <p style={{ color: "#6b7280", fontWeight: "600" }}>{dev.role}</p>
    </div>
  ))}
</div>
      </div>
    </div>
  )

  const renderAccountPage = () => (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>👤 My Account</h1>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "2rem" }}>Profile Information</h2>

        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Phone Number</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Address</label>
            <textarea
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              rows={3}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              borderTop: "2px solid #e5e7eb",
              paddingTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "1.5rem" }}>Change Password</h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Current Password</label>
              <input
                type="password"
                value={profileForm.currentPassword}
                onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>New Password</label>
              <input
                type="password"
                value={profileForm.newPassword}
                onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                placeholder="Enter new password"
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              style={{
                flex: 1,
                background: loading ? "#93c5fd" : "#3b82f6",
                color: "white",
                border: "none",
                padding: "1rem",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "1rem",
              }}
            >
              {loading ? "Updating..." : " Save Changes"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                background: "rgba(239,68,68,0.9)",
                color: "white",
                border: "none",
                padding: "1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1rem",
              }}
            >
               Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAdminPanel = () => (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>⚙️ Admin Dashboard</h1>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <p>Welcome, Admin! This is where you can manage products, orders, and users.</p>
      </div>
    </div>
  )

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
     {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "1.5rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            onClick={() => setCurrentPage("home")}
            style={{ fontSize: "2rem", fontWeight: "800", margin: 0, cursor: "pointer" }}
          >
             NexTech Store
          </h1>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => setCurrentPage("home")}
                  style={{
                    background: "white",
                    color: "#667eea",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                   Home
                </button>
                <button
                  onClick={() => setCurrentPage("shop")}
                  style={{
                    background: "white",
                    color: "#667eea",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                   Shop
                </button>
                <button
                  onClick={() => setCurrentPage("about")}
                  style={{
                    background: "white",
                    color: "#667eea",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "50px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                   About
                </button>
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <div
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    padding: "0.5rem 1rem",
                    borderRadius: "50px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  👤 {currentUser?.name}
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login")
                  setShowAuthModal(true)
                }}
                style={{
                  background: "white",
                  color: "#667eea",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "50px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "1rem",
                }}
              >
                 Login / Register
              </button>
            )}

            <button
              onClick={() => setShowCart(true)}
              disabled={isAuthenticated && currentUser?.isAdmin}
              style={{
                background: "white",
                color: "#667eea",
                border: "none",
                padding: "0.875rem 1.5rem",
                borderRadius: "50px",
                cursor: isAuthenticated && currentUser?.isAdmin ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                position: "relative",
              }}
            >
              🛒 Cart
              {getCartCount() > 0 && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "800",
                  }}
                >
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      {/* Navigation */}
     {isAuthenticated && renderNavigation()}
      {/* Main Content */}
      {currentPage === "home" && renderHomePage()}
      {currentPage === "shop" && renderShopPage()}
      {currentPage === "product-detail" && renderProductDetail()}
      {currentPage === "wishlist" && renderWishlistPage()}
      {currentPage === "orders" && renderOrdersPage()}
      {currentPage === "recommendations" && renderRecommendationsPage()}
      {currentPage === "about" && renderAboutPage()}
      {currentPage === "account" && renderAccountPage()}
      {currentPage === "admin" && renderAdminPanel()}
      {/* Auth Modal */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "900px",
              display: "flex",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="auth-left-panel"
              style={{
                background: "linear-gradient(135deg, #4C3D8F 0%, #2D1B4E 100%)",
                color: "white",
                padding: "3rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minWidth: "280px",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>
                {authMode === "login" ? "Welcome Back!" : "Welcome to NexTech!"}
              </h2>
              <p style={{ fontSize: "1rem", marginBottom: "2rem", lineHeight: "1.6" }}>
                {authMode === "login"
                  ? "To keep connected with us please login with your personal info"
                  : "Join us today and start shopping your favorite tech products"}
              </p>
              <button
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                style={{
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  padding: "0.75rem 2rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {authMode === "login" ? "SIGN UP" : "SIGN IN"}
              </button>
            </div>

            <div
              className="auth-right-panel"
              style={{
                padding: "3rem",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem" }}>
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p style={{ color: "#9ca3af", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                {authMode === "login" ? "Login to your account" : "or use your email for registration"}
              </p>

              {authMode === "register" && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
                    <button
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        cursor: "pointer",
                        fontSize: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Facebook"
                    >
                      f
                    </button>
                    <button
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        cursor: "pointer",
                        fontSize: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Google"
                    >
                      G
                    </button>
                    <button
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        cursor: "pointer",
                        fontSize: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="LinkedIn"
                    >
                      in
                    </button>
                  </div>
                  <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.9rem" }}>
                    or use your email for registration
                  </p>
                </div>
              )}

              <div>
                {authMode === "register" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      placeholder="Juan Dela Cruz"
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        background: "#f3f4f6",
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    placeholder="juan@example.com"
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      background: "#f3f4f6",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      background: "#f3f4f6",
                    }}
                  />
                </div>

                {authMode === "register" && (
                  <>
                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={authForm.phone}
                        onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                        placeholder="+63 912 345 6789"
                        style={{
                          width: "100%",
                          padding: "0.875rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          background: "#f3f4f6",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label
                        style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}
                      >
                        Address (Optional)
                      </label>
                      <textarea
                        value={authForm.address}
                        onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })}
                        placeholder="Street, Barangay, City, Province"
                        rows={2}
                        style={{
                          width: "100%",
                          padding: "0.875rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          background: "#f3f4f6",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleAuth}
                  disabled={loading}
                  style={{
                    width: "100%",
                    background: loading ? "#5E4FA5" : "#4C3D8F",
                    color: "white",
                    border: "none",
                    padding: "0.875rem",
                    borderRadius: "25px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Cart Modal */}
      {showCart && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "1100px",
              maxHeight: "90vh",
              display: "grid",
              gridTemplateColumns: "1.2fr 380px",
              overflow: "hidden",
              gap: 0,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Left Column - Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", background: "#fafbfc" }}>
              <div style={{ padding: "2.5rem 2rem", borderBottom: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: "1.875rem", fontWeight: "700", margin: 0, color: "#0f172a" }}>Shopping Cart</h2>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
                    <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>Your cart is empty</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: "flex",
                          gap: "1.25rem",
                          padding: "1.25rem",
                          background: "white",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          transition: "box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none"
                        }}
                      >
                        {/* Product Image */}
                        <div
                          style={{
                            fontSize: "2.5rem",
                            width: "80px",
                            height: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f1f5f9",
                            borderRadius: "10px",
                            flexShrink: 0,
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                borderRadius: "8px",
                              }}
                            />
                          ) : (
                            <span style={{ color: "#d1d5db", fontSize: "2rem" }}>📦</span>
                          )}
                        </div>

                        {/* Product Details */}
                        <div
                          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                        >
                          <div>
                            <div
                              style={{ fontWeight: "700", fontSize: "1rem", color: "#0f172a", marginBottom: "0.25rem" }}
                            >
                              {item.name}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
                              {item.brand}
                            </div>
                          </div>
                          <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            gap: "0.75rem",
                          }}
                        >
                          {/* Quantity Controls */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              background: "#f1f5f9",
                              borderRadius: "8px",
                              padding: "0.25rem",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <button
                              onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                              style={{
                                background: "transparent",
                                border: "none",
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "1rem",
                                color: "#64748b",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "white"
                                e.currentTarget.style.color = "#0f172a"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent"
                                e.currentTarget.style.color = "#64748b"
                              }}
                            >
                              −
                            </button>
                            <span
                              style={{
                                fontWeight: "600",
                                minWidth: "28px",
                                textAlign: "center",
                                fontSize: "0.95rem",
                                color: "#0f172a",
                              }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                              style={{
                                background: "transparent",
                                border: "none",
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "1rem",
                                color: "#64748b",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "white"
                                e.currentTarget.style.color = "#0f172a"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent"
                                e.currentTarget.style.color = "#64748b"
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            style={{
                              background: "transparent",
                              color: "#94a3b8",
                              border: "none",
                              padding: "0.375rem 0.75rem",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#dc2626"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "#94a3b8"
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Back to Shop Link */}
              {cart.length > 0 && (
                <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid #e2e8f0", background: "white" }}>
                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      padding: 0,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#0f172a"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#64748b"
                    }}
                  >
                    ← Back to shop
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Summary */}
            <div
              style={{ background: "white", display: "flex", flexDirection: "column", borderLeft: "1px solid #e2e8f0" }}
            >
              <div style={{ padding: "2rem 1.75rem", borderBottom: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0, color: "#0f172a" }}>Summary</h3>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.75rem",
                }}
              >
                {/* Items Summary */}
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      color: "#94a3b8",
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    ITEMS
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <span style={{ color: "#64748b", fontSize: "0.95rem" }}>({cart.length} items)</span>
                    <span style={{ fontWeight: "700", fontSize: "1rem", color: "#0f172a" }}>
                      {formatPrice(getCartTotal())}
                    </span>
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#94a3b8",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      marginBottom: "0.75rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    SHIPPING
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.95rem",
                      background: "white",
                      cursor: "pointer",
                      color: "#0f172a",
                      fontWeight: "500",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0f172a"
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0"
                    }}
                  >
                    <option>Standard: ₱5.00</option>
                    <option>Express: ₱12.00</option>
                    <option>Overnight: ₱25.00</option>
                  </select>
                </div>

                {/* Promo Code */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: "#94a3b8",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      marginBottom: "0.75rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    PROMO CODE
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Enter code"
                      style={{
                        flex: 1,
                        padding: "0.875rem",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.9rem",
                        color: "#0f172a",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#0f172a"
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e2e8f0"
                      }}
                    />
                    <button
                      style={{
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        padding: "0.875rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e2e8f0"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f1f5f9"
                      }}
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>

              {/* Total and Checkout */}
              <div style={{ padding: "1.75rem", borderTop: "1px solid #e2e8f0", background: "#fafbfc" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <span style={{ fontWeight: "700", color: "#64748b", fontSize: "0.85rem" }}>TOTAL</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0f172a" }}>
                    {formatPrice(getCartTotal() + 5)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert("Please login to checkout")
                      setShowCart(false)
                      setShowAuthModal(true)
                      return
                    }
                    setShowCart(false)
                    setShowCheckout(true)
                  }}
                  style={{
                    width: "100%",
                    background: "#0f172a",
                    color: "white",
                    border: "none",
                    padding: "1rem",
                    borderRadius: "8px",
                    cursor: cart.length === 0 ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    letterSpacing: "0.03em",
                    transition: "background 0.2s",
                    opacity: cart.length === 0 ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (cart.length > 0) {
                      e.currentTarget.style.background = "#1e293b"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0f172a"
                  }}
                  disabled={cart.length === 0}
                >
                  CHECKOUT
                </button>

                <button
                  onClick={() => setShowCart(false)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    padding: "0.875rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    marginTop: "0.75rem",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f1f5f9"
                    e.currentTarget.style.borderColor = "#cbd5e1"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Checkout Modal */}
      {showCheckout && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem 2rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.875rem", fontWeight: "800", marginBottom: "0.5rem", color: "#0f172a" }}>
                Checkout
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>Complete your order</p>
            </div>

            <div>
              {/* Full Name */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.625rem",
                    fontWeight: "600",
                    color: "#0f172a",
                    fontSize: "0.95rem",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                  placeholder="Juan Dela Cruz"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0f172a"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.625rem",
                    fontWeight: "600",
                    color: "#0f172a",
                    fontSize: "0.95rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                  placeholder="juan@example.com"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0f172a"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                />
              </div>

              {/* Phone Number */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.625rem",
                    fontWeight: "600",
                    color: "#0f172a",
                    fontSize: "0.95rem",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                  placeholder="+63 912 345 6789"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0f172a"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                />
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.625rem",
                    fontWeight: "600",
                    color: "#0f172a",
                    fontSize: "0.95rem",
                  }}
                >
                  Delivery Address
                </label>
                <textarea
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  placeholder="Street, City, Province, Postal Code"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    resize: "vertical",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0f172a"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.625rem",
                    fontWeight: "600",
                    color: "#0f172a",
                    fontSize: "0.95rem",
                  }}
                >
                  Payment Method
                </label>
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    color: "#0f172a",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0f172a"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="GCash">GCash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {/* Order Summary */}
              <div
                style={{
                  background: "#fafbfc",
                  padding: "1.5rem",
                  borderRadius: "10px",
                  marginBottom: "2rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: "#0f172a",
                    margin: "0 0 1rem 0",
                  }}
                >
                  Order Summary
                </h3>
                {cart.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "#64748b" }}>
                      {item.name} <span style={{ color: "#94a3b8" }}>x{item.quantity}</span>
                    </span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "1.05rem",
                    fontWeight: "700",
                    color: "#0f172a",
                  }}
                >
                  <span>Total:</span>
                  <span>{formatPrice(getCartTotal() + 5)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => setShowCheckout(false)}
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: "#f1f5f9",
                    color: "#0f172a",
                    border: "1px solid #e2e8f0",
                    padding: "0.95rem",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#e2e8f0"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#f1f5f9"
                    }
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: loading ? "#cbd5e1" : "#0f172a",
                    color: "white",
                    border: "none",
                    padding: "0.95rem",
                    borderRadius: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#1e293b"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#0f172a"
                    }
                  }}
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "3rem 2rem 1.5rem",
          marginTop: "4rem",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Footer Content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "3rem",
              marginBottom: "2rem",
            }}
          >
            {/* About Section */}
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "1rem" }}>🚀 NexTech Store</h3>
              <p style={{ lineHeight: "1.8", opacity: 0.9, fontSize: "0.95rem" }}>
                Your trusted destination for the latest smartphones and gadgets. Quality products, competitive prices,
                and excellent customer service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem" }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  onClick={() => setCurrentPage("home")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    opacity: 0.9,
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage("shop")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    opacity: 0.9,
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
                >
                  Shop
                </button>
                <button
                  onClick={() => setCurrentPage("about")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    opacity: 0.9,
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
                >
                  About Us
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => setCurrentPage("account")}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "white",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      opacity: 0.9,
                      padding: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.9)}
                  >
                    My Account
                  </button>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem" }}>Contact Us</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", opacity: 0.9 }}>
                <div style={{ fontSize: "0.95rem" }}>📧 support@nextech.com</div>
                <div style={{ fontSize: "0.95rem" }}>📞 +63 912 345 6789</div>
                <div style={{ fontSize: "0.95rem" }}>📍 Hagonoy, Bulacan PH</div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem" }}>Follow Us</h4>
              <div style={{ display: "flex", gap: "1rem" }}>
                {["📘", "📷", "🐦", "💼"].map((icon, idx) => (
                  <button
                    key={idx}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.3)"
                      e.currentTarget.style.transform = "translateY(-3px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.2)"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "1.5rem",
              textAlign: "center",
              opacity: 0.9,
              fontSize: "0.9rem",
            }}
          >
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} NexTech Store. All rights reserved. | Developed by Team NexTech
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserStore


