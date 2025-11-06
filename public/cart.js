// Funciones globales del carrito de compras

// Datos de productos disponibles
const PRODUCTS = {
	'truss-1metro': {
		name: 'Estructura Truss de Aluminio 1 Metro',
		price: 740,
		url: '/estructura-truss-1metro'
	},
	'truss-2metros': {
		name: 'Estructura Truss de Aluminio 2 Metros',
		price: 1300,
		url: '/estructura-truss-2metros'
	},
	'truss-3metros': {
		name: 'Estructura Truss de Aluminio 3 Metros',
		price: 1900,
		url: '/estructura-truss-3metros'
	},
	'truss-cubo': {
		name: 'Cubo Estructura Truss de Aluminio',
		price: 500,
		url: '/estructura-truss-cubo'
	}
};

// Función para obtener el carrito de las cookies
function getCart() {
	const cartCookie = document.cookie
		.split('; ')
		.find(row => row.startsWith('cart='));
	
	if (!cartCookie) return [];
	
	try {
		const cartData = decodeURIComponent(cartCookie.split('=')[1]);
		return JSON.parse(cartData);
	} catch {
		return [];
	}
}

// Función para guardar el carrito en cookies
function saveCart(cart) {
	const cartData = JSON.stringify(cart);
	const expires = new Date();
	expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días
	document.cookie = `cart=${encodeURIComponent(cartData)}; expires=${expires.toUTCString()}; path=/`;
	
	// Disparar evento para actualizar contadores
	document.dispatchEvent(new CustomEvent('cartUpdated'));
	window.dispatchEvent(new Event('storage'));
}

// Función para agregar un producto al carrito
function addToCart(productId) {
	const cart = getCart();
	const existingItem = cart.find(item => item.id === productId);
	
	if (existingItem) {
		existingItem.quantity = (existingItem.quantity || 1) + 1;
	} else {
		cart.push({
			id: productId,
			quantity: 1
		});
	}
	
	saveCart(cart);
	
	// Actualizar contador del carrito si existe
	const cartCount = document.getElementById('cart-count');
	if (cartCount) {
		const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
		if (totalItems > 0) {
			cartCount.textContent = totalItems;
			cartCount.classList.remove('opacity-0', 'pointer-events-none');
			cartCount.classList.add('opacity-100');
		}
	}
}

// Exponer función globalmente
window.addToCart = addToCart;
window.getCart = getCart;
window.saveCart = saveCart;
window.PRODUCTS = PRODUCTS;

