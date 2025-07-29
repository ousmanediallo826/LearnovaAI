import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from '@/lib/utils';
import Link from "next/link";
import Image from "next/image";

interface CompanionListProps {
    title: string;
    companions?: Companion[];
    classNames?: string;
}
const CompanionList = ({ title, companions, classNames} : CompanionsListProps) => {
    return (
        <article className={cn("companion-list", classNames)}>
            <h2 className="text-3xl font-bold">{title}</h2>
            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead className="text-lg w-2/3 ">Lessons</TableHead>
                        <TableHead className="text-lg">Subject</TableHead>
                        <TableHead className="text-lgt text-right">Duration</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companions?.map(({id, name, subject, topic, duration}) => (
                        <TableRow key={id}>
                            <TableCell>
                                <Link href={`/companions/${id}`}>
                                    <div className="flex items-center gap-2">
                                        <div className='size-[72px] flex items-center justify-center rounded-lg max-md:hidden'>
                                            <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="font-bold text-1xl">{name}</p>
                                            <p className='text-md'>{topic}</p>
                                        </div>

                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="text-sm">
                                <Link href={`/companions/${id}`}>
                                    <div className="flex flex-col gap-2">
                                        <p className="font-bold text-1xl">{subject}</p>

                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="text-sm">
                                <Link href={`/companions/${id}`}>
                                    <div className="flex w-full item-center gap-2 justify-end">
                                        <Image src="/icons/clock.svg" alt={duration} width={15} height={15} className="max-md:hidden"/>
                                        <p className="font-bold text-1xl">{duration} {" "} <span>mins</span></p>

                                    </div>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </article>
    )
}
export default CompanionList
