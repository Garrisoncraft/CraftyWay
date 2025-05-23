import { Inngest } from "inngest";
import connectDB from "./db.js";
import User from "@/models/User";
import Order from "@/models/Order.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "craftyway-next" });

//Inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk/user.created'},
    async ({event}) => {
        try {
            const {id, first_name, last_name, email_addresses, image_url} = event.data;
            const userData = {
                _id: id,
                email: email_addresses[0].email_address,
                name: first_name + ' ' + last_name,
                imageUrl: image_url 
            };
            // Save the user data to the database
            await connectDB()
            await User.create(userData)
            return { success: true };
        } catch (error) {
            console.error("Error in syncUserCreation:", error);
            throw error;
        }
    }
);

// Inngest function to update user data to database
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk/user.updated'},
    async ({event}) => {
        try {
            const {id, first_name, last_name, email_addresses, image_url} = event.data;
            const userData = {
                _id: id,
                email: email_addresses[0].email_address,
                name: first_name + ' ' + last_name,
                imageUrl: image_url 
            };
            await connectDB();
            await User.findByIdAndUpdate(id, userData);
            return { success: true };
        } catch (error) {
            console.error("Error in syncUserUpdation:", error);
            throw error;
        }
    }
);

//Inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk'
    },
    { event: 'clerk/user.deleted'},
    async ({event}) => {
        try {
            const {id} = event.data;
            await connectDB();
            await User.findByIdAndDelete(id);
            return { success: true };
        } catch (error) {
            console.error("Error in syncUserDeletion:", error);
            throw error;
        }
    }
);

// Inngest function to create user order in database

export const  createUserOrder = inngest.createFunction(
    {
        id: 'create-user-order',
        batchEvents: {
            maxSize: 5, 
            timeout: '5s'
        }        
    },
    {event: 'order/created'},

    async ({events}) => {
        const orders = events.map((event)=>{
            return{
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            }
        })

        await connectDB()
        await Order.insertMany(orders)

        return { success: true, processed: orders.length };
    }


)
