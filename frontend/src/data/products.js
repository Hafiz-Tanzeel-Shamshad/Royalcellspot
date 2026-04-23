// Import local image assets
import iphone12Img from '../assets/iphone12.png';
import iphone12ProImg from '../assets/iPhone12Pro.png';
import samsungS24UltraImg from '../assets/samsungS24Ultra.png';
import samsungS25UltraImg from '../assets/samsungS25Ultra.png';
import appleWatchUltra2Img from '../assets/appleWatchUltra2.png';

const products = [
  // iPhone 12 Series
  {
    _id: '1',
    name: "iPhone 12",
    brand: "Apple",
    price: 699,
    discountPrice: 549,
    image: iphone12Img,
    colors: ["Black", "Blue", "White", "Red"],
    storage: ["64GB", "128GB", "256GB"],
    description: "The iPhone 12 features a stunning Super Retina XDR display, A14 Bionic chip, and advanced dual-camera system.",
    category: "smartphones"
  },
  {
    _id: '2',
    name: "iPhone 12 Pro",
    brand: "Apple",
    price: 999,
    discountPrice: 749,
    image: iphone12ProImg,
    colors: ["Graphite", "Silver", "Gold", "Pacific Blue"],
    storage: ["128GB", "256GB", "512GB"],
    description: "iPhone 12 Pro with Pro camera system, LiDAR scanner, and stainless steel design.",
    category: "smartphones"
  },
  { 
    _id: '3', 
    name: "iPhone 12 Pro Max", 
    brand: "Apple", 
    price: 1099, 
    discountPrice: 849, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-12-pro-max-1.jpg", 
    colors: ["Graphite", "Silver", "Gold", "Pacific Blue"], 
    storage: ["128GB", "256GB", "512GB"],
    description: "The largest display and best battery life in iPhone 12 Pro Max.",
    category: "smartphones"
  },

  // iPhone 13 Series
  { 
    _id: '4', 
    name: "iPhone 13", 
    brand: "Apple", 
    price: 799, 
    discountPrice: 649, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-01.jpg", 
    colors: ["Starlight", "Midnight", "Blue", "Pink", "Red"], 
    storage: ["128GB", "256GB", "512GB"],
    description: "iPhone 13 with advanced dual-camera system and A15 Bionic chip.",
    category: "smartphones"
  },
  { 
    _id: '5', 
    name: "iPhone 13 Pro", 
    brand: "Apple", 
    price: 999, 
    discountPrice: 849, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-pro-01.jpg", 
    colors: ["Graphite", "Gold", "Silver", "Sierra Blue"], 
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "iPhone 13 Pro with ProMotion display and macro photography.",
    category: "smartphones"
  },
  { 
    _id: '6', 
    name: "iPhone 13 Pro Max", 
    brand: "Apple", 
    price: 1099, 
    discountPrice: 949, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-pro-max-01.jpg", 
    colors: ["Graphite", "Gold", "Silver", "Sierra Blue"], 
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "The ultimate iPhone with the largest display and longest battery life.",
    category: "smartphones"
  },

  // iPhone 14 Series
  { 
    _id: '7', 
    name: "iPhone 14 Pro", 
    brand: "Apple", 
    price: 1099, 
    discountPrice: 949, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-3.jpg", 
    colors: ["Space Black", "Silver", "Deep Purple", "Gold"], 
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "iPhone 14 Pro with Dynamic Island and 48MP camera.",
    category: "smartphones"
  },
  { 
    _id: '8', 
    name: "iPhone 14 Pro Max", 
    brand: "Apple", 
    price: 1199, 
    discountPrice: 1049, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg", 
    colors: ["Space Black", "Silver", "Deep Purple", "Gold"], 
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "The largest Pro display with Always-On display capability.",
    category: "smartphones"
  },

  // iPhone 15 Series
  { 
    _id: '9', 
    name: "iPhone 15 Pro", 
    brand: "Apple", 
    price: 1199, 
    discountPrice: 1049, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg", 
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"], 
    storage: ["128GB", "256GB", "512GB", "1TB"],
    description: "iPhone 15 Pro with titanium design and A17 Pro chip.",
    category: "smartphones"
  },
  { 
    _id: '10', 
    name: "iPhone 15 Pro Max", 
    brand: "Apple", 
    price: 1299, 
    discountPrice: 1149, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg", 
    colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"], 
    storage: ["256GB", "512GB", "1TB"],
    description: "The most powerful iPhone with 5x Telephoto camera.",
    category: "smartphones"
  },

  // iPhone 16 Series (Latest)
  { 
    _id: '11', 
    name: "iPhone 16 Pro", 
    brand: "Apple", 
    price: 1299, 
    discountPrice: 1199, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-1.jpg", 
    colors: ["Black Titanium", "White Titanium", "Natural Titanium", "Desert Titanium"], 
    storage: ["256GB", "512GB", "1TB"],
    description: "The latest iPhone with Apple Intelligence and camera control.",
    category: "smartphones"
  },
  { 
    _id: '12', 
    name: "iPhone 16 Pro Max", 
    brand: "Apple", 
    price: 1399, 
    discountPrice: 1299, 
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-16-pro-max-1.jpg", 
    colors: ["Black Titanium", "White Titanium", "Natural Titanium", "Desert Titanium"], 
    storage: ["256GB", "512GB", "1TB"],
    description: "The biggest iPhone display with the longest battery life ever.",
    category: "smartphones"
  },

  // Samsung Galaxy Series
  { 
    _id: '13', 
    name: "Samsung Galaxy S21 Ultra", 
    brand: "Samsung", 
    price: 1199, 
    discountPrice: 749, 
    image: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-ultra-5g-1.jpg", 
    colors: ["Phantom Black", "Phantom Silver"], 
    storage: ["128GB", "256GB"],
    description: "Galaxy S21 Ultra with 108MP camera and S Pen support.",
    category: "smartphones"
  },
  { 
    _id: '14', 
    name: "Samsung Galaxy S22 Ultra", 
    brand: "Samsung", 
    price: 1299, 
    discountPrice: 849, 
    image: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s22-ultra-5g-2.jpg", 
    colors: ["Phantom Black", "White", "Burgundy", "Green"], 
    storage: ["128GB", "256GB", "512GB"],
    description: "Galaxy S22 Ultra with built-in S Pen and 108MP camera.",
    category: "smartphones"
  },
  { 
    _id: '15', 
    name: "Samsung Galaxy S23 Ultra", 
    brand: "Samsung", 
    price: 1399, 
    discountPrice: 1049, 
    image: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-1.jpg", 
    colors: ["Phantom Black", "Cream", "Green", "Lavender"], 
    storage: ["256GB", "512GB", "1TB"],
    description: "Galaxy S23 Ultra with Snapdragon 8 Gen 2 and Nightography.",
    category: "smartphones"
  },
  { 
    _id: '16',
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1499,
    discountPrice: 1199,
    image: samsungS24UltraImg,
    colors: ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
    storage: ["256GB", "512GB", "1TB"],
    description: "Galaxy S24 Ultra with Galaxy AI and titanium frame.",
    category: "smartphones"
  },
  { 
    _id: '17', 
    name: "Samsung Galaxy S25 Ultra", 
    brand: "Samsung", 
    price: 1599, 
    discountPrice: 1299, 
    image: samsungS25UltraImg, 
    colors: ["Titanium Black", "Titanium Silver Blue", "Titanium White"], 
    storage: ["256GB", "512GB", "1TB"],
    description: "The latest Galaxy S25 Ultra with Snapdragon 8 Elite.",
    category: "smartphones"
  },

  // Google Pixel
  { 
    _id: '18', 
    name: "Google Pixel 9 Pro XL", 
    brand: "Google", 
    price: 1099, 
    discountPrice: 949, 
    image: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-xl-1.jpg",
    colors: ["Obsidian", "Porcelain", "Hazel"], 
    storage: ["128GB", "256GB", "512GB"],
    description: "Pixel 9 Pro XL with Google AI and Tensor G4 chip.",
    category: "smartphones"
  },
  { 
    _id: '19', 
    name: "Google Pixel 9 Pro", 
    brand: "Google", 
    price: 999, 
    discountPrice: 849, 
    image: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-1.jpg",
    colors: ["Obsidian", "Porcelain", "Hazel"], 
    storage: ["128GB", "256GB", "512GB"],
    description: "Pixel 9 Pro with advanced AI photography features.",
    category: "smartphones"
  },
  { 
    _id: '20', 
    name: "Google Pixel 9 Pro Fold", 
    brand: "Google", 
    price: 1799, 
    discountPrice: 1599, 
    image: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg",
    colors: ["Obsidian", "Porcelain"], 
    storage: ["256GB"],
    description: "Google's first foldable smartphone with dual displays.",
    category: "smartphones"
  },

  // Accessories
  { 
    _id: '21', 
    name: "MacBook Pro 14\" M3", 
    brand: "Apple", 
    price: 1999, 
    discountPrice: 1799, 
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
    colors: ["Space Gray", "Silver"], 
    storage: ["512GB", "1TB", "2TB"],
    description: "MacBook Pro with M3 chip for pro-level performance.",
    category: "accessories"
  },
  { 
    _id: '22', 
    name: "Apple Watch Ultra 2", 
    brand: "Apple", 
    price: 799, 
    discountPrice: 699, 
    image: appleWatchUltra2Img,
    colors: ["Orange Alpine Loop", "Green Alpine Loop", "Blue Ocean Band"], 
    storage: ["49mm"],
    description: "The most rugged and capable Apple Watch.",
    category: "accessories"
  },
  { 
    _id: '23', 
    name: "AirPods Pro 2", 
    brand: "Apple", 
    price: 249, 
    discountPrice: 199, 
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=1144&hei=1144&fmt=jpeg&qlt=95&.v=1694014871985",
    colors: ["White"], 
    storage: ["USB-C"],
    description: "AirPods Pro with adaptive Audio and USB-C charging.",
    category: "accessories"
  },
];

export default products;
