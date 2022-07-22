export { default } from "next-auth/middleware";

export const config = { matcher: ["/problems/:path*", "/material/:path*"] };
