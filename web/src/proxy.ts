import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|admin|_next|favicon.ico|sitemap.xml|robots.txt|rss.xml|img|media|video).*)"],
};
