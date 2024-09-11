import Link from "next/link";

export default function NoMachedPage() {
  return (
    <div className="no-page">
      <h1>404</h1>
      <p>This page could not be found.</p>
      <Link href="/">
        <a>Go to home</a>
      </Link>
    </div>
  );
}
