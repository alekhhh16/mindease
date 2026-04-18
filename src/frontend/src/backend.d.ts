import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserStats {
    badges: Array<string>;
    currentStreak: bigint;
}
export interface TransformArgs {
    context: Uint8Array;
    response: HttpResponse;
}
export type Time = bigint;
export interface JournalEntry {
    id: string;
    content: string;
    userId: string;
    timestamp: Time;
}
export interface HttpResponse {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface ChatMessage {
    content: string;
    role: string;
}
export interface HttpHeader {
    value: string;
    name: string;
}
export interface MoodEntry {
    userId: string;
    note?: string;
    emoji: string;
    timestamp: Time;
    moodScore: bigint;
}
export interface backendInterface {
    addJournalEntry(content: string): Promise<string>;
    addMoodEntry(userId: string, moodScore: bigint, emoji: string, note: string | null): Promise<void>;
    getDailyQuote(): Promise<string>;
    getJournalEntries(): Promise<Array<JournalEntry>>;
    getLatestMoodEntry(userId: string): Promise<MoodEntry | null>;
    getMoodEntries(userId: string): Promise<Array<MoodEntry>>;
    getUserStats(userId: string): Promise<UserStats>;
    sendChatMessage(messages: Array<ChatMessage>, latestMood: string | null): Promise<string>;
    transformResponse(args: TransformArgs): Promise<HttpResponse>;
}
