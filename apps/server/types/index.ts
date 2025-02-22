export interface successfulAuthResponse {
  status: number;
  data: {
    message: string;
    accessToken: string;
    refreshToken: string;
  };
}
