// Ferretería Estefi - JavaScript Module Completo
class FerreteriaApp {
    constructor() {
        this.products = [];
        this.cart = [];
        this.featuredProducts = [];
        this.currentCategory = 'all';
        this.productsPerPage = 12;
        this.currentPage = 1;
        this.currentUser = null;
        this.orders = [];
        
        this.initializeApp();
    }

    initializeApp() {
        this.initializeDatabase();
        this.loadProducts();
        this.setupEventListeners();
        this.updateCartCount();
        this.checkAuthStatus();
    }

    // Base de Datos Local
    initializeDatabase() {
        if (!localStorage.getItem('ferreteria_users')) {
            localStorage.setItem('ferreteria_users', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('ferreteria_orders')) {
            localStorage.setItem('ferreteria_orders', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('ferreteria_shipping_data')) {
            localStorage.setItem('ferreteria_shipping_data', JSON.stringify([]));
        }
        
        this.orders = JSON.parse(localStorage.getItem('ferreteria_orders')) || [];
    }

    // Gestión de Usuarios
    registerUser(userData) {
        const users = JSON.parse(localStorage.getItem('ferreteria_users'));
        
        if (users.find(user => user.email === userData.email)) {
            throw new Error('El email ya está registrado');
        }
        
        users.push({
            ...userData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('ferreteria_users', JSON.stringify(users));
        return true;
    }

    loginUser(email, password) {
        const users = JSON.parse(localStorage.getItem('ferreteria_users'));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('ferreteria_current_user', JSON.stringify(user));
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ferreteria_current_user');
        this.updateAuthUI();
        this.closeModal('profileModal');
        this.showNotification('Sesión cerrada correctamente');
    }

    checkAuthStatus() {
        const userData = localStorage.getItem('ferreteria_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
        this.updateAuthUI();
    }

    updateAuthUI() {
        const authButton = document.getElementById('authButton');
        const authText = document.getElementById('authText');
        
        if (this.currentUser) {
            authText.textContent = this.currentUser.name.split(' ')[0];
            authButton.innerHTML = `<i class="fas fa-user"></i><span id="authText">${this.currentUser.name.split(' ')[0]}</span>`;
        } else {
            authText.textContent = 'Iniciar Sesión';
            authButton.innerHTML = '<i class="fas fa-user"></i><span id="authText">Iniciar Sesión</span>';
        }
    }

    // Gestión de Órdenes
    saveOrder(orderData) {
        const order = {
            ...orderData,
            id: 'ORD-' + Date.now(),
            userId: this.currentUser ? this.currentUser.id : 'guest',
            status: 'completed',
            createdAt: new Date().toISOString()
        };
        
        this.orders.unshift(order);
        localStorage.setItem('ferreteria_orders', JSON.stringify(this.orders));
        return order;
    }

    saveShippingData(shippingData) {
        const shippingRecords = JSON.parse(localStorage.getItem('ferreteria_shipping_data'));
        const record = {
            ...shippingData,
            id: 'SHIP-' + Date.now(),
            userId: this.currentUser ? this.currentUser.id : 'guest',
            createdAt: new Date().toISOString()
        };
        
        shippingRecords.push(record);
        localStorage.setItem('ferreteria_shipping_data', JSON.stringify(shippingRecords));
        return record;
    }

    getUserOrders() {
        if (!this.currentUser) return [];
        return this.orders.filter(order => order.userId === this.currentUser.id);
    }

    // Product Data
    loadProducts() {
        this.featuredProducts = [
            {
                id: 1,
                name: "Taladro Percutor Profesional",
                category: "herramientas",
                price: 299.99,
                originalPrice: 349.99,
                image: "https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Taladro de impacto de 750W con función percutor, ideal para trabajos profesionales.",
                badge: "Más Vendido",
                featured: true
            },
            {
                id: 2,
                name: "Juego de Llaves Mixtas",
                category: "herramientas",
                price: 89.99,
                originalPrice: 109.99,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Set profesional de 32 piezas en estuche de metal organizado.",
                badge: "Oferta",
                featured: true
            },
            {
                id: 3,
                name: "Cable Eléctrico THHN 12 AWG",
                category: "electricidad",
                price: 45.50,
                image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Cable para instalaciones eléctricas interiores, 100 metros.",
                featured: true
            },
            {
                id: 4,
                name: "Pintura Latex Antimanchas",
                category: "pintura",
                price: 34.99,
                originalPrice: 42.99,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Pintura de acabado mate, cubre 40m² por galón, resistente a lavados.",
                badge: "Nuevo",
                featured: true
            }
        ];

        this.products = [
            ...this.featuredProducts,
            {
                id: 5,
                name: "Sierra Circular 7-1/4\"",
                category: "herramientas",
                price: 189.99,
                image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Sierra circular con láser guía, potencia 1800W, corte máximo 65mm."
            },
            {
                id: 6,
                name: "Multímetro Digital",
                category: "electricidad",
                price: 67.99,
                image: "https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Multímetro True RMS con pantalla LCD y función hold."
            },
            {
                id: 7,
                name: "Tubo PVC 1/2\"",
                category: "fontaneria",
                price: 12.99,
                image: "https://images.unsplash.com/photo-1621905251189-08d45c3c1c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Tubo de PVC para conducción de agua, 6 metros de largo."
            },
            {
                id: 8,
                name: "Casco de Seguridad",
                category: "seguridad",
                price: 24.99,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Casco industrial con ajuste regulable y visera transparente."
            },
            {
                id: 9,
                name: "Rodillo Profesional 9\"",
                category: "pintura",
                price: 15.99,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Rodillo de lana para pintura látex, mango ergonómico."
            },
            {
                id: 10,
                name: "Destornilladores Profesionales",
                category: "herramientas",
                price: 39.99,
                image: "https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Set de 8 destornilladores de precisión con puntas intercambiables."
            },
            {
                id: 11,
                name: "Interruptor Termomagnético",
                category: "electricidad",
                price: 18.50,
                image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Interruptor bipolar 20A para tableros eléctricos residenciales."
            },
            {
                id: 12,
                name: "Llave Stillson 14\"",
                category: "fontaneria",
                price: 42.99,
                image: "https://images.unsplash.com/photo-1621905251189-08d45c3c1c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Llave ajustable para tuberías, fabricada en acero al cromo."
            },
            {
                id: 13,
                name: "Martillo Demoledor 1500W",
                category: "herramientas",
                price: 459.99,
                originalPrice: 519.99,
                image: "https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Martillo demoledor profesional para trabajos pesados de construcción.",
                badge: "Profesional"
            },
            {
                id: 14,
                name: "Pistola de Calor 2000W",
                category: "herramientas",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Pistola de calor profesional con ajuste de temperatura variable."
            },
            {
                id: 15,
                name: "Cinta Aislante Premium",
                category: "electricidad",
                price: 8.99,
                image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Cinta aislante de vinilo de alta calidad, 20 metros."
            },
            {
                id: 16,
                name: "Llave de Tubo Ajustable",
                category: "fontaneria",
                price: 28.50,
                image: "https://images.unsplash.com/photo-1621905251189-08d45c3c1c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Llave para tuberías de 10 a 50mm, mango antideslizante."
            },
            {
                id: 17,
                name: "Rodillo de Espuma 4\"",
                category: "pintura",
                price: 6.99,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Rodillo de espuma para acabados suaves y trabajos detallados."
            },
            {
                id: 18,
                name: "Guantes de Seguridad",
                category: "seguridad",
                price: 12.99,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Guantes anticorte nivel 5, protección máxima para manos."
            },
            {
                id: 19,
                name: "Alicates de Electricista",
                category: "herramientas",
                price: 24.99,
                image: "https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Alicates profesionales con mangos aislados para trabajo eléctrico."
            },
            {
                id: 20,
                name: "Caja de Herramientas 20\"",
                category: "herramientas",
                price: 45.99,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Caja de herramientas de plástico resistente con organizador interno."
            },
            {
                id: 21,
                name: "Taladro Inalámbrico 18V",
                category: "herramientas",
                price: 199.99,
                originalPrice: 249.99,
                image: "https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Taladro percutor inalámbrico con 2 baterías y cargador rápido.",
                badge: "Oferta"
            },
            {
                id: 22,
                name: "Sierra Caladora 600W",
                category: "herramientas",
                price: 129.99,
                image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Sierra caladora con velocidad variable y base inclinable."
            },
            {
                id: 23,
                name: "Lijadora Orbital 125mm",
                category: "herramientas",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Lijadora orbital profesional con sistema de extracción de polvo."
            },
            {
                id: 24,
                name: "Set de Brocas para Concreto",
                category: "herramientas",
                price: 34.99,
                image: "https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Juego de 15 brocas de carburo para concreto y mampostería."
            },
            {
                id: 25,
                name: "Cable Eléctrico 10 AWG",
                category: "electricidad",
                price: 68.50,
                image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Cable THHN calibre 10 para instalaciones de alta potencia."
            },
            {
                id: 26,
                name: "Tubo Cobre Type L 3/4\"",
                category: "fontaneria",
                price: 22.99,
                image: "https://images.unsplash.com/photo-1621905251189-08d45c3c1c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Tubo de cobre para instalaciones de agua potable, 6 metros."
            },
            {
                id: 27,
                name: "Pintura Epóxica para Piso",
                category: "pintura",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Pintura epóxica de dos componentes para pisos industriales."
            },
            {
                id: 28,
                name: "Lentes de Seguridad",
                category: "seguridad",
                price: 8.99,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                description: "Lentes de protección antiempañante con protección UV."
            }
        ];

        this.renderFeaturedProducts();
        this.renderProducts();
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.getAttribute('data-tab');
                this.openTab(tab);
            });
        });

        // Search functionality
        document.getElementById('searchToggle').addEventListener('click', () => {
            this.toggleSearch();
        });

        document.getElementById('searchClose').addEventListener('click', () => {
            this.toggleSearch();
        });

        document.getElementById('searchOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'searchOverlay') {
                this.toggleSearch();
            }
        });

        // Cart functionality
        document.getElementById('cartIcon').addEventListener('click', () => {
            this.toggleCart();
        });

        document.getElementById('cartClose').addEventListener('click', () => {
            this.toggleCart();
        });

        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                this.filterProducts(category);
            });
        });

        // Load more products
        document.getElementById('loadMore').addEventListener('click', () => {
            this.loadMoreProducts();
        });

        // Checkout
        document.getElementById('checkout').addEventListener('click', () => {
            this.checkout();
        });

        document.getElementById('clearCart').addEventListener('click', () => {
            this.clearCart();
        });

        // Auth events
        document.getElementById('authButton').addEventListener('click', () => {
            if (this.currentUser) {
                this.showProfile();
            } else {
                this.showLogin();
            }
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('shippingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleShipping();
        });

        // Contact form
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm();
        });

        // Newsletter form
        document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletter();
        });

        // Footer category links
        document.querySelectorAll('.footer-section a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('data-category');
                this.openTab('productos');
                setTimeout(() => this.filterProducts(category), 100);
            });
        });

        // Cerrar modales al hacer clic fuera
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // Tab Navigation
    openTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(tabName).classList.add('active');
        document.querySelector(`.nav-link[data-tab="${tabName}"]`).classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Search Functionality
    toggleSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        searchOverlay.classList.toggle('active');
        
        if (searchOverlay.classList.contains('active')) {
            document.getElementById('searchInput').focus();
        }
    }

    // Cart Management
    toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification(`${product.name} agregado al carrito`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Producto removido del carrito');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCartDisplay();
            this.updateCartCount();
        }
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showNotification('El carrito ya está vacío');
            return;
        }
        
        this.cart = [];
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Carrito vaciado');
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Tu carrito está vacío</p></div>';
            cartTotal.textContent = '$0.00';
            return;
        }

        let total = 0;
        cartItems.innerHTML = this.cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="app.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    // Product Display
    renderFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (container) {
            container.innerHTML = this.featuredProducts.map(product => this.createProductCard(product)).join('');
        }
    }

    renderProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        const filteredProducts = this.currentCategory === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === this.currentCategory);
        
        const productsToShow = filteredProducts.slice(0, this.currentPage * this.productsPerPage);
        
        container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');
        
        const loadMoreBtn = document.getElementById('loadMore');
        if (loadMoreBtn) {
            if (productsToShow.length >= filteredProducts.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'flex';
            }
        }
    }

    createProductCard(product) {
        return `
            <div class="product-card" data-category="${product.category}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <div>
                            <span class="price">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                            Agregar
                        </button>
                        <button class="btn-favorite" onclick="app.toggleFavorite(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getCategoryName(category) {
        const categories = {
            'herramientas': 'Herramientas',
            'electricidad': 'Material Eléctrico',
            'fontaneria': 'Fontanería',
            'pintura': 'Pintura',
            'seguridad': 'Seguridad'
        };
        return categories[category] || category;
    }

    filterProducts(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
        
        this.renderProducts();
    }

    loadMoreProducts() {
        this.currentPage += 1;
        this.renderProducts();
    }

    // Checkout Process
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío');
            return;
        }

        if (!this.currentUser) {
            this.showNotification('Por favor inicia sesión para continuar con la compra');
            this.showLogin();
            return;
        }

        this.generateTicket();
        this.showModal('checkoutModal');
    }

    showShipping() {
        this.closeModal('checkoutModal');
        this.showModal('shippingModal');
    }

    processShipping(shippingData) {
        const orderData = {
            items: this.cart,
            subtotal: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: shippingData.shippingMethod === 'express' ? 199.00 : 99.00,
            tax: 0,
            total: 0,
            shippingInfo: shippingData
        };

        orderData.tax = (orderData.subtotal + orderData.shipping) * 0.16;
        orderData.total = orderData.subtotal + orderData.shipping + orderData.tax;

        const order = this.saveOrder(orderData);
        this.saveShippingData(shippingData);
        this.showOrderConfirmation(order);
        this.clearCart();
    }

    showOrderConfirmation(order) {
        this.closeModal('shippingModal');
        
        this.showNotification('Pedido procesado exitosamente');
        setTimeout(() => {
            this.openTab('inicio');
        }, 2000);
    }

    generateTicket() {
        const ticketContent = document.getElementById('ticketContent');
        let total = 0;
        let itemsHTML = '';

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            itemsHTML += `
                <div class="ticket-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        const tax = total * 0.16;
        const finalTotal = total + tax;

        ticketContent.innerHTML = `
            <div class="ticket">
                <div class="ticket-header">
                    <h3>FERRETERÍA ESTEFI</h3>
                    <p>Ticket de Compra</p>
                    <p>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
                </div>
                <div class="ticket-items">
                    ${itemsHTML}
                </div>
                <div class="ticket-item">
                    <span>Subtotal:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <div class="ticket-item">
                    <span>IVA (16%):</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="ticket-total">
                    <span>TOTAL:</span>
                    <span>$${finalTotal.toFixed(2)}</span>
                </div>
                <div style="text-align: center; margin-top: 2rem;">
                    <p>¡Gracias por su compra!</p>
                    <p>Vuelva pronto</p>
                </div>
            </div>
        `;
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    printTicket() {
        const ticketContent = document.getElementById('ticketContent').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Ticket de Compra - Ferretería Estefi</title>
                    <style>
                        body { 
                            font-family: 'Courier New', monospace; 
                            padding: 20px; 
                            margin: 0;
                            background: white;
                        }
                        .ticket { 
                            border: 2px dashed #000; 
                            padding: 20px; 
                            max-width: 400px;
                            margin: 0 auto;
                        }
                        .ticket-header { 
                            text-align: center; 
                            border-bottom: 2px solid #000; 
                            padding-bottom: 10px; 
                            margin-bottom: 15px; 
                        }
                        .ticket-item { 
                            display: flex; 
                            justify-content: space-between; 
                            margin-bottom: 5px; 
                        }
                        .ticket-total { 
                            border-top: 1px solid #000; 
                            padding-top: 10px; 
                            margin-top: 10px; 
                            font-weight: bold; 
                        }
                        @media print {
                            body { margin: 0; padding: 10px; }
                        }
                    </style>
                </head>
                <body>
                    ${ticketContent}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    // Funcionalidad de favoritos
    toggleFavorite(productId) {
        const favoriteBtn = event.currentTarget;
        favoriteBtn.classList.toggle('active');
        const isFavorite = favoriteBtn.classList.contains('active');
        
        if (isFavorite) {
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
            this.showNotification('Producto agregado a favoritos');
        } else {
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            this.showNotification('Producto removido de favoritos');
        }
    }

    // Funciones de UI para autenticación
    showLogin() {
        this.closeModal('registerModal');
        this.showModal('loginModal');
    }

    showRegister() {
        this.closeModal('loginModal');
        this.showModal('registerModal');
    }

    showProfile() {
        if (!this.currentUser) {
            this.showLogin();
            return;
        }
        this.loadProfileInfo();
        this.showModal('profileModal');
    }

    showOrderHistory() {
        this.loadOrderHistory();
        this.closeModal('profileModal');
        this.showModal('orderHistoryModal');
    }

    loadProfileInfo() {
        const profileInfo = document.getElementById('profileInfo');
        if (this.currentUser) {
            profileInfo.innerHTML = `
                <div class="profile-detail">
                    <strong>Nombre:</strong>
                    <span>${this.currentUser.name}</span>
                </div>
                <div class="profile-detail">
                    <strong>Email:</strong>
                    <span>${this.currentUser.email}</span>
                </div>
                <div class="profile-detail">
                    <strong>Teléfono:</strong>
                    <span>${this.currentUser.phone}</span>
                </div>
                <div class="profile-detail">
                    <strong>Miembro desde:</strong>
                    <span>${new Date(this.currentUser.createdAt).toLocaleDateString()}</span>
                </div>
            `;
        }
    }

    loadOrderHistory() {
        const orderHistory = document.getElementById('orderHistory');
        const userOrders = this.getUserOrders();
        
        if (userOrders.length === 0) {
            orderHistory.innerHTML = '<div class="empty-orders">No hay pedidos registrados</div>';
            return;
        }

        orderHistory.innerHTML = userOrders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-number">${order.id}</span>
                    <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="order-status status-completed">Completado</div>
                <div class="order-total">Total: $${order.total.toFixed(2)}</div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Manejo de formularios
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            if (this.loginUser(email, password)) {
                this.showNotification('¡Bienvenido de nuevo!');
                this.closeModal('loginModal');
                this.updateAuthUI();
            } else {
                throw new Error('Credenciales incorrectas');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        try {
            this.registerUser({ name, email, phone, password });
            this.showNotification('¡Cuenta creada exitosamente!');
            this.closeModal('registerModal');
            this.showLogin();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    handleShipping() {
        const shippingData = {
            shippingName: document.getElementById('shippingName').value,
            shippingPhone: document.getElementById('shippingPhone').value,
            shippingAddress: document.getElementById('shippingAddress').value,
            shippingCity: document.getElementById('shippingCity').value,
            shippingState: document.getElementById('shippingState').value,
            shippingZip: document.getElementById('shippingZip').value,
            shippingInstructions: document.getElementById('shippingInstructions').value,
            shippingMethod: document.querySelector('input[name="shippingMethod"]:checked').value
        };

        this.processShipping(shippingData);
    }

    handleContactForm() {
        this.showLoading(true);
        
        setTimeout(() => {
            this.showLoading(false);
            this.showNotification('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
            document.getElementById('contactForm').reset();
        }, 2000);
    }

    handleNewsletter() {
        const emailInput = document.querySelector('.newsletter-form input');
        const email = emailInput.value;
        
        if (email && this.validateEmail(email)) {
            this.showNotification(`¡Gracias por suscribirte con ${email}!`);
            emailInput.value = '';
        } else {
            this.showNotification('Por favor ingresa un email válido');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Utility Functions
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary)' : 'var(--accent)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            z-index: 1400;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (show) {
            spinner.classList.add('active');
        } else {
            spinner.classList.remove('active');
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    window.app = new FerreteriaApp();
});