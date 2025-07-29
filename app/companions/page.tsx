
import { getCompanions } from "@/lib/actions/companion.action";
import CompanionCard from "@/components/CompanionCard";
import { subjectsColors } from "@/constants";
import Searchinput from "@/components/searchinput";
import SubjectFilter from "@/components/SubjectFilter";

interface SearchParams {
    searchParams: {
        subject?: string;
        topic?: string;
    };
}

const CompanionLibrary = async ({ searchParams }: SearchParams) => {
    const subject = searchParams.subject ?? "";
    const topic = searchParams.topic ?? "";

    const data = await getCompanions({ subject, topic });

    const companions = Array.isArray(data) ? data : [];

    console.log("Companions list:", companions);

    return (
        <main>
            <section className="flex justify-between gap-4 max-md:flex-col">
                <h1>Companion Library</h1>
                <div className="flex gap-4">
                    <Searchinput />
                    <SubjectFilter />
                </div>
            </section>

            <section className="companions-grid">
                {companions.length === 0 ? (
                    <p className="text-center mt-8 text-gray-500">No companions found.</p>
                ) : (
                    companions.map((companion) => (
                        <CompanionCard
                            key={companion.id}
                            {...companion}
                            color={subjectsColors[companion.subject] || "#000"}
                        />
                    ))
                )}
            </section>
        </main>
    );
};

export default CompanionLibrary;
