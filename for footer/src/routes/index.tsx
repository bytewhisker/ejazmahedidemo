import { createFileRoute } from "@tanstack/react-router";
import { MegaName } from "@/components/MegaName";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EJaz Mehedi — Oversized Display Footer" },
      {
        name: "description",
        content:
          "An editorial footer with a giant cropped serif signature that dips and springs back as your cursor sweeps across it.",
      },
      { property: "og:title", content: "EJaz Mehedi — Oversized Display Footer" },
      {
        property: "og:description",
        content:
          "Giant didone lettering bleeding off the page, reacting to pointer movement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <section className="flex flex-1 flex-col justify-center px-6 py-24 sm:px-10">
        <h1 className="max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl">
          Join the culture crafters
        </h1>
        <p className="mt-8 max-w-sm text-xs uppercase tracking-[0.14em] text-muted-foreground">
          © All rights reserved. 2026 EJaz Mehedi
        </p>
      </section>

      <footer className="border-t border-border">
        <div className="grid gap-10 px-6 py-14 sm:grid-cols-2 sm:px-10">
          <ul className="space-y-2 text-xs uppercase tracking-[0.14em] text-foreground">
            <li>hello@ejazmehedi.com</li>
            <li>work@ejazmehedi.com</li>
            <li className="pt-6 text-muted-foreground">Instagram</li>
            <li className="text-muted-foreground">LinkedIn</li>
            <li className="text-muted-foreground">Newsletter</li>
          </ul>
          <ul className="space-y-2 text-xs uppercase tracking-[0.14em]">
            <li className="font-semibold text-foreground">→ Dhaka</li>
            <li className="text-muted-foreground">Gulshan 2, Dhaka 1212</li>
            <li className="pt-6 font-semibold text-foreground">→ Paris</li>
            <li className="text-muted-foreground">
              49 Rue du Faubourg Saint Martin, 75010
            </li>
          </ul>
        </div>

        {/* Giant word, cropped by the bottom of the page */}
        <div className="overflow-hidden pb-0">
          <MegaName text="EJAZ MEHEDI" />
        </div>
      </footer>
    </main>
  );
}
