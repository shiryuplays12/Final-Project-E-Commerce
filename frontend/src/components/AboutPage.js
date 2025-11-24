import { useState } from "react"

const AboutPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null)

  const teamMembers = [
    { 
      name: "John Doe", 
      role: "Lead Developer", 
      emoji: "👨‍💻",
      description: "Full-stack expert with 10+ years experience",
      color: "#667eea"
    },
    { 
      name: "Jane Smith", 
      role: "Frontend Developer", 
      emoji: "👩‍💻",
      description: "React & UI/UX specialist",
      color: "#764ba2"
    },
    { 
      name: "Mike Johnson", 
      role: "Backend Developer", 
      emoji: "👨‍💼",
      description: "Database & API architecture guru",
      color: "#f59e0b"
    },
    { 
      name: "Sarah Williams", 
      role: "UI/UX Designer", 
      emoji: "🎨",
      description: "Creating beautiful user experiences",
      color: "#ec4899"
    },
  ]

  const features = [
    {
      icon: "🚀",
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "Multiple payment options with bank-level security",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: "✨",
      title: "Quality Products",
      description: "100% authentic products from trusted brands",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Always here to help with your queries",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ]

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: "😊" },
    { number: "500+", label: "Products", icon: "📱" },
    { number: "50+", label: "Brands", icon: "🏆" },
    { number: "99%", label: "Satisfaction", icon: "⭐" }
  ]

  return (
    <div style={{ 
      fontFamily: "system-ui, -apple-system, sans-serif", 
      background: "#f9fafb",
      minHeight: "100vh",
      padding: "2rem 0"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
        
        {/* Hero Section */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px",
          padding: "4rem 3rem",
          color: "white",
          marginBottom: "4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)"
        }}>
          {/* Decorative circles */}
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)"
          }}></div>
          <div style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ 
              fontSize: "3.5rem", 
              fontWeight: "900", 
              marginBottom: "1.5rem",
              textShadow: "0 2px 20px rgba(0,0,0,0.2)"
            }}>
              About NexTech Store
            </h1>
            <p style={{ 
              fontSize: "1.3rem", 
              opacity: 0.95,
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.8"
            }}>
              Your trusted destination for the latest smartphones and gadgets. 
              We're passionate about bringing cutting-edge technology to everyone.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          marginBottom: "4rem"
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                transition: "all 0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)"
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)"
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{stat.icon}</div>
              <div style={{ 
                fontSize: "2.5rem", 
                fontWeight: "900", 
                color: "#667eea",
                marginBottom: "0.5rem"
              }}>
                {stat.number}
              </div>
              <div style={{ 
                fontSize: "1rem", 
                color: "#6b7280",
                fontWeight: "600"
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "3rem",
          marginBottom: "4rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <div style={{
                display: "inline-block",
                padding: "0.5rem 1.5rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "50px",
                fontSize: "0.9rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
                letterSpacing: "0.05em"
              }}>
                OUR MISSION
              </div>
              <h2 style={{ 
                fontSize: "2.5rem", 
                fontWeight: "800", 
                marginBottom: "1.5rem",
                color: "#1f2937"
              }}>
                Empowering Lives Through Technology
              </h2>
              <p style={{ 
                fontSize: "1.1rem", 
                lineHeight: "1.9", 
                color: "#6b7280",
                marginBottom: "1.5rem"
              }}>
                At NexTech Store, we believe technology should be accessible to everyone. 
                We're dedicated to providing the latest smartphones and gadgets at competitive 
                prices, backed by exceptional customer service.
              </p>
              <p style={{ 
                fontSize: "1.1rem", 
                lineHeight: "1.9", 
                color: "#6b7280"
              }}>
                Our platform offers a seamless shopping experience with features like wishlists, 
                personalized recommendations, and real-time order tracking—all designed to make 
                your tech shopping journey effortless and enjoyable.
              </p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "20px",
              padding: "3rem",
              textAlign: "center",
              color: "white",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ fontSize: "8rem", opacity: 0.3, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>🚀</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "1rem" }}>
                  Innovation First
                </h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.7", opacity: 0.95 }}>
                  We constantly evolve to bring you the best shopping experience with cutting-edge features and technology.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "800", 
            textAlign: "center",
            marginBottom: "3rem",
            color: "#1f2937"
          }}>
            Why Choose Us?
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem"
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "2.5rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "2px solid transparent"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)"
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)"
                  e.currentTarget.style.borderImage = feature.gradient
                  e.currentTarget.style.borderImageSlice = "1"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)"
                  e.currentTarget.style.border = "2px solid transparent"
                }}
              >
                <div style={{
                  width: "70px",
                  height: "70px",
                  background: feature.gradient,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  marginBottom: "1.5rem",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: "1.4rem", 
                  fontWeight: "700", 
                  marginBottom: "1rem",
                  color: "#1f2937"
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: "#6b7280", 
                  lineHeight: "1.7",
                  fontSize: "1rem"
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{
              display: "inline-block",
              padding: "0.5rem 1.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: "50px",
              fontSize: "0.9rem",
              fontWeight: "700",
              marginBottom: "1rem",
              letterSpacing: "0.05em"
            }}>
              OUR TEAM
            </div>
            <h2 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "800",
              color: "#1f2937",
              marginBottom: "1rem"
            }}>
              Meet the Awesome Team
            </h2>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "#6b7280",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              Passionate professionals dedicated to bringing you the best tech shopping experience
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem"
          }}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "white",
                  borderRadius: "24px",
                  padding: "2.5rem",
                  textAlign: "center",
                  boxShadow: hoveredCard === index 
                    ? "0 20px 60px rgba(0,0,0,0.2)" 
                    : "0 4px 15px rgba(0,0,0,0.08)",
                  transform: hoveredCard === index ? "translateY(-12px)" : "translateY(0)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Background decoration */}
                <div style={{
                  position: "absolute",
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background: `radial-gradient(circle, ${member.color}15 0%, transparent 70%)`,
                  opacity: hoveredCard === index ? 1 : 0,
                  transition: "opacity 0.4s"
                }}></div>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: "120px",
                    height: "120px",
                    background: `linear-gradient(135deg, ${member.color} 0%, ${member.color}dd 100%)`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3.5rem",
                    margin: "0 auto 1.5rem",
                    boxShadow: `0 8px 30px ${member.color}40`,
                    transform: hoveredCard === index ? "scale(1.1) rotate(5deg)" : "scale(1)",
                    transition: "all 0.4s"
                  }}>
                    {member.emoji}
                  </div>
                  
                  <h3 style={{ 
                    fontSize: "1.5rem", 
                    fontWeight: "800", 
                    marginBottom: "0.5rem",
                    color: "#1f2937"
                  }}>
                    {member.name}
                  </h3>
                  
                  <div style={{
                    display: "inline-block",
                    padding: "0.4rem 1rem",
                    background: `${member.color}15`,
                    color: member.color,
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    letterSpacing: "0.03em"
                  }}>
                    {member.role}
                  </div>
                  
                  <p style={{ 
                    color: "#6b7280",
                    lineHeight: "1.7",
                    fontSize: "0.95rem"
                  }}>
                    {member.description}
                  </p>

                  {/* Social icons */}
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    marginTop: "1.5rem",
                    opacity: hoveredCard === index ? 1 : 0,
                    transform: hoveredCard === index ? "translateY(0)" : "translateY(10px)",
                    transition: "all 0.4s"
                  }}>
                    {["💼", "🐦", "📧"].map((icon, i) => (
                      <div
                        key={i}
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "#f3f4f6",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                          cursor: "pointer",
                          transition: "all 0.3s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = member.color
                          e.currentTarget.style.transform = "scale(1.15)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f3f4f6"
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "24px",
          padding: "4rem 3rem",
          marginTop: "4rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "15rem",
            opacity: 0.1
          }}>
            🚀
          </div>
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "900", 
              marginBottom: "1rem"
            }}>
              Ready to Start Shopping?
            </h2>
            <p style={{ 
              fontSize: "1.2rem", 
              marginBottom: "2rem",
              opacity: 0.95
            }}>
              Explore our collection of the latest smartphones and gadgets
            </p>
            <button style={{
              background: "white",
              color: "#667eea",
              border: "none",
              padding: "1rem 3rem",
              borderRadius: "50px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)"
            }}
            >
              🛍️ Browse Products
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AboutPage