import { Inngest } from "inngest";
import connectDB from "./db";
import User from "../models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "craftyway-next" });

//Ingest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    { event: 'clerk:/user.created'},
      async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData ={
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image_url: image_url
        }
        // Save the user data to the database
        await connectDB()
        await User.create(userData)
      }
)


// Ingest function to update user data to database
export const syncUserUpdate = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    { event: 'clerk:/user.updated'},
    async ({event}) => {
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData ={
            _id:id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image_url: image_url
        }

        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }

)

//Inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk'
    },
    { event: 'clerk:/user.deleted'},
    async ({event}) => {

        const {id} = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)