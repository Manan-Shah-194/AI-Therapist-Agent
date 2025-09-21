import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 w-full">
      <div className="flex flex-col items-center gap-4 px-4 md:px-6 mx-auto max-w-screen-lg">
        <p className="text-sm text-muted-foreground text-center">
          © 2025 EmpathAI All rights reserved.
        </p>
      </div>
    </footer>
  );
}
