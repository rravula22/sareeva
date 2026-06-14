import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
import { Pool } from "pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
});

const sampleProducts = [
  {
    name: "Kanjivaram Silk Zari Saree",
    description: "A regal Kanjivaram silk saree woven with temple borders and rich zari work for bridal ceremonies and heirloom celebrations.",
    price: 5999,
    mrp: 8999,
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"],
    fabric: "Silk",
    occasion: ["Wedding", "Festive"],
    color: ["Gold", "Red"],
    sizes: ["Free Size"],
    stock: 18,
    category: "Bridal Saree",
    subcategory: "Kanjivaram",
    tags: ["bestseller", "premium"],
    isFeatured: true,
  },
  {
    name: "Banarasi Brocade Celebration Saree",
    description: "Classic Banarasi drape with antique gold motifs, tailored for sangeet nights and festive family occasions.",
    price: 4499,
    mrp: 6999,
    images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80"],
    fabric: "Banarasi",
    occasion: ["Wedding", "Party"],
    color: ["Pink", "Gold"],
    sizes: ["Free Size"],
    stock: 15,
    category: "Designer Saree",
    subcategory: "Banarasi",
    tags: ["new"],
    isFeatured: true,
  },
  {
    name: "Soft Cotton Temple Border Saree",
    description: "Breathable cotton saree with woven temple border designed for comfort during workdays, poojas, and daily wear.",
    price: 1599,
    mrp: 2499,
    images: ["https://images.unsplash.com/photo-1596844547754-3f9a619d49c1?auto=format&fit=crop&w=900&q=80"],
    fabric: "Cotton",
    occasion: ["Office", "Daily Wear"],
    color: ["Green", "Ivory"],
    sizes: ["Free Size"],
    stock: 30,
    category: "Cotton Saree",
    subcategory: "Temple Border",
    tags: ["daily"],
    isFeatured: false,
  },
  {
    name: "Georgette Sequin Party Saree",
    description: "Flowy georgette party saree highlighted with delicate sequins and easy drape styling for evening occasions.",
    price: 2799,
    mrp: 4299,
    images: ["https://images.unsplash.com/photo-1618244972963-dbad68f9cfe7?auto=format&fit=crop&w=900&q=80"],
    fabric: "Georgette",
    occasion: ["Party", "Festive"],
    color: ["Black", "Gold"],
    sizes: ["Free Size"],
    stock: 24,
    category: "Designer Saree",
    subcategory: "Sequin",
    tags: ["party"],
    isFeatured: true,
  },
  {
    name: "Chiffon Floral Daywear Saree",
    description: "Lightweight chiffon saree with floral print and airy fall, perfect for brunches, travel, and intimate celebrations.",
    price: 1899,
    mrp: 2899,
    images: ["https://images.unsplash.com/photo-1617469165786-8007eda3caa7?auto=format&fit=crop&w=900&q=80"],
    fabric: "Chiffon",
    occasion: ["Casual", "Daily Wear"],
    color: ["Pink", "Blue"],
    sizes: ["Free Size"],
    stock: 22,
    category: "Saree",
    subcategory: "Printed",
    tags: ["new"],
    isFeatured: false,
  },
  {
    name: "Linen Zari Border Saree",
    description: "Contemporary linen saree elevated with zari accents, balancing comfort and understated festive polish.",
    price: 2399,
    mrp: 3499,
    images: ["https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=900&q=80"],
    fabric: "Linen",
    occasion: ["Office", "Festive"],
    color: ["Blue", "Gold"],
    sizes: ["Free Size"],
    stock: 20,
    category: "Designer Saree",
    subcategory: "Linen Blend",
    tags: ["limited"],
    isFeatured: false,
  },
  {
    name: "Crepe Embellished Reception Saree",
    description: "Elegant crepe saree with tonal embellishment and luxe drape made for receptions and cocktail events.",
    price: 3299,
    mrp: 4999,
    images: ["https://images.unsplash.com/photo-1618244972963-dbad68f9cfe7?auto=format&fit=crop&w=900&q=80"],
    fabric: "Crepe",
    occasion: ["Party", "Wedding"],
    color: ["Purple", "Gold"],
    sizes: ["Free Size"],
    stock: 14,
    category: "Designer Saree",
    subcategory: "Reception",
    tags: ["bestseller"],
    isFeatured: true,
  },
  {
    name: "Handloom Cotton Festive Saree",
    description: "Textured handloom cotton saree finished with artisanal stripes for daytime festivities and cultural gatherings.",
    price: 1999,
    mrp: 2999,
    images: ["https://images.unsplash.com/photo-1596844547754-3f9a619d49c1?auto=format&fit=crop&w=900&q=80"],
    fabric: "Cotton",
    occasion: ["Festive", "Casual"],
    color: ["Red", "Ivory"],
    sizes: ["Free Size"],
    stock: 28,
    category: "Cotton Saree",
    subcategory: "Handloom",
    tags: ["handloom"],
    isFeatured: false,
  },
  {
    name: "Organza Embroidered Wedding Saree",
    description: "Sheer organza saree with intricate floral embroidery and shimmer edging for modern wedding wardrobes.",
    price: 3899,
    mrp: 5799,
    images: ["https://images.unsplash.com/photo-1617469165786-8007eda3caa7?auto=format&fit=crop&w=900&q=80"],
    fabric: "Silk",
    occasion: ["Wedding", "Festive"],
    color: ["Pink", "Gold"],
    sizes: ["Free Size"],
    stock: 16,
    category: "Bridal Saree",
    subcategory: "Organza",
    tags: ["new", "premium"],
    isFeatured: true,
  },
  {
    name: "Minimal Office Wear Saree",
    description: "Easy-care saree with neat border detailing designed for long office days and polished weekday dressing.",
    price: 1499,
    mrp: 2299,
    images: ["https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=900&q=80"],
    fabric: "Cotton",
    occasion: ["Office", "Daily Wear"],
    color: ["Blue", "Black"],
    sizes: ["Free Size"],
    stock: 35,
    category: "Saree",
    subcategory: "Office Wear",
    tags: ["essential"],
    isFeatured: false,
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const sellerPassword = await bcrypt.hash("seller123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sareeva.com" },
    update: {
      name: "Sareeva Admin",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+91 90000 11111",
    },
    create: {
      name: "Sareeva Admin",
      email: "admin@sareeva.com",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+91 90000 11111",
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@sareeva.com" },
    update: {
      name: "Sareeva Seller",
      password: sellerPassword,
      role: Role.SELLER,
      phone: "+91 90000 22222",
    },
    create: {
      name: "Sareeva Seller",
      email: "seller@sareeva.com",
      password: sellerPassword,
      role: Role.SELLER,
      phone: "+91 90000 22222",
    },
  });

  const sellerProfile = await prisma.sellerProfile.upsert({
    where: { userId: seller.id },
    update: {
      storeName: "Silk Routes",
      description: "Silk Routes curates heirloom-worthy silks, festive favourites, and statement occasion sarees from artisan clusters across India.",
      verified: true,
    },
    create: {
      userId: seller.id,
      storeName: "Silk Routes",
      description: "Silk Routes curates heirloom-worthy silks, festive favourites, and statement occasion sarees from artisan clusters across India.",
      verified: true,
    },
  });

  await prisma.product.deleteMany({ where: { sellerId: sellerProfile.id } });

  for (const product of sampleProducts) {
    await prisma.product.create({
      data: {
        ...product,
        sellerId: sellerProfile.id,
      },
    });
  }

  console.log(`Seeded admin ${admin.email}, seller ${seller.email}, and ${sampleProducts.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
