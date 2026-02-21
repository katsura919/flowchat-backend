export interface PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
    order?: "asc" | "desc";
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        current: number;
        total: number;
        count: number;
        perPage: number;
    };
}
export interface ApiResponse<T = unknown> {
    status: "success" | "fail" | "error";
    message?: string;
    data?: T;
}
export interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CLIENT_URL: string;
}
//# sourceMappingURL=index.d.ts.map