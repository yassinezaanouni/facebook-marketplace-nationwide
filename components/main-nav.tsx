import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="md:gap-10 flex gap-6">
      <Link href="/" className="flex items-center space-x-2">
        {/*<Icons.logo className="w-6 h-6" />*/}
        <span className="inline-block font-bold">{siteConfig.name}</span>
        <h1 className="text-l md:text-2xl font-extrabold leading-tight tracking-tighter">
          <span className="text-[hsl(215,100%,60%)]">Facebook Marketplace</span>{" "}
          Nationwide Search
        </h1>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
