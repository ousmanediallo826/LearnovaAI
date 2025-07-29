import React from "react";

interface Props {
    params: { id: string };
}

const CompanionPage = ({ params }: Props) => {
    return (
        <main>
            <h1>Companion ID: {params.id}</h1>
            {/* Your companion detail content */}
        </main>
    );
};

export default CompanionPage;
