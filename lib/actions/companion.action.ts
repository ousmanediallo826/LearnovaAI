"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";

interface CreateCompanion {
    name: string;
    subject: string;
    topic: string;
    voice: string;
    style: string;
    duration: number;
}

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("companions")
        .insert([{ ...formData, author: userId }])
        .select();

    if (error || !data) throw new Error(error?.message || "Failed to create companion");
    return data[0];
};

interface GetAllCompanions {
    limit?: number;
    page?: number;
    subject?: string | string[];
    topic?: string | string[];
    userId?: string; // ✅ Made optional
}

export const getCompanions = async ({ limit = 10, page = 1, subject, topic, userId }: GetAllCompanions) => {
    const supabase = createSupabaseClient();

    let query;

    // ✅ If userId is provided, filter by session_history
    if (userId) {
        const { data: sessionData, error: sessionError } = await supabase
            .from("session_history")
            .select("companion_id")
            .eq("user_id", userId);

        if (sessionError) throw new Error(sessionError.message || "Failed to get session history");

        const companionIds = sessionData?.map((item) => item.companion_id) || [];

        if (companionIds.length === 0) return [];

        query = supabase.from("companions").select().in("id", companionIds);
    } else {
        // ✅ If no userId, return all companions
        query = supabase.from("companions").select();
    }

    if (subject && topic) {
        query = query
            .ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`);
    } else if (topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if (error) throw new Error(error?.message || "Failed to get companions");

    return companions;
};

export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("companions")
        .select()
        .eq("id", id);

    if (error || !data) throw new Error(error?.message || "Failed to get companion");
    return data[0];
};

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from("session_history")
        .insert({
            companion_id: companionId,
            user_id: userId,
        });

    if (error) throw new Error(error?.message || "Failed to add session history");

    return data;
};

export const getRecentSession = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("session_history")
        .select(`companion:companion_id (*)`)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw new Error(error?.message || "Failed to get recent sessions");
    return data?.map(({ companion }) => companion) || [];
};

export const getUserCompanions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("session_history")
        .select(`companion:companion_id (*)`)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw new Error(error?.message || "Failed to get companions");
    return data?.map(({ companion }) => companion) || [];
};

export const newCompanionPermissions = async () => {
    const supabase = createSupabaseClient();
    const { userId, has } = await auth();

    let limit = 0;

    if (has({ plan: "pro" })) {
        return true;
    } else if (has({ feature: "3_active_companions" })) {
        limit = 3;
    } else if (has({ feature: "10_active_companions" })) {
        limit = 10;
    }

    const { data, error } = await supabase
        .from("companions")
        .select("id", { count: "exact" })
        .eq("author", userId);

    if (error) throw new Error(error?.message || "Failed to add companion");

    const companionCount = data?.length;

    return companionCount <= limit;
};
