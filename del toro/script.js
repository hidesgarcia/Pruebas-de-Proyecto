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
        
        // Inicializar calculadora
        this.initializeCalculator();
    }

    initializeCalculator() {
        if (document.getElementById('calculadora')) {
            this.calculator = new ConstructionCalculator(this);
        }
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
        console.log('Configurando event listeners...');
        
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
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletter();
            });
        }

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

        // Botones del hero
        document.querySelectorAll('.hero-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = btn.getAttribute('onclick');
                if (target) {
                    // Ejecutar la función onclick
                    eval(target);
                }
            });
        });

        console.log('Event listeners configurados correctamente');
    }

    // Tab Navigation
    openTab(tabName) {
        console.log('Abriendo pestaña:', tabName);
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetTab = document.getElementById(tabName);
        const targetLink = document.querySelector(`.nav-link[data-tab="${tabName}"]`);

        if (targetTab) {
            targetTab.classList.add('active');
        }
        if (targetLink) {
            targetLink.classList.add('active');
        }

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

    addToCart(product) {
        // Si es un ID numérico, buscar el producto
        if (typeof product === 'number') {
            const foundProduct = this.products.find(p => p.id === product);
            if (!foundProduct) return;
            product = foundProduct;
        }

        const existingItem = this.cart.find(item => item.id === product.id);
        
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
        const activeBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
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
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
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
        if (!this.currentUser) return;
        
        const profileContent = document.getElementById('profileContent');
        const userOrders = this.getUserOrders();
        
        profileContent.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="profile-info">
                    <h3>${this.currentUser.name}</h3>
                    <p>${this.currentUser.email}</p>
                    <p>Miembro desde ${new Date(this.currentUser.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="btn btn-secondary" onclick="app.logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Cerrar Sesión
                </button>
            </div>
            
            <div class="orders-section">
                <h4>Mis Pedidos</h4>
                ${userOrders.length === 0 ? 
                    '<p class="no-orders">No tienes pedidos realizados</p>' : 
                    userOrders.slice(0, 5).map(order => `
                        <div class="order-item">
                            <div class="order-header">
                                <span class="order-id">${order.id}</span>
                                <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div class="order-total">$${order.total.toFixed(2)}</div>
                        </div>
                    `).join('')
                }
            </div>
        `;
        
        this.showModal('profileModal');
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (this.loginUser(email, password)) {
            this.closeModal('loginModal');
            this.updateAuthUI();
            this.showNotification('¡Bienvenido de nuevo!');
        } else {
            this.showNotification('Credenciales incorrectas', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }
        
        try {
            this.registerUser({ name, email, password });
            this.closeModal('registerModal');
            this.showNotification('¡Registro exitoso! Ahora puedes iniciar sesión');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    handleShipping() {
        const formData = new FormData(document.getElementById('shippingForm'));
        const shippingData = {
            fullName: formData.get('fullName'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            phone: formData.get('phone'),
            shippingMethod: formData.get('shippingMethod'),
            paymentMethod: formData.get('paymentMethod')
        };
        
        this.processShipping(shippingData);
    }

    handleContactForm() {
        const formData = new FormData(document.getElementById('contactForm'));
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simular envío de formulario
        this.showNotification('¡Mensaje enviado! Te contactaremos pronto');
        document.getElementById('contactForm').reset();
    }

    handleNewsletter() {
        const emailInput = document.querySelector('.newsletter-form input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            this.showNotification('¡Gracias por suscribirte a nuestro newsletter!');
            emailInput.value = '';
        }
    }

    // Notifications
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Clase para la Calculadora de Construcción
// Construction Calculator Class - VERSIÓN COMPLETA Y FUNCIONAL
class ConstructionCalculator {
    constructor(app) {
        this.app = app;
        this.canvas2D = document.getElementById('constructionCanvas2D');
        this.canvas3D = document.getElementById('constructionCanvas3D');
        this.materials = [];
        this.scale2D = 1;
        this.offset2D = { x: 0, y: 0 };
        this.rotation3D = { x: 0, y: 0 };
        this.isDragging2D = false;
        this.lastMousePos2D = { x: 0, y: 0 };
        
        if (this.canvas2D && this.canvas3D) {
            this.ctx2D = this.canvas2D.getContext('2d');
            this.ctx3D = this.canvas3D.getContext('2d');
            this.initializeCalculator();
        }
    }

    initializeCalculator() {
        console.log('Inicializando calculadora...');
        this.setupEventListeners();
        this.setupCanvas();
        this.drawInitialView();
    }

    setupEventListeners() {
        console.log('Configurando event listeners de calculadora...');
        
        // Tabs de visualización
        document.querySelectorAll('.viz-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const vizType = e.target.getAttribute('data-viz');
                this.switchVisualization(vizType);
            });
        });

        // Botón de cálculo
        const calculateBtn = document.getElementById('calculateMaterials');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.calculateMaterials();
            });
        }

        // Controles 2D
        const zoomIn2D = document.getElementById('zoomIn2D');
        const zoomOut2D = document.getElementById('zoomOut2D');
        const resetView2D = document.getElementById('resetView2D');

        if (zoomIn2D) zoomIn2D.addEventListener('click', () => this.zoom2D(0.1));
        if (zoomOut2D) zoomOut2D.addEventListener('click', () => this.zoom2D(-0.1));
        if (resetView2D) resetView2D.addEventListener('click', () => this.resetView2D());

        // Controles 3D
        const rotateLeft3D = document.getElementById('rotateLeft3D');
        const rotateRight3D = document.getElementById('rotateRight3D');
        const resetView3D = document.getElementById('resetView3D');

        if (rotateLeft3D) rotateLeft3D.addEventListener('click', () => this.rotate3D(0, -Math.PI / 8));
        if (rotateRight3D) rotateRight3D.addEventListener('click', () => this.rotate3D(0, Math.PI / 8));
        if (resetView3D) resetView3D.addEventListener('click', () => this.resetView3D());

        // Agregar al carrito
        const addToCartBtn = document.getElementById('addToCartFromResults');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.addMaterialsToCart();
            });
        }

        // Eventos del canvas 2D
        if (this.canvas2D) {
            this.canvas2D.addEventListener('mousedown', this.handleMouseDown2D.bind(this));
            this.canvas2D.addEventListener('mousemove', this.handleMouseMove2D.bind(this));
            this.canvas2D.addEventListener('mouseup', this.handleMouseUp2D.bind(this));
            this.canvas2D.addEventListener('wheel', this.handleWheel2D.bind(this));
        }

        console.log('Event listeners de calculadora configurados');
    }

    setupCanvas() {
        console.log('Configurando canvas...');
        // Ajustar tamaño del canvas
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    resizeCanvas() {
        if (!this.canvas2D || !this.canvas3D) return;
        
        const container2D = this.canvas2D.parentElement;
        const container3D = this.canvas3D.parentElement;
        
        if (container2D) {
            this.canvas2D.width = container2D.clientWidth;
            this.canvas2D.height = container2D.clientHeight;
        }
        
        if (container3D) {
            this.canvas3D.width = container3D.clientWidth;
            this.canvas3D.height = container3D.clientHeight;
        }
        
        console.log('Canvas redimensionados:', {
            '2D': { width: this.canvas2D.width, height: this.canvas2D.height },
            '3D': { width: this.canvas3D.width, height: this.canvas3D.height }
        });
        
        this.drawInitialView();
    }

    switchVisualization(vizType) {
        console.log('Cambiando a visualización:', vizType);
        
        document.querySelectorAll('.viz-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.viz-content').forEach(content => {
            content.classList.remove('active');
        });

        const activeTab = document.querySelector(`.viz-tab[data-viz="${vizType}"]`);
        const activeContent = document.getElementById(`viz${vizType.toUpperCase()}`);

        if (activeTab) activeTab.classList.add('active');
        if (activeContent) activeContent.classList.add('active');

        if (vizType === '2d') {
            this.draw2DView();
        } else {
            this.draw3DView();
        }
    }

    calculateMaterials() {
        console.log('Calculando materiales...');
        
        const projectType = document.getElementById('projectType').value;
        const length = parseFloat(document.getElementById('length').value);
        const width = parseFloat(document.getElementById('width').value);
        const height = parseFloat(document.getElementById('height').value);
        const brickType = document.getElementById('brickType').value;
        const cementType = document.getElementById('cementType').value;
        const jointThickness = parseFloat(document.getElementById('jointThickness').value) / 100; // Convertir a metros

        console.log('Parámetros:', { projectType, length, width, height, brickType, cementType, jointThickness });

        // Validaciones
        if (!length || !width || !height) {
            this.app.showNotification('Por favor ingresa todas las dimensiones', 'error');
            return;
        }

        // Calcular materiales según el tipo de proyecto
        this.materials = this.calculateByProjectType(projectType, length, width, height, brickType, cementType, jointThickness);
        
        // Mostrar resultados
        this.displayResults();
        
        // Actualizar visualización
        this.draw2DView();
        this.draw3DView();
        
        this.app.showNotification('Cálculo completado exitosamente');
    }

    calculateByProjectType(projectType, length, width, height, brickType, cementType, jointThickness) {
        const materials = [];
        
        // Dimensiones estándar de ladrillos (en metros)
        const brickDimensions = {
            'standard': { length: 0.24, width: 0.12, height: 0.06 },
            'king': { length: 0.24, width: 0.13, height: 0.09 },
            'pandereta': { length: 0.24, width: 0.10, height: 0.06 }
        };

        const brickDim = brickDimensions[brickType];

        switch (projectType) {
            case 'muro':
                // Cálculo para muros
                const brickArea = (brickDim.length + jointThickness) * (brickDim.height + jointThickness);
                const wallArea = length * height;
                const bricksNeeded = Math.ceil(wallArea / brickArea * 1.1); // +10% por desperdicio
                
                // Cemento para pega (1 bolsa por cada 25-30 ladrillos)
                const cementBags = Math.ceil(bricksNeeded / 28);
                
                // Arena fina (0.015 m³ por bolsa de cemento)
                const sandVolume = cementBags * 0.015;
                
                materials.push(
                    { name: 'Ladrillos', quantity: bricksNeeded, unit: 'unidades', price: this.getBrickPrice(brickType) },
                    { name: 'Cemento', quantity: cementBags, unit: 'bolsas', price: this.getCementPrice(cementType) },
                    { name: 'Arena Fina', quantity: sandVolume, unit: 'm³', price: 45.00 }
                );
                break;

            case 'piso':
                // Cálculo para pisos
                const floorArea = length * width;
                const cementBagsFloor = Math.ceil(floorArea * 0.05); // 5 bolsas por m² para contrapiso
                const sandVolumeFloor = cementBagsFloor * 0.03; // 0.03 m³ por bolsa
                const gravelVolume = Math.ceil(floorArea * 0.1); // 0.1 m³ por m²
                
                materials.push(
                    { name: 'Cemento', quantity: cementBagsFloor, unit: 'bolsas', price: this.getCementPrice(cementType) },
                    { name: 'Arena Gruesa', quantity: sandVolumeFloor, unit: 'm³', price: 35.00 },
                    { name: 'Piedra Chancada', quantity: gravelVolume, unit: 'm³', price: 55.00 }
                );
                break;

            case 'cimiento':
                // Cálculo para cimientos
                const foundationVolume = length * width * height;
                const cementBagsFoundation = Math.ceil(foundationVolume * 7.5); // 7.5 bolsas por m³ de concreto
                const sandVolumeFoundation = Math.ceil(foundationVolume * 0.5); // 0.5 m³ de arena por m³ de concreto
                const gravelVolumeFoundation = Math.ceil(foundationVolume * 0.8); // 0.8 m³ de piedra por m³ de concreto
                
                materials.push(
                    { name: 'Cemento', quantity: cementBagsFoundation, unit: 'bolsas', price: this.getCementPrice(cementType) },
                    { name: 'Arena Gruesa', quantity: sandVolumeFoundation, unit: 'm³', price: 35.00 },
                    { name: 'Piedra Chancada', quantity: gravelVolumeFoundation, unit: 'm³', price: 55.00 },
                    { name: 'Acero Corrugado 1/2"', quantity: Math.ceil(length * 4), unit: 'varillas', price: 25.00 }
                );
                break;

            case 'techo':
                // Cálculo para techos aligerados
                const roofArea = length * width;
                const cementBagsRoof = Math.ceil(roofArea * 0.07); // 7 bolsas por m²
                const sandVolumeRoof = Math.ceil(roofArea * 0.03); // 0.03 m³ por m²
                const gravelVolumeRoof = Math.ceil(roofArea * 0.04); // 0.04 m³ por m²
                const ladrillosTecho = Math.ceil(roofArea * 8.33); // 8.33 ladrillos de techo por m²
                
                materials.push(
                    { name: 'Ladrillos de Techo', quantity: ladrillosTecho, unit: 'unidades', price: 2.50 },
                    { name: 'Cemento', quantity: cementBagsRoof, unit: 'bolsas', price: this.getCementPrice(cementType) },
                    { name: 'Arena Gruesa', quantity: sandVolumeRoof, unit: 'm³', price: 35.00 },
                    { name: 'Piedra Chancada', quantity: gravelVolumeRoof, unit: 'm³', price: 55.00 },
                    { name: 'Acero Corrugado 3/8"', quantity: Math.ceil(roofArea * 6), unit: 'varillas', price: 18.00 }
                );
                break;
        }

        console.log('Materiales calculados:', materials);
        return materials;
    }

    getBrickPrice(brickType) {
        const prices = {
            'standard': 1.20,
            'king': 1.80,
            'pandereta': 0.90
        };
        return prices[brickType] || 1.20;
    }

    getCementPrice(cementType) {
        return cementType === 'portland' ? 25.00 : 28.00;
    }

    displayResults() {
        const resultsList = document.getElementById('resultsList');
        const resultsContainer = document.getElementById('materialsResults');
        
        if (!resultsList || !resultsContainer) {
            console.error('No se encontraron elementos de resultados');
            return;
        }
        
        resultsList.innerHTML = this.materials.map(material => `
            <div class="material-item">
                <div class="material-name">${material.name}</div>
                <div class="material-quantity">
                    ${material.quantity} <span class="material-unit">${material.unit}</span>
                </div>
            </div>
        `).join('');
        
        resultsContainer.style.display = 'block';
        setTimeout(() => resultsContainer.classList.add('show'), 10);
        
        console.log('Resultados mostrados');
    }

    drawInitialView() {
        console.log('Dibujando vista inicial');
        this.draw2DView();
        this.draw3DView();
    }

    draw2DView() {
        if (!this.ctx2D || !this.canvas2D) {
            console.error('Canvas 2D no disponible');
            return;
        }
        
        const ctx = this.ctx2D;
        const width = this.canvas2D.width;
        const height = this.canvas2D.height;
        
        console.log('Dibujando vista 2D:', { width, height });
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fondo
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);
        
        if (this.materials.length === 0) {
            // Vista inicial - instrucciones
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Ingresa las dimensiones y haz clic en "Calcular Materiales"', width / 2, height / 2);
            console.log('Dibujado mensaje de instrucciones');
            return;
        }
        
        // Dibujar representación 2D basada en los materiales calculados
        const projectType = document.getElementById('projectType').value;
        const length = parseFloat(document.getElementById('length').value);
        const heightVal = parseFloat(document.getElementById('height').value);
        
        // Escala para ajustar al canvas
        const scale = Math.min(width / (length * 1.2), height / (heightVal * 1.2)) * 0.8 * this.scale2D;
        const centerX = width / 2 + this.offset2D.x;
        const centerY = height / 2 + this.offset2D.y;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Dibujar según el tipo de proyecto
        switch (projectType) {
            case 'muro':
                this.drawWall2D(ctx, length, heightVal, scale);
                break;
            case 'piso':
                this.drawFloor2D(ctx, length, parseFloat(document.getElementById('width').value), scale);
                break;
            case 'cimiento':
                this.drawFoundation2D(ctx, length, parseFloat(document.getElementById('width').value), scale);
                break;
            case 'techo':
                this.drawRoof2D(ctx, length, parseFloat(document.getElementById('width').value), scale);
                break;
        }
        
        ctx.restore();
        
        // Dibujar cuadrícula
        this.drawGrid(ctx, width, height);
        
        console.log('Vista 2D dibujada correctamente');
    }

    drawWall2D(ctx, length, height, scale) {
        console.log('Dibujando muro 2D:', { length, height, scale });
        
        // Dibujar muro
        ctx.fillStyle = '#d1d5db';
        ctx.fillRect(-length * scale / 2, -height * scale / 2, length * scale, height * scale);
        
        // Dibujar ladrillos
        ctx.fillStyle = '#9ca3af';
        const brickWidth = 0.24 * scale;
        const brickHeight = 0.06 * scale;
        
        for (let y = -height * scale / 2; y < height * scale / 2; y += brickHeight * 1.2) {
            for (let x = -length * scale / 2; x < length * scale / 2; x += brickWidth * 1.1) {
                ctx.fillRect(x, y, brickWidth, brickHeight);
            }
        }
        
        // Etiquetas de dimensiones
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${length}m`, 0, -height * scale / 2 - 10);
        ctx.fillText(`${height}m`, -length * scale / 2 - 20, 0);
    }

    drawFloor2D(ctx, length, width, scale) {
        console.log('Dibujando piso 2D:', { length, width, scale });
        
        // Dibujar piso
        ctx.fillStyle = '#d1d5db';
        ctx.fillRect(-length * scale / 2, -width * scale / 2, length * scale, width * scale);
        
        // Patrón de piso
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        
        for (let x = -length * scale / 2; x < length * scale / 2; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, -width * scale / 2);
            ctx.lineTo(x, width * scale / 2);
            ctx.stroke();
        }
        
        for (let y = -width * scale / 2; y < width * scale / 2; y += 20) {
            ctx.beginPath();
            ctx.moveTo(-length * scale / 2, y);
            ctx.lineTo(length * scale / 2, y);
            ctx.stroke();
        }
        
        // Etiquetas de dimensiones
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${length}m`, 0, -width * scale / 2 - 10);
        ctx.fillText(`${width}m`, -length * scale / 2 - 20, 0);
    }

    drawFoundation2D(ctx, length, width, scale) {
        console.log('Dibujando cimiento 2D:', { length, width, scale });
        
        // Dibujar cimiento
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(-length * scale / 2, -width * scale / 2, length * scale, width * scale);
        
        // Refuerzo de acero
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 4; i++) {
            const offset = -width * scale / 2 + (width * scale / 3) * (i + 1);
            ctx.beginPath();
            ctx.moveTo(-length * scale / 2, offset);
            ctx.lineTo(length * scale / 2, offset);
            ctx.stroke();
        }
        
        // Etiquetas de dimensiones
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${length}m`, 0, -width * scale / 2 - 10);
        ctx.fillText(`${width}m`, -length * scale / 2 - 20, 0);
    }

    drawRoof2D(ctx, length, width, scale) {
        console.log('Dibujando techo 2D:', { length, width, scale });
        
        // Dibujar techo
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(-length * scale / 2, -width * scale / 2, length * scale, width * scale);
        
        // Vigas
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 3; i++) {
            const offset = -length * scale / 2 + (length * scale / 4) * (i + 1);
            ctx.beginPath();
            ctx.moveTo(offset, -width * scale / 2);
            ctx.lineTo(offset, width * scale / 2);
            ctx.stroke();
        }
        
        // Etiquetas de dimensiones
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${length}m`, 0, -width * scale / 2 - 10);
        ctx.fillText(`${width}m`, -length * scale / 2 - 20, 0);
    }

    drawGrid(ctx, width, height) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Líneas verticales
        for (let x = 0; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Líneas horizontales
        for (let y = 0; y < height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }

    draw3DView() {
        if (!this.ctx3D || !this.canvas3D) {
            console.error('Canvas 3D no disponible');
            return;
        }
        
        const ctx = this.ctx3D;
        const width = this.canvas3D.width;
        const height = this.canvas3D.height;
        
        console.log('Dibujando vista 3D:', { width, height });
        
        // Limpiar canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fondo
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);
        
        if (this.materials.length === 0) {
            // Vista inicial
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Calcula los materiales para ver la vista 3D', width / 2, height / 2);
            console.log('Dibujado mensaje de instrucciones 3D');
            return;
        }
        
        // Dibujar representación 3D simple (proyección isométrica)
        const projectType = document.getElementById('projectType').value;
        const length = parseFloat(document.getElementById('length').value);
        const widthVal = parseFloat(document.getElementById('width').value);
        const heightVal = parseFloat(document.getElementById('height').value);
        
        const scale = Math.min(width / (length * 2), height / (Math.max(widthVal, heightVal) * 2)) * 0.6;
        const centerX = width / 2;
        const centerY = height / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Aplicar rotación
        ctx.rotate(this.rotation3D.y);
        
        switch (projectType) {
            case 'muro':
                this.drawWall3D(ctx, length, heightVal, 0.2, scale);
                break;
            case 'piso':
                this.drawFloor3D(ctx, length, widthVal, 0.1, scale);
                break;
            case 'cimiento':
                this.drawFoundation3D(ctx, length, widthVal, heightVal, scale);
                break;
            case 'techo':
                this.drawRoof3D(ctx, length, widthVal, 0.3, scale);
                break;
        }
        
        ctx.restore();
        
        console.log('Vista 3D dibujada correctamente');
    }

    drawWall3D(ctx, length, height, thickness, scale) {
        console.log('Dibujando muro 3D:', { length, height, thickness, scale });
        
        // Proyección isométrica simple para muro
        const isoAngle = Math.PI / 6; // 30 grados
        
        const points = [
            { x: -length * scale / 2, y: -height * scale / 2 },
            { x: length * scale / 2, y: -height * scale / 2 },
            { x: length * scale / 2, y: height * scale / 2 },
            { x: -length * scale / 2, y: height * scale / 2 }
        ];
        
        // Cara frontal
        ctx.fillStyle = '#d1d5db';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fill();
        
        // Cara lateral (profundidad)
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.moveTo(points[1].x, points[1].y);
        ctx.lineTo(points[1].x + thickness * scale * Math.cos(isoAngle), 
                  points[1].y - thickness * scale * Math.sin(isoAngle));
        ctx.lineTo(points[2].x + thickness * scale * Math.cos(isoAngle), 
                  points[2].y - thickness * scale * Math.sin(isoAngle));
        ctx.lineTo(points[2].x, points[2].y);
        ctx.closePath();
        ctx.fill();
        
        // Cara superior
        ctx.fillStyle = '#6b7280';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[1].x + thickness * scale * Math.cos(isoAngle), 
                  points[1].y - thickness * scale * Math.sin(isoAngle));
        ctx.lineTo(points[0].x + thickness * scale * Math.cos(isoAngle), 
                  points[0].y - thickness * scale * Math.sin(isoAngle));
        ctx.closePath();
        ctx.fill();
    }

    drawFloor3D(ctx, length, width, thickness, scale) {
        console.log('Dibujando piso 3D:', { length, width, thickness, scale });
        
        // Similar a drawWall3D pero para piso
        const isoAngle = Math.PI / 6;
        
        const points = [
            { x: -length * scale / 2, y: -width * scale / 2 },
            { x: length * scale / 2, y: -width * scale / 2 },
            { x: length * scale / 2, y: width * scale / 2 },
            { x: -length * scale / 2, y: width * scale / 2 }
        ];
        
        // Cara superior
        ctx.fillStyle = '#d1d5db';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fill();
        
        // Patrón de piso en la cara superior
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(points[0].x + (length * scale / 4) * i, points[0].y);
            ctx.lineTo(points[0].x + (length * scale / 4) * i, points[3].y);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y + (width * scale / 4) * i);
            ctx.lineTo(points[1].x, points[0].y + (width * scale / 4) * i);
            ctx.stroke();
        }
        
        // Lados
        ctx.fillStyle = '#9ca3af';
        // Lado frontal
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[1].x, points[1].y + thickness * scale);
        ctx.lineTo(points[0].x, points[0].y + thickness * scale);
        ctx.closePath();
        ctx.fill();
    }

    drawFoundation3D(ctx, length, width, height, scale) {
        console.log('Dibujando cimiento 3D:', { length, width, height, scale });
        
        // Similar a drawWall3D pero para cimiento
        const isoAngle = Math.PI / 6;
        
        const points = [
            { x: -length * scale / 2, y: -width * scale / 2 },
            { x: length * scale / 2, y: -width * scale / 2 },
            { x: length * scale / 2, y: width * scale / 2 },
            { x: -length * scale / 2, y: width * scale / 2 }
        ];
        
        // Cara frontal
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fill();
        
        // Profundidad
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.moveTo(points[1].x, points[1].y);
        ctx.lineTo(points[1].x + height * scale * Math.cos(isoAngle), 
                  points[1].y - height * scale * Math.sin(isoAngle));
        ctx.lineTo(points[2].x + height * scale * Math.cos(isoAngle), 
                  points[2].y - height * scale * Math.sin(isoAngle));
        ctx.lineTo(points[2].x, points[2].y);
        ctx.closePath();
        ctx.fill();
        
        // Refuerzos de acero
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        for (let i = 1; i < 3; i++) {
            const offset = points[0].x + (length * scale / 3) * i;
            ctx.beginPath();
            ctx.moveTo(offset, points[0].y);
            ctx.lineTo(offset + height * scale * Math.cos(isoAngle), 
                      points[0].y - height * scale * Math.sin(isoAngle));
            ctx.stroke();
        }
    }

    drawRoof3D(ctx, length, width, thickness, scale) {
        console.log('Dibujando techo 3D:', { length, width, thickness, scale });
        
        // Techo con pendiente simple
        const points = [
            { x: -length * scale / 2, y: -width * scale / 2 },
            { x: length * scale / 2, y: -width * scale / 2 },
            { x: length * scale / 2, y: width * scale / 2 },
            { x: -length * scale / 2, y: width * scale / 2 }
        ];
        
        // Cara del techo
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[1].x, points[1].y - thickness * scale);
        ctx.lineTo(points[0].x, points[0].y - thickness * scale);
        ctx.closePath();
        ctx.fill();
        
        // Vigas
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        for (let i = 1; i < 3; i++) {
            const offset = points[0].x + (length * scale / 3) * i;
            ctx.beginPath();
            ctx.moveTo(offset, points[0].y);
            ctx.lineTo(offset, points[0].y - thickness * scale);
            ctx.stroke();
        }
    }

    // Controladores de eventos para navegación 2D
    handleMouseDown2D(e) {
        this.isDragging2D = true;
        this.lastMousePos2D = { x: e.offsetX, y: e.offsetY };
    }

    handleMouseMove2D(e) {
        if (!this.isDragging2D) return;
        
        const deltaX = e.offsetX - this.lastMousePos2D.x;
        const deltaY = e.offsetY - this.lastMousePos2D.y;
        
        this.offset2D.x += deltaX;
        this.offset2D.y += deltaY;
        
        this.lastMousePos2D = { x: e.offsetX, y: e.offsetY };
        this.draw2DView();
    }

    handleMouseUp2D() {
        this.isDragging2D = false;
    }

    handleWheel2D(e) {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const wheel = e.deltaY < 0 ? 1 : -1;
        this.zoom2D(wheel * zoomIntensity);
    }

    zoom2D(delta) {
        this.scale2D *= (1 + delta);
        this.scale2D = Math.max(0.1, Math.min(5, this.scale2D));
        this.draw2DView();
    }

    resetView2D() {
        this.scale2D = 1;
        this.offset2D = { x: 0, y: 0 };
        this.draw2DView();
    }

    rotate3D(deltaX, deltaY) {
        this.rotation3D.x += deltaX;
        this.rotation3D.y += deltaY;
        this.draw3DView();
    }

    resetView3D() {
        this.rotation3D = { x: 0, y: 0 };
        this.draw3DView();
    }

    addMaterialsToCart() {
        if (this.materials.length === 0) {
            this.app.showNotification('No hay materiales calculados para agregar', 'error');
            return;
        }

        // Crear productos simulados para los materiales calculados
        this.materials.forEach(material => {
            const productId = Date.now() + Math.random();
            this.app.addToCart({
                id: productId,
                name: material.name,
                price: material.price,
                quantity: material.quantity,
                image: this.getMaterialImage(material.name),
                unit: material.unit
            });
        });

        this.app.showNotification('Materiales agregados al carrito');
    }

    getMaterialImage(materialName) {
        const materialImages = {
            'Ladrillos': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'Cemento': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'Arena Fina': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'Arena Gruesa': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'Piedra Chancada': 'https://images.unsplash.com/photo-1621905251189-08d45c3c1c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'Acero Corrugado': 'https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'Ladrillos de Techo': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        };
        
        return materialImages[materialName] || 'https://images.unsplash.com/photo-1572981779307-38f8b0456222?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    window.app = new FerreteriaApp();
    console.log('Aplicación Ferretería Estefi inicializada correctamente');
});