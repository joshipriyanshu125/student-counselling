const mongoose = require('mongoose');

async function fixData() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/S-C-S');
        console.log('Connected to MongoDB');
        
        const Appointment = mongoose.connection.collection('appointments');
        
        // Find appointments missing the 'time' field
        const result = await Appointment.updateMany(
            { time: { $exists: false } },
            { $set: { time: '10:00 AM' } }
        );
        
        console.log(`Successfully updated ${result.modifiedCount} appointments with default time.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

fixData();
