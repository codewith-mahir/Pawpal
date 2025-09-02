require('dotenv').config();
const mongoose = require('mongoose');
const NGO = require('./models/NGO');

const petNGOs = [
  {
    name: 'Animal Welfare Foundation Bangladesh',
    email: 'info@awfbd.org',
    phone: '+880-1700-000001',
    address: 'House 12, Road 5, Dhanmondi',
    city: 'Dhaka',
    isVerified: true,
    notes: 'Dedicated to rescuing and rehabilitating stray animals across Bangladesh.'
  },
  {
    name: 'People for Animal Welfare (PAW)',
    email: 'contact@pawbd.org',
    phone: '+880-1700-000002',
    address: 'Plot 15, Sector 7, Uttara',
    city: 'Dhaka',
    isVerified: true,
    notes: 'Working to reduce animal suffering and promote pet adoption.'
  },
  {
    name: 'Obhoyaronno Bangladesh',
    email: 'help@obhoyaronno.org',
    phone: '+880-1700-000003',
    address: 'Road 11, Banani',
    city: 'Dhaka',
    isVerified: true,
    notes: 'Animal rescue and rehabilitation services with veterinary care.'
  },
  {
    name: 'Dhaka Animal Welfare',
    email: 'info@dhakananimalwelfare.org',
    phone: '+880-1700-000004',
    address: 'Green Road, Farmgate',
    city: 'Dhaka',
    isVerified: true,
    notes: 'Local animal shelter providing veterinary care and adoption services.'
  },
  {
    name: 'Pet Rescue Bangladesh',
    email: 'rescue@petrescuebd.org',
    phone: '+880-1700-000005',
    address: 'House 25, Block B, Bashundhara',
    city: 'Dhaka',
    isVerified: true,
    notes: 'Specializing in emergency pet rescue and medical treatment.'
  },
  {
    name: 'Chittagong Animal Care Society',
    email: 'care@cacsbd.org',
    phone: '+880-1700-000006',
    address: 'Agrabad Commercial Area',
    city: 'Chittagong',
    isVerified: true,
    notes: 'Providing animal welfare services in Chittagong region.'
  }
];

async function seedNGOs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing NGOs (optional - remove if you want to keep existing ones)
    await NGO.deleteMany({});
    console.log('Cleared existing NGOs');

    // Insert pet-related NGOs
    const result = await NGO.insertMany(petNGOs);
    console.log(`Inserted ${result.length} pet-related NGOs`);

    console.log('NGO seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding NGOs:', error);
    process.exit(1);
  }
}

seedNGOs();
