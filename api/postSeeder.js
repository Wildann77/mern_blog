import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import Post from './models/post.model.js';
import User from './models/user.model.js';

dotenv.config();

const createSlug = (title) => {
  return title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
};

// Use environment variable for MongoDB connection
const MONGO_URI = process.env.MONGO;

const seedPosts = async () => {
  // Validate MONGO_URI
  if (!MONGO_URI) {
    console.error('❌ MONGO environment variable is not set!');
    console.error('Please check your .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected...');

    // 🛠 Drop index lama jika masih ada
    await Post.collection.dropIndex('category_1').then(() => {
      console.log('🧹 Index category_1 dropped');
    }).catch((err) => {
      if (err.code === 27) {
        console.log('ℹ️ Index category_1 not found (skip)');
      } else {
        console.error('❌ Error dropping index:', err);
        process.exit(1);
      }
    });

    // 🟠 Cari user admin
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    await Post.deleteMany();
    console.log('🗑️ Existing posts deleted');

    const categories = ['Tech', 'Lifestyle', 'News', 'Education', 'Travel', 'Health'];
    const posts = [];

    for (let i = 0; i < 15; i++) {
      const title = faker.lorem.sentence(5);
      const content = faker.lorem.paragraphs(3);
      const category = faker.helpers.arrayElement(categories);
      const photo = faker.image.url();

      posts.push({
        title,
        content,
        slug: createSlug(title),
        category,
        image: photo,
        userId: adminUser._id,
      });
    }

    await Post.insertMany(posts);
    console.log('✅ 15 posts created successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error inserting posts:');
    console.error(err);
    process.exit(1);
  }
};

seedPosts();
