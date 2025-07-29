
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { currentUser } from '@clerk/nextjs/server'
import { getRecentSession, getUserCompanions } from "@/lib/actions/companion.action"
import { redirect } from 'next/navigation'
import Image from "next/image"
import CompanionList from "@/components/CompanionList"

const Profile = async () => {
    const user = await currentUser()
    if (!user) redirect('/sign-in')

    const companions = await getUserCompanions(user.id)
    const userSession = await getRecentSession(user.id)

    return (
        <main className="max-w-5xl mx-auto p-6">
            {/* Profile Header */}
            <section className="flex flex-wrap items-center justify-between gap-6 mb-10">
                {/* Profile Info */}
                <div className="flex items-center gap-5">
                    <Image
                        src={user.imageUrl}
                        alt={user.firstName!}
                        width={110}
                        height={110}
                        className="rounded-full border shadow-sm"
                    />
                    <div>
                        <h1 className="text-3xl font-semibold">{user.firstName} {user.lastName}</h1>
                        <p className="text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 flex-wrap">
                    <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Image src="/icons/check.svg" alt="check" width={20} height={20} />
                            <p className="text-xl font-bold">{userSession.length}</p>
                        </div>
                        <span className="text-muted-foreground text-sm">Sessions Completed</span>
                    </div>

                    <div className="bg-white border rounded-2xl shadow-sm px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Image src="/icons/cap.svg" alt="cap" width={20} height={20} />
                            <p className="text-xl font-bold">{companions?.length}</p>
                        </div>
                        <span className="text-muted-foreground text-sm">Companions Created</span>
                    </div>
                </div>
            </section>

            {/* Accordion Section */}
            <Accordion type="multiple" className="space-y-4">
                <AccordionItem value="recent">
                    <AccordionTrigger className="text-xl font-semibold">Recent Sessions</AccordionTrigger>
                    <AccordionContent>
                        <CompanionList title="Recent Session" companions={userSession} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="companions">
                    <AccordionTrigger className="text-xl font-semibold">
                        My Companions ({companions.length})
                    </AccordionTrigger>
                    <AccordionContent>
                        <CompanionList title="My Companions" companions={companions} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </main>
    )
}

export default Profile
