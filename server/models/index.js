const Rider   = require('./Rider');
const Driver  = require('./Driver');
const Ride    = require('./Ride');
const Payment = require('./Payment');

// Rider → Rides
Rider.hasMany(Ride,    { foreignKey: 'rider_id' });
Ride.belongsTo(Rider,  { foreignKey: 'rider_id' });

// Driver → Rides
Driver.hasMany(Ride,   { foreignKey: 'driver_id' });
Ride.belongsTo(Driver, { foreignKey: 'driver_id' });

// Rider → Payments
Rider.hasMany(Payment,    { foreignKey: 'rider_id' });
Payment.belongsTo(Rider,  { foreignKey: 'rider_id' });

// Ride → Payments
Ride.hasMany(Payment,   { foreignKey: 'ride_id' });
Payment.belongsTo(Ride, { foreignKey: 'ride_id' });

module.exports = { Rider, Driver, Ride, Payment };
