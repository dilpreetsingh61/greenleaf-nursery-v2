-- GreenLeaf Nursery - MySQL setup script

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category VARCHAR(50) NOT NULL,
  image VARCHAR(255),
  instock BOOLEAN DEFAULT true,
  badge VARCHAR(50),
  size VARCHAR(50),
  rating DECIMAL(3, 2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_replied BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  order_number VARCHAR(255) NOT NULL UNIQUE,
  transaction_id VARCHAR(255) NOT NULL UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  shipping_info JSON NOT NULL,
  items JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  preferred_date VARCHAR(50) NOT NULL,
  preferred_time VARCHAR(50) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  service_address TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id CHAR(36) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_session_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_session_product (cart_session_id, product_id),
  CONSTRAINT fk_cart_items_session FOREIGN KEY (cart_session_id) REFERENCES cart_sessions(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_badge ON products(badge);
CREATE INDEX idx_products_instock ON products(instock);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_orders_user_email ON orders(user_email);
CREATE INDEX idx_newsletter_active ON newsletter(is_active);

DELETE FROM products;
ALTER TABLE products AUTO_INCREMENT = 1;

INSERT INTO products (name, description, price, original_price, category, image, instock, rating, badge, size) VALUES
('Peace Lily', 'Beautiful flowering plant that purifies air and adds elegance to your home. Features graceful white blooms and glossy green leaves.', 34.99, 34.99, 'flowering', '/images/products/plants/peace-lily.jpg', true, 4.7, 'air-purifier', 'medium'),
('Rose Bush', 'Classic flowering plant with fragrant blooms in beautiful colors. A timeless addition to any garden with proper care.', 59.99, 69.99, 'flowering', '/images/products/plants/rose-bush.jpg', true, 4.6, 'fragrant', 'large'),
('Orchid (Phalaenopsis)', 'Elegant flowering plant with long-lasting blooms. Available in various colors and adds sophistication to any space.', 42.99, 49.99, 'flowering', '/images/products/plants/orchid-phalaenopsis.jpg', true, 4.5, 'popular', 'small'),
('Anthurium', 'Exotic plant with heart-shaped, glossy red flowers. Blooms year-round and adds a pop of color to any room.', 39.99, 39.99, 'flowering', '/images/products/plants/anthurium.jpg', true, 4.6, 'popular', 'medium'),
('English Lavender', 'Aromatic flowering herb with purple blooms. Perfect for gardens and has calming properties.', 28.99, 28.99, 'flowering', '/images/products/plants/english-lavender.jpg', true, 4.7, 'fragrant', 'small'),
('Bird of Paradise', 'Dramatic tropical plant with stunning orange and blue flowers. A showstopper that brings exotic beauty.', 129.99, 149.99, 'outdoor', '/images/products/plants/bird-of-paradise.jpg', true, 4.4, 'exotic', 'large'),
('Rosemary', 'Fragrant herb with culinary and ornamental uses. Perfect for kitchens and herb gardens.', 19.99, 19.99, 'outdoor', '/images/products/plants/rosemary.jpg', true, 4.6, 'culinary', 'small'),
('Monstera Deliciosa', 'Trendy indoor plant with distinctive split leaves. Instagram-worthy and easy to care for.', 45.99, 55.99, 'indoor', '/images/products/plants/monstera.jpg', true, 4.9, 'popular', 'large'),
('Snake Plant', 'Hardy indoor plant with striking upright leaves. Excellent air purifier and extremely low maintenance.', 29.99, 29.99, 'indoor', '/images/products/plants/snake-plant.jpg', true, 4.8, 'air-purifier', 'medium'),
('Fiddle Leaf Fig', 'A popular indoor tree with large, glossy leaves. Requires consistent care but rewards with dramatic growth.', 89.99, 109.99, 'indoor', '/images/products/plants/fiddle-leaf-fig.jpg', true, 4.5, 'sale', 'large'),
('Rubber Plant', 'Large-leafed indoor plant with glossy burgundy foliage. Makes a bold statement in any room.', 39.99, 49.99, 'indoor', '/images/products/plants/rubber-plant.jpg', true, 4.5, 'sale', 'medium'),
('Spider Plant', 'Popular indoor plant with arching leaves and baby plantlets. Great air purifier and easy care.', 19.99, 24.99, 'indoor', '/images/products/plants/spider-plant.jpg', true, 4.6, 'propagation-friendly', 'small'),
('Boston Fern', 'Lush, green fern that adds a natural, forest-like feel to your space. Perfect for humid environments.', 42.99, 42.99, 'indoor', '/images/products/plants/boston-fern.jpg', true, 4.3, 'air-purifier', 'medium'),
('Pothos Golden', 'Trailing indoor plant with heart-shaped leaves. Perfect for hanging baskets and very easy to grow.', 22.99, 22.99, 'indoor', '/images/products/plants/pothos-golden.jpg', true, 4.7, 'trailing', 'small'),
('ZZ Plant', 'Extremely low-maintenance indoor plant with waxy leaves. Thrives on neglect and tolerates low light.', 34.99, 34.99, 'indoor', '/images/products/plants/zz-plant.jpg', true, 4.8, 'low-maintenance', 'medium'),
('Bird''s Nest Fern', 'Unique fern with wavy, rippled fronds that create a nest-like appearance. Excellent for humid environments.', 28.99, 28.99, 'indoor', '/images/products/plants/birds-nest-fern.jpg', true, 4.7, 'new', 'small'),
('Calathea Medallion', 'Stunning plant with intricately patterned leaves in green and purple. Leaves fold up at night.', 36.99, 42.99, 'indoor', '/images/products/plants/calathea.jpg', true, 4.5, 'sale', 'medium'),
('Aloe Vera', 'Medicinal succulent with healing gel. Low maintenance and great for sunny windowsills.', 19.99, 19.99, 'succulent', '/images/products/plants/aloe-vera.jpg', true, 4.8, 'medicinal', 'small'),
('Jade Plant', 'Lucky succulent with thick oval leaves. Symbol of prosperity and very easy to care for.', 21.99, 21.99, 'succulent', '/images/products/plants/jade-plant.jpg', true, 4.7, 'lucky', 'small'),
('Cactus Variety Pack', 'Collection of 5 different small cacti in decorative pots. Perfect for beginners or as gifts.', 49.99, 59.99, 'succulent', '/images/products/plants/cactus-variety.jpg', true, 4.5, 'variety-pack', 'small'),
('String of Pearls', 'Unique trailing succulent with bead-like leaves. Perfect for hanging planters and shelves.', 32.99, 32.99, 'succulent', '/images/products/plants/string-of-pearls.jpg', true, 4.6, 'trailing', 'small'),
('Ceramic Planter Set', 'Set of 3 elegant ceramic planters with drainage holes. Perfect for indoor plants.', 34.99, NULL, 'pots', '/images/products/pots/ceramic-planter.jpg', true, 4.7, 'popular', 'medium'),
('Terracotta Pot Collection', 'Classic terracotta pots in various sizes. Breathable material for healthy roots.', 24.99, 29.99, 'pots', '/images/products/pots/terracotta-pot-collection.jpg', true, 4.8, 'sale', 'small'),
('Modern Hanging Planter', 'Stylish hanging planter with macrame holder. Perfect for trailing plants.', 42.99, NULL, 'pots', '/images/products/pots/modern-hanging-planter.jpg', true, 4.6, 'trending', 'small'),
('Self-Watering Planter', 'Innovative self-watering system keeps plants hydrated for weeks.', 39.99, 49.99, 'pots', '/images/products/pots/self-watering.jpg', true, 4.9, 'new', 'medium'),
('Decorative Planter Stand', 'Elegant metal stand with ceramic pot. Adds height and style to any room.', 54.99, NULL, 'pots', '/images/products/pots/decorative-planter-stand.jpg', true, 4.5, 'elegant', 'large'),
('Wooden Planter Box', 'Rustic wooden box for herbs and small plants', 899.00, NULL, 'pots', '/images/products/pots/wooden-planter-box.jpg', true, 4.5, NULL, 'Large'),
('Glazed Indoor Pot', 'Beautiful glazed ceramic pot with saucer. Available in multiple colors.', 649.00, NULL, 'pots', '/images/products/pots/glazed-indoor-pot.jpg', true, 4.6, 'New', 'Medium'),
('Bamboo Fiber Planter', 'Sustainable bamboo fiber planter. Biodegradable and eco-friendly.', 399.00, NULL, 'pots', '/images/products/pots/bamboo-fiber-planter.jpg', true, 4.5, 'Eco-Friendly', 'Small'),
('Pruning Shears Set', 'Professional-grade pruning shears with ergonomic handles. Perfect for trimming and shaping.', 29.99, NULL, 'tools', '/images/products/tools/pruning-shears-set.jpg', true, 4.8, 'popular', 'small'),
('Garden Tool Kit', 'Complete 10-piece garden tool set with storage bag. Everything you need for plant care.', 44.99, 54.99, 'tools', '/images/products/tools/tool-kit.jpg', true, 4.7, 'sale', 'medium'),
('Watering Can', 'Classic metal watering can with long spout for precise watering.', 19.99, NULL, 'tools', '/images/products/tools/watering-can.jpg', true, 4.6, 'essential', 'medium'),
('Plant Mister Spray Bottle', 'Fine mist spray bottle for humidity-loving plants. Adjustable nozzle.', 14.99, NULL, 'tools', '/images/products/tools/plant-mister-spray-bottle.jpg', true, 4.9, 'new', 'small'),
('Soil pH Tester', 'Digital soil tester for pH, moisture, and light levels. Essential for plant health.', 24.99, 29.99, 'tools', '/images/products/tools/ph-tester.jpg', true, 4.5, 'tech', 'small'),
('Plant Support Stakes', 'Pack of 10 bamboo support stakes', 19.99, NULL, 'tools', '/images/products/tools/plant-support-stakes.jpg', true, 4.4, NULL, '24 inches'),
('Hand Trowel and Fork Set', 'Stainless steel hand trowel and fork with comfortable wooden handles.', 34.99, NULL, 'tools', '/images/products/tools/hand-trowel-fork-set.jpg', true, 4.7, 'Popular', 'Standard'),
('Plant Fertilizer Organic', 'All-purpose organic plant food. Promotes healthy growth and blooms.', 24.99, NULL, 'tools', '/images/products/tools/plant-fertilizer-organic.jpg', true, 4.8, 'Bestseller', '500g');
