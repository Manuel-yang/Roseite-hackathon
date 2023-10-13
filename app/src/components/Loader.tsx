import { Spinner } from "flowbite-react";

export default function Loader() {
  return (
    <div className="text-center p-4">
      <Spinner />
      <span className="pl-3 text-color-secondary">Loading...</span>
    </div>
  );
}
