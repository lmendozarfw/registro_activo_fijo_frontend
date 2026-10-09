export interface ILoginRequest {
    username: string;
    password: string;
}

export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface ILoginResponse {
    accessToken?: string;
    refreshToken?: string;
    access_token?: string;
    refresh_token?: string;
}

export interface IRefreshTokenRequest {
    refreshToken: string;
}

export interface IRefreshTokenResponse {
    accessToken?: string;
    refreshToken?: string;
    access_token?: string;
    refresh_token?: string;
}

export interface IPermissionAuth {
    id: string;
    code: string;
}

export interface IUserAuth {
    id: string;
    fullName: string;
}

export interface IMeResponse {
    id: string;
    user: IUserAuth;
    permissions: IPermissionAuth[];
}
