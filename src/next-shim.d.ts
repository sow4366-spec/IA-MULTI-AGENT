// Type declarations for Next.js 14 App Router API routes in development workspace
declare module "next/server" {
  export class NextRequest extends Request {
    readonly nextUrl: URL;
  }

  export class NextResponse extends Response {
    static json<T = any>(body: T, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, status?: number): NextResponse;
    static rewrite(destination: string | URL): NextResponse;
    static next(init?: ResponseInit): NextResponse;
  }
}
