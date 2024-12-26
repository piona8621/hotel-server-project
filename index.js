

































































































































// // // server.js (Express)
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.95gny.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    console.log('Connected to MongoDB');

    const hotelsCollection = client.db('hotelBooking').collection('hotels');
    const bookingsCollection = client.db('hotelBooking').collection('hotel-bookings');
    const reviewsCollection = client.db('hotelBooking').collection('hotel-reviews');
    // Get all rooms

    app.get('/hotels', async (req, res) => {
      const rooms = await hotelsCollection.find().toArray();
      res.send(rooms);
    });







    
    
    // Endpoint for fetching rooms with filtering
    app.get("/hotels", (req, res) => {
      const minPrice = parseInt(req.query.minPrice) || 0;
      const maxPrice = parseInt(req.query.maxPrice) || Infinity;
    
      console.log("Received Query Params:", { minPrice, maxPrice });
    
      const filteredRooms = rooms.filter(
        (room) => room.price >= minPrice && room.price <= maxPrice
      );
    
      console.log("Filtered Rooms:", filteredRooms);
    
      res.json(filteredRooms);
    });
    




    



  


    // Get top-rated rooms
    app.get('/featured-rooms', async (req, res) => {
      const topRatedRooms = await hotelsCollection.find().sort({ rating: -1 }).limit(6).toArray();
      res.json(topRatedRooms);
    });






    // get room details by id 
    app.get('/hotels/:id', async(req, res) => {
       const id  = req.params.id;
       const query = {_id : new ObjectId(id)};
       const result = await hotelsCollection.findOne(query);
       res.send(result);
    })



    

app.post('/book-room', async (req, res) => {
  const { roomId } = req.body;
  const result = await hotelsCollection.updateOne(
    { _id: new ObjectId(roomId) },
    { $set: { isBooked: true } }
  );
  res.json({ success: result.modifiedCount > 0 });
});



// Update room status
app.post('/update-room-status', async (req, res) => {
  const { roomId, isBooked } = req.body;
  const result = await hotelsCollection.updateOne(
    { _id: new ObjectId(roomId) },
    { $set: { isBooked } }
  );
  res.json({ success: result.modifiedCount > 0 });
});



// booking detailes

app.get('/hotel-bookings', async(req, res) => {
   const email =  req.query.email;
   const query = {  user_email : email   }
   const result = await bookingsCollection.find(query).toArray();
   res.send(result);

})


app.post('/hotel-bookings', async(req, res) => {
   const booking = req.body;
   const result =  await bookingsCollection.insertOne(booking);
   res.send(result);

});









app.get('/hotel-reviews/:id', async (req, res) => {
  const roomId = req.params.id;
  console.log("Requested Room ID:", roomId); // Log the room ID

  const query = { currentRoomId: roomId };
  console.log("Query:", query); // Log the query

  try {
    const result = await reviewsCollection.find(query).toArray();
    console.log("Result:", result); // Log the result
    res.send(result);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).send({ message: "Error fetching reviews" });
  }
});








// API endpoint: /reviews
app.get('/reviews', async (req, res) => {
  try {
    
    const reviews = await reviewsCollection
      .find()
      .sort({ timestamp: -1 }) // Descending order (latest first)
      .limit(10)
      .toArray();

    res.status(200).json(reviews);
  } catch (error) {
    console.error('রিভিউ লোড করতে সমস্যা:', error);
    res.status(500).json({ error: 'রিভিউ লোড করা সম্ভব হয়নি।' });
  }
});



// Backend route example:
app.get("/reviews", (req, res) => {
  const { roomId } = req.query;
  // Fetch reviews for the specified roomId
  const reviews = getReviewsByRoomId(roomId);
  res.json(reviews);
});






app.post('/hotel-reviews', async (req, res) => {
  const review = req.body;
  
  try {
    // Insert review into the database
    const result = await reviewsCollection.insertOne(review);
    
    // Check if the insertion was successful
    if (result.acknowledged) {
      // Send a success message if insertion was successful
      res.json({ message: "Review submitted successfully!" });
    } else {
      // Send an error message if insertion failed
      res.status(500).json({ message: "Failed to submit review." });
    }
  } catch (error) {
    console.error("Error inserting review:", error);
    res.status(500).json({ message: "An error occurred while submitting the review." });
  }
});







app.delete('/hotel-bookings/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const result =  await bookingsCollection.deleteOne(query);
    res.send(result);
})


app.put('/hotel-bookings/:id', async(req, res) => {
   const id = req.params.id;
   const filter = {_id : new ObjectId(id)};
   const {bookingDate} = req.body;
   const updateDate = {
      $set : {
         bookingDate : new Date(bookingDate)
      }
   }
   const result = await bookingsCollection.updateOne(filter, updateDate);
   res.send(result);
})






    // Home Route
    app.get('/', (req, res) => {
      res.send('Hotel Booking Server is Running');
    });
  } finally {
    // Ensure the client closes if the process exits
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});















































