import { Example } from "./client";

export default function Page() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="grid w-96 grid-cols-3 gap-8">
        <Example />
      </div>
    </div>
  );
}
