"use client";

import { usePathname, useRouter } from "next/navigation";
import PillNav, { PillNavItem } from "@/components/PillNav";

export function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: PillNavItem[] = [
    { label: "ATS Engine", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "/blog" },
    { label: "Sign In", href: "/login" },
    { label: "Create Resume", href: "/login" },
  ];

  const handleItemClick = (item: PillNavItem, _index: number, event: React.MouseEvent<HTMLElement>) => {
    if (item.href === "/login" || item.label === "Create Resume" || item.label === "Sign In") {
      event.preventDefault();
      router.push("/login");
      return;
    }

    if (item.href === "/login" || item.label === "Sign In") {
      event.preventDefault();
      router.push("/login");
      return;
    }

    if (item.href?.startsWith("#")) {
      event.preventDefault();

      if (pathname !== "/") {
        router.push(`/${item.href}`);
        return;
      }

      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <PillNav
      logo="/favicon-16x16.png"
      logoAlt="ResuSync"
      logoHref="/"
      items={navItems}
      size="md"
      theme="light"
      layout="split"
      hoverEffect="glide"
      highlightColor="#3861fb"
      highlightTextColor="#ffffff"
      onItemClick={handleItemClick}
      className="w-full md:w-auto"
    />
  );
}
