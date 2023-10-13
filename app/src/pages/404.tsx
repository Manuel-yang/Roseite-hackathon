import Link from "next/link";
import Base from "../templates/Base";

export default function NotFound() {
  return (
    <Base>
      <div className="p-8 text-center text-color-secondary">
        <p>404 — Not Found</p>
        <Link href="/">
          <a className="text-primary-500 mt-2 block hover:underline">
            Go back home
          </a>
        </Link>
      </div>
    </Base>
  );
}
