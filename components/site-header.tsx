import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="bg-background absolute top-0 z-40 w-full py-2 border-b">
      <div className="sm:justify-between sm:space-x-0 container flex items-center h-16 space-x-4">
        <div className="md:gap-10 flex gap-6">
          <div>
            <h1 className="sm:text-m md:text-2xl xl:text-4xl text-lg font-extrabold leading-tight tracking-tighter">
              <div className="flex items-center gap-2">
                <Icons.cart className="size-8 stroke-3 text-primary" />
                <div className="flex items-center space-x-2">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold inline-block">FlipScoutly</span>
                  </Link>
                </div>
              </div>
            </h1>
            <h4 className="md:text-md sm:text-sm text-xs font-extrabold leading-tight tracking-tighter">
              Search{" "}
              <span className="text-primary uppercase">
                Multiple Marketplaces
              </span>{" "}
              with a Single Click
            </h4>
          </div>
        </div>
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            <Popover>
              <PopoverTrigger className="">
                <Icons.help className="size-6 sm:hidden block" />
                <div className="sm:block hidden cursor-pointer">
                  <div
                    className={cn(
                      buttonVariants({
                        size: "sm",
                        variant: "outline",
                      }),
                      "dark:bg-secondary light:text-secondary"
                    )}
                  >
                    <span className="light:text-secondary">How To Use</span>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="text-primary space-y-4 text-sm">
                <p className="italic">
                  May not work on tablets if the Facebook app is installed.
                </p>
                <p className="text-lg">
                  Make sure you are logged into Facebook, that your ad/popup
                  blockers are disabled and that{" "}
                  <span className="font-semibold">
                    your browser allows opening multiple tabs
                  </span>
                  :
                </p>
                <p>
                  <span className="font-semibold">Google Chrome</span>
                  <br />
                  Go to Settings {">"} Privacy and security {">"} Content {">"}{" "}
                  Pop-ups and redirects and manually add the site
                  &quot;https://www.browsemarketplaces.com&quot; to the list of
                  sites &quot;allowed to send pop-ups and use redirects&quot;.
                </p>
                <p>
                  <span className="font-semibold">Firefox</span>
                  <br />
                  When you search in the tool it should tell you under the URL
                  bar that you are about to open X pop-up windows and you can go
                  to the preferences button to allow pop-ups for this website.
                </p>
                <p>
                  <span className="font-semibold">Safari</span>
                  <br />
                  On the tab where you searched you will see at the end of the
                  URL bar an icon with 2 windows superimposed. When you click on
                  it, the missing tabs will open up and in the future they
                  won&apos;t be blocked.
                </p>
              </PopoverContent>
            </Popover>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
