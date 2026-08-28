// Run with: node seed.js
require('dotenv').config('https://shop-smart-ai-ten.vercel.app/');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const ViewHistory = require('./models/ViewHistory');
const Order = require('./models/Order');

const sampleProducts = [
  // --- Electronics (1-20) ---
  {
    name: '4K Ultra HD Smart TV',
    price: 32999,
    category: 'Electronics',
    description: 'Immersive 43-inch 4K HDR display with Dolby Audio and built-in streaming apps.',
    specs: '43" UHD 4K, 60Hz, 3x HDMI, 2x USB, Dolby Audio',
    features: ['performance'],
    image: '/image/4K Ultra HD Smart TV.webp',
    stock: 20,
    rating: 4.5,
    isPopular: true
  },
  {
    name: '1080p Webcam with Mic',
    price: 1899,
    category: 'Electronics',
    description: 'Full HD plug-and-play webcam with dual noise-cancelling microphones.',
    specs: '1080p @ 30fps, 90° FOV, USB 2.0 Plug & Play',
    features: ['camera'],
    image: '/image/1080p Webcam with Mic.jpg',
    stock: 45,
    rating: 4.2
  },
  {
    name: 'Apple iPad Air',
    price: 54900,
    category: 'Electronics',
    description: 'Powerful tablet with Liquid Retina display, M-series processing power, and all-day battery.',
    specs: '10.9" Liquid Retina, 64GB, Wi-Fi 6, Touch ID',
    features: ['performance', 'battery', 'lightweight'],
    image: '/image/Apple iPad Air.webp',
    stock: 14,
    rating: 4.8,
    battery: 'Excellent',
    isPopular: true
  },
  {
    name: 'Asus Vivobook 14',
    price: 38999,
    category: 'Electronics',
    description: 'Lightweight everyday laptop with a full HD display and fast charging.',
    specs: 'Intel Core i3 12th Gen, 8GB RAM, 512GB NVMe SSD, FHD 14"',
    features: ['lightweight', 'battery'],
    image: '/image/Asus Vivobook 14.jpg',
    stock: 25,
    rating: 4.4,
    battery: 'Excellent',
    isPopular: true
  },
  {
    name: 'Dell Vostro 3420',
    price: 39490,
    category: 'Electronics',
    description: 'Durable business laptop optimized for daily productivity and long battery runtime.',
    specs: 'Intel Core i3 11th Gen, 8GB DDR4, 512GB SSD, 14" Anti-Glare',
    features: ['battery', 'performance'],
    image: '/image/Dell Vostro 3420.webp',
    stock: 18,
    rating: 4.3,
    battery: 'Great'
  },
  {
    name: 'Dual-Band Wi-Fi 6 Router',
    price: 2799,
    category: 'Electronics',
    description: 'High-speed gigabit Wi-Fi 6 router with 4 high-gain antennas for whole-home coverage.',
    specs: 'AX1500 Speed, 4 Gigabit LAN Ports, OFDMA + MU-MIMO',
    features: ['performance'],
    image: '/image/Dual-Band Wi-Fi 6 Router.jpg',
    stock: 35,
    rating: 4.3
  },
  {
    name: 'Electric Toothbrush',
    price: 1299,
    category: 'Electronics',
    description: 'Sonic rechargeable electric toothbrush with 30-day battery life and timer.',
    specs: '40,000 VPM Motor, 4 Cleaning Modes, IPX7 Waterproof',
    features: ['battery'],
    image: '/image/Electric Toothbrush.jpg',
    stock: 50,
    rating: 4.1,
    battery: 'Excellent'
  },
  {
    name: 'External Solid State Drive',
    price: 5999,
    category: 'Electronics',
    description: 'Ultra-fast compact portable SSD for lightning-speed file transfers and backups.',
    specs: '1TB Storage, USB 3.2 Gen 2 Type-C, Up to 1050 MB/s',
    features: ['performance', 'lightweight'],
    image: '/image/External Solid State Drive.jpg',
    stock: 30,
    rating: 4.6
  },
  {
    name: 'Full HD Projector',
    price: 12499,
    category: 'Electronics',
    description: 'Cinema-grade home theatre projector with native 1080p resolution and screen mirroring.',
    specs: 'Native 1080p, 4500 Lumens, HDMI/USB/AV, Keystone Correction',
    features: [],
    image: '/image/Full HD Projector.jpg',
    stock: 12,
    rating: 4.2
  },
  {
    name: 'Graphics Drawing Tablet',
    price: 3499,
    category: 'Electronics',
    description: 'Ergonomic drawing tablet with battery-free stylus for digital art and online teaching.',
    specs: '10x6 Inch Active Area, 8192 Pressure Levels, 8 Express Keys',
    features: ['lightweight'],
    image: '/image/Graphics Drawing Tablet.jpg',
    stock: 22,
    rating: 4.4
  },
  {
    name: 'HP Pavilion 15',
    price: 45999,
    category: 'Electronics',
    description: 'Balanced performance laptop for intensive multitasking, work, and multimedia.',
    specs: 'Intel Core i5 12th Gen, 16GB RAM, 512GB SSD, 15.6" FHD IPS',
    features: ['performance', 'battery'],
    image: '/image/HP Pavilion 15.webp',
    stock: 15,
    rating: 4.5,
    battery: 'Great',
    isPopular: true
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 2499,
    category: 'Electronics',
    description: 'RGB backlit mechanical keyboard with tactile blue switches and anti-ghosting.',
    specs: 'RGB Backlit, Outemu Blue Switches, Detachable Type-C Cable',
    features: ['performance'],
    image: '/image/Mechanical Gaming Keyboard.jpg',
    stock: 40,
    rating: 4.4
  },
  {
    name: 'Noise Cancelling Earbuds',
    price: 3999,
    category: 'Electronics',
    description: 'True wireless stereo earbuds with active noise cancellation and 32-hour playback.',
    specs: 'Active Noise Cancellation (ANC), 32H Total Playtime, IPX5',
    features: ['battery', 'lightweight'],
    image: '/image/Noise Cancelling Earbuds.jpg',
    stock: 55,
    rating: 4.3,
    battery: 'Great'
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 1999,
    category: 'Electronics',
    description: 'Waterproof wireless speaker with deep bass, punchy highs, and 12-hour battery.',
    specs: '16W Output, IPX7 Waterproof, Bluetooth 5.3, 12H Battery',
    features: ['battery'],
    image: '/image/Portable Bluetooth Speaker.webp',
    stock: 65,
    rating: 4.3,
    battery: 'Great'
  },
  {
    name: 'Professional DSLR Camera',
    price: 48990,
    category: 'Electronics',
    description: 'High-resolution digital SLR camera with 18-55mm lens kit for pristine photography.',
    specs: '24.1 MP APS-C CMOS Sensor, DIGIC 8, 4K Video, Dual Pixel AF',
    features: ['camera'],
    image: '/image/Professional DSLR Camera.jpg',
    stock: 8,
    rating: 4.7,
    isPopular: true
  },
  {
    name: 'Samsung Galaxy M34',
    price: 16999,
    category: 'Electronics',
    description: '5G smartphone featuring a massive 6000mAh battery and 120Hz Super AMOLED display.',
    specs: '6.5" 120Hz AMOLED, 50MP OIS Camera, 6000mAh Battery, 128GB',
    features: ['battery', 'camera', 'performance'],
    image: '/image/Samsung Galaxy M34.webp',
    stock: 28,
    rating: 4.4,
    battery: 'Excellent',
    isPopular: true
  },
  {
    name: 'Smart Fitness Watch',
    price: 2199,
    category: 'Electronics',
    description: 'Sleek smartwatch with heart-rate monitoring, 100+ sport modes, and 7-day battery backup.',
    specs: '1.85" HD Display, SpO2 & Heart Rate Tracker, Bluetooth Calling',
    features: ['battery'],
    image: '/image/Smart Fitness Watch.jpg',
    stock: 50,
    rating: 4.2,
    battery: 'Great'
  },
  {
    name: 'Sony WH-1000XM4',
    price: 22990,
    category: 'Electronics',
    description: 'Industry-leading noise-cancelling wireless headphones with 30-hour battery and Hi-Res Audio.',
    specs: 'HD Noise Cancelling QN1, 30H Battery, Touch Sensor Controls',
    features: ['battery', 'performance'],
    image: '/image/Sony WH-1000XM4.avif',
    stock: 16,
    rating: 4.9,
    battery: 'Excellent',
    isPopular: true
  },
  {
    name: 'Streaming Condenser Mic',
    price: 2999,
    category: 'Electronics',
    description: 'Studio-quality USB condenser microphone for gaming, podcasting, and voiceovers.',
    specs: 'Cardioid Pickup Pattern, 24-bit/192kHz, Tap-to-Mute Sensor',
    features: [],
    image: '/image/Streaming Condenser Mic.jpg',
    stock: 25,
    rating: 4.3
  },
  {
    name: 'Wireless Gaming Mouse',
    price: 1499,
    category: 'Electronics',
    description: 'Ultralight wireless gaming mouse with 10,000 DPI sensor and programmable buttons.',
    specs: '10K DPI Optical Sensor, 2.4GHz Wireless, RGB Lighting, 69g',
    features: ['lightweight', 'performance'],
    image: '/image/Wireless Gaming Mouse.jpg',
    stock: 45,
    rating: 4.2
  },

  // --- Fashion (21-35) ---
  {
    name: 'Aviator Sunglasses',
    price: 1299,
    category: 'Fashion',
    description: 'Timeless metal frame aviator sunglasses with UV400 polarized protective lenses.',
    specs: 'UV400 Protection, Polarized Metal Frame, Unisex',
    features: [],
    image: '/image/Aviator Sunglasses.webp',
    stock: 50,
    rating: 4.3
  },
  {
    name: 'Canvas Crossbody Bag',
    price: 1199,
    category: 'Fashion',
    description: 'Casual multi-pocket canvas messenger crossbody bag for everyday essentials.',
    specs: 'Durable Canvas Material, Adjustable Shoulder Strap, 4 Pockets',
    features: ['lightweight'],
    image: '/image/Canvas Crossbody Bag.jpg',
    stock: 35,
    rating: 4.1
  },
  {
    name: 'Canvas Slip-on Sneakers',
    price: 1599,
    category: 'Fashion',
    description: 'Comfortable low-top canvas slip-on sneakers with non-slip rubber soles.',
    specs: 'Sizes 6-11, Breathable Canvas Upper, Cushioned Insole',
    features: [],
    image: '/image/Canvas Slip-on Sneakers.jpg',
    stock: 40,
    rating: 4.2
  },
  {
    name: "Leather Men's Wallet",
    price: 899,
    category: 'Fashion',
    description: 'Genuine slim bi-fold leather wallet with RFID blocking technology.',
    specs: 'Genuine Leather, 8 Card Slots, RFID Blocking Shield',
    features: [],
    image: "/image/Leather Men's Wallet.jpg",
    stock: 60,
    rating: 4.5
  },
  {
    name: "Men's Casual Denim Jacket",
    price: 2499,
    category: 'Fashion',
    description: 'Classic trucker fit denim jacket made with premium durable cotton blend.',
    specs: 'Sizes M-XXL, 100% Cotton Denim, Button Closure',
    features: [],
    image: "/image/Men's Casual Denim Jacket.webp",
    stock: 30,
    rating: 4.4,
    isPopular: true
  },
  {
    name: "Men's Slim Fit Chinos",
    price: 1499,
    category: 'Fashion',
    description: 'Stretchable formal and casual slim-fit chino trousers.',
    specs: 'Sizes 30-38, 98% Cotton / 2% Elastane, Wrinkle-Resistant',
    features: [],
    image: "/image/Men's Slim Fit Chinos.jpg",
    stock: 40,
    rating: 4.1
  },
  {
    name: 'Minimalist Leather Backpack',
    price: 2999,
    category: 'Fashion',
    description: 'Premium faux leather laptop backpack suited for business, college, and travel.',
    specs: 'Fits up to 15.6" Laptop, Water-Resistant PU Leather, 20L',
    features: [],
    image: '/image/Minimalist Leather Backpack.jpg',
    stock: 25,
    rating: 4.5
  },
  {
    name: 'Polarized Sports Sunglasses',
    price: 999,
    category: 'Fashion',
    description: 'Lightweight aerodynamic sunglasses for running, cycling, and outdoor driving.',
    specs: 'TR90 Frame, Polarized HD TAC Lenses, Anti-Slip Nose Pad',
    features: ['lightweight'],
    image: '/image/Polarized Sports Sunglasses.jpg',
    stock: 45,
    rating: 4.2
  },
  {
    name: 'Running Shoes Pro',
    price: 2799,
    category: 'Fashion',
    description: 'Breathable lightweight mesh running shoes with responsive shock-absorption.',
    specs: 'Sizes 6-12, EVA Cushioning Sole, Breathable Mesh Upper',
    features: ['lightweight'],
    image: '/image/Running Shoes.webp',
    stock: 35,
    rating: 4.6,
    isPopular: true
  },
  {
    name: 'Sport Hiking Backpack',
    price: 1899,
    category: 'Fashion',
    description: 'Heavy-duty 45L outdoor trekking backpack with rain cover and hydration port.',
    specs: '45L Capacity, Water-Resistant Nylon, Ergonomic Back Support',
    features: [],
    image: '/image/Sport Hiking Backpack.jpg',
    stock: 20,
    rating: 4.4
  },
  {
    name: 'Stainless Steel Chronograph',
    price: 3499,
    category: 'Fashion',
    description: 'Classic luxury stainless steel chronograph watch with quartz movement and date window.',
    specs: '42mm Dial, Stainless Steel Link Strap, 30M Water Resistance',
    features: [],
    image: '/image/Stainless Steel Chronograph.webp',
    stock: 25,
    rating: 4.5,
    isPopular: true
  },
  {
    name: 'Unisex Cotton Hoodie',
    price: 1699,
    category: 'Fashion',
    description: 'Soft fleece-lined pullover hoodie with kangaroo pocket and drawstring hood.',
    specs: 'Sizes S-XXL, 80% Cotton / 20% Polyester Fleece, 320 GSM',
    features: [],
    image: '/image/Unisex Cotton Hoodie.webp',
    stock: 45,
    rating: 4.3
  },
  {
    name: "Women's Analogue Watch",
    price: 2199,
    category: 'Fashion',
    description: 'Elegant rose-gold analogue watch with crystal-accented bezel and mesh strap.',
    specs: 'Rose Gold Plated, Quartz Mechanism, Mineral Glass',
    features: [],
    image: "/image/Women's Analogue Watch.webp",
    stock: 30,
    rating: 4.4
  },
  {
    name: "Women's Leather Tote Bag",
    price: 2399,
    category: 'Fashion',
    description: 'Spacious everyday leather shoulder tote bag with sturdy handles and zip compartment.',
    specs: 'Premium Vegan Leather, Holds 14" Laptop, Inner Zip Pockets',
    features: [],
    image: "/image/Women's Leather Tote Bag.webp",
    stock: 22,
    rating: 4.5
  },
  {
    name: "Women's Running Shorts",
    price: 799,
    category: 'Fashion',
    description: 'High-waisted lightweight workout shorts with compression liner and phone pocket.',
    specs: 'Sizes XS-XL, Quick-Dry Polyester Spandex, 2-in-1 Design',
    features: ['lightweight'],
    image: "/image/Women's Running Shorts.jpg",
    stock: 50,
    rating: 4.2
  },

  // --- Home (36-50) ---
  {
    name: 'Air Purifier for Home',
    price: 6499,
    category: 'Home',
    description: 'True HEPA air purifier with 3-stage filtration capturing 99.97% of airborne particles.',
    specs: 'True HEPA H13 Filter, CADR 190 m³/h, Covers up to 250 sq.ft.',
    features: [],
    image: '/image/Air Purifier for Home.webp',
    stock: 16,
    rating: 4.6,
    isPopular: true
  },
  {
    name: 'Aromatic Reed Diffuser Set',
    price: 699,
    category: 'Home',
    description: 'Essential oil reed diffuser with natural rattan sticks providing continuous calming aroma.',
    specs: '100ml French Lavender Oil, 8 Natural Reed Sticks, 45-Day Fragrance',
    features: [],
    image: '/image/Aromatic Reed Diffuser Set.webp',
    stock: 40,
    rating: 4.1
  },
  {
    name: 'Cast Iron Skillet',
    price: 1499,
    category: 'Home',
    description: 'Pre-seasoned heavy-duty cast iron frying pan for searing, baking, and stovetop cooking.',
    specs: '10.25 Inch Diameter, Pre-Seasoned with 100% Natural Vegetable Oil',
    features: [],
    image: '/image/Cast Iron Skillet.jpg',
    stock: 25,
    rating: 4.6
  },
  {
    name: 'Ceramic Succulent Pots',
    price: 599,
    category: 'Home',
    description: 'Set of 3 modern ceramic planter pots with bamboo drainage trays for indoor plants.',
    specs: 'Pack of 3, 3.5" Diameter, Drainage Hole & Bamboo Trays',
    features: [],
    image: '/image/Ceramic Succulent Pots.jpg',
    stock: 35,
    rating: 4.3
  },
  {
    name: 'Digital Kitchen Scale',
    price: 799,
    category: 'Home',
    description: 'High-precision digital food scale with tare function and easy-to-read LCD screen.',
    specs: 'Up to 5kg Capacity, 1g Graduation, Tare & Unit Conversion',
    features: ['lightweight'],
    image: '/image/Digital Kitchen Scale.webp',
    stock: 45,
    rating: 4.2
  },
  {
    name: 'Electric Milk Frother',
    price: 899,
    category: 'Home',
    description: 'Handheld battery-operated stainless steel whisk for frothy coffee, latte, and matcha.',
    specs: 'Stainless Steel Whisk, 19,000 RPM Motor, Battery Operated',
    features: ['battery'],
    image: '/image/Electric Milk Frother.jpg',
    stock: 40,
    rating: 4.0,
    battery: 'Great'
  },
  {
    name: 'Ergonomic Office Chair',
    price: 8499,
    category: 'Home',
    description: 'Breathable mesh executive desk chair with adjustable lumbar support and 3D armrests.',
    specs: 'High-Density Mesh, Adjustable Lumbar & Headrest, 360° Swivel',
    features: [],
    image: '/image/Ergonomic Office Chair.webp',
    stock: 12,
    rating: 4.5,
    isPopular: true
  },
  {
    name: 'Gourmet Knife Block Set',
    price: 2999,
    category: 'Home',
    description: '6-piece high-carbon stainless steel chef knife set with natural wooden block.',
    specs: 'High Carbon Stainless Steel, 6 Pieces including Shears & Honer',
    features: [],
    image: '/image/Gourmet Knife Block Set.jpg',
    stock: 18,
    rating: 4.4
  },
  {
    name: 'LED Desk Lamp',
    price: 1199,
    category: 'Home',
    description: 'Eye-caring flexible LED study lamp with 3 color modes, stepless dimming, and USB port.',
    specs: 'Touch Control, 5 Brightness Levels, 3 Color Temps, USB Output',
    features: [],
    image: '/image/LED Desk Lamp.jpg',
    stock: 35,
    rating: 4.3
  },
  {
    name: 'Memory Foam Pillow',
    price: 1299,
    category: 'Home',
    description: 'Orthopedic contour memory foam neck support pillow with cooling breathable cover.',
    specs: 'Slow Rebound Memory Foam, Washable Bamboo Fiber Cover',
    features: [],
    image: '/image/Memory Foam Pillow.jpg',
    stock: 30,
    rating: 4.4
  },
  {
    name: 'Microfiber Bath Towels',
    price: 899,
    category: 'Home',
    description: 'Super absorbent, fast-drying, ultra-soft microfiber bath towel set.',
    specs: 'Set of 2 (70x140 cm), 400 GSM Microfiber, Quick Drying',
    features: [],
    image: '/image/Microfiber Bath Towels.jpg',
    stock: 40,
    rating: 4.1
  },
  {
    name: 'Non-Stick Cookware Set',
    price: 3799,
    category: 'Home',
    description: '3-piece granite-coated non-stick cookware set including fry pan, kadai, and tawa.',
    specs: '3-Layer Granite Coating, Induction & Gas Compatible, PFOA Free',
    features: [],
    image: '/image/Non-Stick Cookware Set.jpg',
    stock: 15,
    rating: 4.3
  },
  {
    name: 'Premium Coffee Maker',
    price: 4299,
    category: 'Home',
    description: 'Drip coffee machine with programmable timer, anti-drip valve, and keep-warm carafe.',
    specs: '1.2L Glass Carafe (10 Cups), 800W, Auto Keep-Warm Plate',
    features: [],
    image: '/image/Premium Coffee Maker.webp',
    stock: 14,
    rating: 4.4
  },
  {
    name: 'Smart LED Light Bulb',
    price: 699,
    category: 'Home',
    description: 'Wi-Fi enabled 9W smart LED bulb with 16 million colors and voice assistant control.',
    specs: '9W (810 Lumens), B22 Base, Alexa & Google Assistant Compatible',
    features: [],
    image: '/image/Smart LED Light Bulb.jpg',
    stock: 60,
    rating: 4.2
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 749,
    category: 'Home',
    description: 'Double-walled vacuum insulated flask keeping drinks cold for 24h or hot for 12h.',
    specs: '750ml Capacity, 18/8 Food Grade Stainless Steel, Leak Proof',
    features: [],
    image: '/image/Stainless Steel Water Bottle.webp',
    stock: 50,
    rating: 4.5
  },
  {
    name: 'Ultra-Quiet Desk Fan',
    price: 1399,
    category: 'Home',
    description: 'Portable rechargeable USB desk fan with 3 speed settings and 12-hour battery.',
    specs: '4000mAh Battery, 3 Speed Modes, 120° Oscillation, USB-C',
    features: ['battery', 'lightweight'],
    image: '/image/Portable Bluetooth Speaker.webp',
    stock: 35,
    rating: 4.3,
    battery: 'Great'
  },
  {
    name: 'Multi-Device Bluetooth Keyboard',
    price: 1799,
    category: 'Electronics',
    description: 'Slim wireless keyboard supporting seamless switching across 3 devices.',
    specs: 'Bluetooth 5.0 + 2.4G, Rechargeable 500mAh, Universal OS Support',
    features: ['lightweight', 'battery'],
    image: '/image/Mechanical Gaming Keyboard.jpg',
    stock: 42,
    rating: 4.4,
    battery: 'Great'
  }
];

const run = async () => {
  await connectDB();

  try {
    // Clear all existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await ViewHistory.deleteMany();
    await Order.deleteMany();

    // Create Admin and Demo User accounts
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopsmart.com',
      password: adminPassword,
      mobile: '9876543210',
      dob: new Date('1995-01-01'),
      addresses: [
        {
          street: '12 IT Expressway',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600096',
          landmark: 'Near Tech Park',
          isDefault: true
        }
      ]
    });

    const demoUser = await User.create({
      name: 'Demo Shopper',
      email: 'user@shopsmart.com',
      password: userPassword,
      mobile: '9876543211',
      dob: new Date('1998-05-15'),
      addresses: [
        {
          street: '45 Mount Road',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600002',
          landmark: 'Opposite Metro',
          isDefault: true
        }
      ]
    });

    // Seed Products
    const insertedProducts = await Product.insertMany(sampleProducts);

    console.log('----------------------------------------------------');
    console.log(`Database Seeded Successfully!`);
    console.log(`Total Products Inserted : ${insertedProducts.length}`);
    console.log(`Admin Account Created   : admin@shopsmart.com / Admin@123`);
    console.log(`Demo User Created       : user@shopsmart.com / User@123`);
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('Seeding process failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();