import { prisma } from "@/utils/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const createUser = async () => {
    const user = await currentUser();

    const foundUser = await prisma.user.findUnique({
        where: {
            clerkId: user?.id
        }
    })
    //If the user is not ound create a new user in the database
    if (!foundUser) {
        try {
            await prisma.user.create({
                data: {
                    clerkId: user?.id as string,
                    email: user?.emailAddresses[0].emailAddress as string
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    //if all this is done then send the user to the journal page
    redirect('/journal')
}

const NewUser = async () => {
    await createUser();
    return (
        <>
            <div>Loading....</div>
        </>
    )
}

export default NewUser