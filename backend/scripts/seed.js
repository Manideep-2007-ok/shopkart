// node scripts/seed.js  -> inserts/updates the sample catalogue
// Images live in frontend/public/img (served by the Vite dev server)
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product.model");

const products = [
  {
    name: "Bluetooth Over-Ear Headphones",
    description: "Foldable wireless headphones with soft ear cushions and up to 35 hours of battery life.",
    price: 4999, category: "Electronics", image: "/img/headphones.jpg", stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    description: "Full-size backlit keyboard with a firm typing feel and a USB cable.",
    price: 2999, category: "Electronics", image: "/img/keyboard.jpg", stock: 10,
  },
  {
    name: "Wireless Mouse",
    description: "Compact 2.4 GHz wireless mouse with a USB receiver and silent buttons.",
    price: 1499, category: "Electronics", image: "/img/mouse.jpg", stock: 40,
  },
  {
    name: "Samsung Galaxy A32",
    description: "6.4 inch AMOLED display, 128GB storage and a quad camera setup.",
    price: 18999, category: "Electronics", image: "/img/phone.jpg", stock: 8,
  },
  {
    name: "Denim Jacket",
    description: "Classic blue denim jacket with button front and chest pockets.",
    price: 2499, category: "Fashion", image: "/img/jacket.jpg", stock: 15,
  },
  {
    name: "Road Running Shoes",
    description: "Cushioned running shoes with a breathable mesh upper.",
    price: 3299, category: "Fashion", image: "/img/shoes.jpg", stock: 20,
  },
  {
    name: "Classic Sunglasses",
    description: "Lightweight UV400 sunglasses with a durable frame.",
    price: 799, category: "Fashion", image: "/img/sunglasses.jpg", stock: 60,
  },
  {
    name: "Analog Wristwatch",
    description: "Stainless steel analog watch with a date window and leather strap.",
    price: 3999, category: "Fashion", image: "/img/watch.jpg", stock: 12,
  },
  {
    name: "Paperback Bestsellers Bundle",
    description: "A stack of popular paperbacks, handy for a reading shelf or a gift.",
    price: 1299, category: "Books", image: "/img/books1.jpg", stock: 30,
  },
  {
    name: "Coffee Table Book Collection",
    description: "Large-format fashion and design books that look good on a coffee table.",
    price: 2199, category: "Books", image: "/img/books2.jpg", stock: 5,
  },
  {
    name: "LED Desk Lamp",
    description: "Bamboo-finish LED desk lamp with adjustable brightness.",
    price: 1199, category: "Home", image: "/img/lamp.jpg", stock: 18,
  },
  {
    name: "Handmade Ceramic Mugs",
    description: "Set of handmade ceramic mugs with a star pattern, dishwasher safe.",
    price: 699, category: "Home", image: "/img/mugs.jpg", stock: 3,
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // remove the placeholder products from the first version of the seed
  const old = await Product.deleteMany({ image: /picsum\.photos/ });
  if (old.deletedCount) console.log(`Removed ${old.deletedCount} old placeholder products.`);

  for (const p of products) {
    await Product.updateOne({ name: p.name }, { $set: p }, { upsert: true });
  }
  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
})();
