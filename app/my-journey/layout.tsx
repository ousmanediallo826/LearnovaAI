// app/companions/layout.tsx
import React from 'react';

export default function MyJourneyLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return <div>{children}</div>;
}
