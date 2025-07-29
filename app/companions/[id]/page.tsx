
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { subjectsColors } from "@/constants";
import Image from "next/image";
import { getCompanion } from "@/lib/actions/companion.action";
import CompanionComponent from "@/components/CompanionComponent";

interface CompanionSessionProps {
    params: { id: string };
}

const CompanionSession = async ({ params }: CompanionSessionProps) => {
    const { id } = params;
    const companion = await getCompanion(id);
    const user = await currentUser();

    if (!user) redirect('/sign-in');
    if (!companion?.name) redirect('/companions');

    const { name, subject, duration, topic } = companion;

    const subjectKey = subject?.toLowerCase() || "";
    const bgColor = subjectsColors[subjectKey] || "#000";

    return (
        <main>
            <article className="flex rounded-border justify-between p-6 max-md:flex-col">
                <div className="flex items-center gap-2">
                    <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{ backgroundColor: bgColor }}>
                        <Image src={`/icons/${subject}.svg`} alt={subject} width={15} height={15} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-2xl">{name}</p>
                            <div className="subject-badge max-md:hidden">{subject}</div>
                        </div>
                        <p className="text-lg">{topic}</p>
                    </div>
                </div>
                <div className="items-start text-2xl max-md:hidden">{duration} minutes</div>
            </article>
            <CompanionComponent
                {...companion}
                companionId={id}
                userName={user.firstName!}
                userImage={user.imageUrl!}
            />
        </main>
    );
};

export default CompanionSession;
