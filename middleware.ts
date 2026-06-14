import { NextResponse } from "next/server";

import { auth } from "./auth";

const sellerRoles = new Set(["SELLER", "ADMIN"]);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth?.user);
  const role = req.auth?.user?.role;
  const callbackUrl = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);

  if (nextUrl.pathname.startsWith("/seller")) {
    if (!isLoggedIn || !sellerRoles.has(role ?? "")) {
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl),
      );
    }
  }

  if (
    ["/cart", "/checkout", "/profile"].some((path) =>
      nextUrl.pathname.startsWith(path),
    ) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/seller/:path*", "/cart/:path*", "/checkout/:path*", "/profile/:path*"],
};
