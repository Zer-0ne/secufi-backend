export interface CreateUserRequest {
    email: string;
    name?: string;
    password?: string;
    user_type?: 'parent' | 'family';
    phone?: string;
    google_id?: string;
    google_email?: string;
    profile_picture?: string;
}
export interface CreateUserResponse {
    success: boolean;
    message: string;
    user?: User;
    isNewUser?: boolean;
    error?: string;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    wasInvited: boolean;
}
export interface GetUserResponse {
    success: boolean;
    message: string;
    user?: User;
    error?: string;
}
export interface User {
    id: string;
    email: string;
    name: string | null;
    user_type: string | null;
    role: string | null;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
}
//# sourceMappingURL=user.d.ts.map