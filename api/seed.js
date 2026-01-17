const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Pharmacy = require('./models/Pharmacy');
const Medicine = require('./models/Medicine');
const Stock = require('./models/Stock');
const connectToDB = require('./utils/db');

const seedData = async () => {
    try {
        await connectToDB();
        console.log('Connected to DB for seeding...');

        // Clear existing data
        await Pharmacy.deleteMany({});
        await Medicine.deleteMany({});
        await Stock.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Create Pharmacies
        const pharmacies = await Pharmacy.insertMany([
            {
                name: 'City Health Colombo',
                location: { address: '123 Galle Rd, Colombo 03', lat: 6.9061, lng: 79.8519 },
                latitude: 6.9061,
                longitude: 79.8519,
                contactNumber: '011-2345678',
                isVerified: true
            },
            {
                name: 'Galle Road Pharmacy',
                location: { address: '456 Galle Rd, Mount Lavinia', lat: 6.8306, lng: 79.8644 },
                latitude: 6.8306,
                longitude: 79.8644,
                contactNumber: '011-9876543',
                isVerified: true
            },
            {
                name: 'Union Chemist',
                location: { address: '78 Union Place, Colombo 02', lat: 6.9189, lng: 79.8568 },
                latitude: 6.9189,
                longitude: 79.8568,
                contactNumber: '011-1122334',
                isVerified: true
            },
            {
                name: 'Kandy Road Meds',
                location: { address: '55 Kandy Rd, Kelaniya', lat: 6.9538, lng: 79.9168 },
                latitude: 6.9538,
                longitude: 79.9168,
                contactNumber: '011-5566778',
                isVerified: false
            },
            {
                name: 'Nugegoda Pharmacy',
                location: { address: '88 High Level Rd, Nugegoda', lat: 6.8732, lng: 79.8895 },
                latitude: 6.8732,
                longitude: 79.8895,
                contactNumber: '011-9988776',
                isVerified: true
            }
        ]);
        console.log(`Seeded ${pharmacies.length} pharmacies.`);

        // 2. Create Medicines
        const medicines = await Medicine.insertMany([
            { name: 'Panadol', brand: 'GSK', category: 'Tablet', description: 'Paracetamol 500mg' },
            { name: 'Amoxicillin', brand: 'Ospamox', category: 'Capsule', description: 'Antibiotic 500mg' },
            { name: 'Insulin', brand: 'Lantus', category: 'Injection', description: 'Long-acting insulin' },
            { name: 'Vitamin C', brand: 'Cebion', category: 'Tablet', description: 'Ascorbic Acid 500mg' },
            { name: 'Piriton', brand: 'GSK', category: 'Tablet', description: 'Chlorphenamine 4mg' },
            { name: 'Omeprazole', brand: 'Omez', category: 'Capsule', description: 'Gastro-resistant 20mg' },
            { name: 'Metformin', brand: 'Glucophage', category: 'Tablet', description: 'Diabetes medication 500mg' },
            { name: 'Atorvastatin', brand: 'Lipitor', category: 'Tablet', description: 'Cholesterol medication 10mg' },
            { name: 'Aspirin', brand: 'Prinish', category: 'Tablet', description: 'Pain relief 300mg' },
            { name: 'Cough Syrup', brand: 'Benadryl', category: 'Syrup', description: 'Cough relief 100ml' }
        ]);
        console.log(`Seeded ${medicines.length} medicines.`);

        // 3. Create Stock (Randomize)
        const stockEntries = [];
        for (const pharmacy of pharmacies) {
            for (const medicine of medicines) {
                // 70% chance of being in stock
                const inStock = Math.random() > 0.3;
                if (inStock) {
                    stockEntries.push({
                        pharmacyId: pharmacy._id,
                        medicineId: medicine._id,
                        inStock: true,
                        quantity: Math.floor(Math.random() * 50) + 1,
                        price: Math.floor(Math.random() * 1000) + 50
                    });
                } else {
                    // Optionally add out of stock entries too, or just leave them out
                    // The requirement says "some in stock, some out".
                    // Creating an entry with inStock: false implies we track it but it's empty.
                    stockEntries.push({
                        pharmacyId: pharmacy._id,
                        medicineId: medicine._id,
                        inStock: false,
                        quantity: 0,
                        price: Math.floor(Math.random() * 1000) + 50
                    });
                }
            }
        }

        await Stock.insertMany(stockEntries);
        console.log(`Seeded ${stockEntries.length} stock entries.`);

        console.log('Seeding completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        const fs = require('fs');
        fs.writeFileSync('seed_error.log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        process.exit(1);
    }
};

seedData();
