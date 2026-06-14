// app/admin/[secret]/login/page.tsx
import LoginForm from "./LoginForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ secret: string }>;
}

export default async function AdminLoginPage({ params }: Props) {
  const { secret } = await params;

  // proxy.ts already blocks wrong slugs, but this is a fallback for
  // any direct SSR invocation that bypasses the proxy layer.
  if (secret !== process.env.ADMIN_SECRET_PATH) {
    notFound();
  }

  return <LoginForm secret={secret} />;
}