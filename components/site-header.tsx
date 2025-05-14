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
              <PopoverContent className="text-primary space-y-4 text-sm max-w-md">
                <div className="space-y-4">
                  <div className="text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                    Note: For the best viewing experience, please use a desktop
                    browser.
                  </div>

                  <div className="space-y-2">
                    <p>
                      The tool may not work properly on tablets if the Facebook
                      app is installed.
                    </p>
                    <p>
                      Ensure you're logged into Facebook and any other platforms
                      you wish to search. Disable any ad blockers, and make sure
                      your browser allows pop-ups and multiple tabs to open.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      Browser-Specific Instructions:
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Google Chrome</p>
                        <p className="text-muted-foreground">
                          Go to: Settings &gt; Privacy and security &gt; Site
                          Settings &gt; Pop-ups and redirects
                          <br />
                          Add{" "}
                          <span className="text-primary">
                            https://www.flipscoutly.com
                          </span>{" "}
                          to the list of allowed sites.
                        </p>
                      </div>

                      <div>
                        <p className="font-medium">Firefox</p>
                        <p className="text-muted-foreground">
                          When searching, you may see a message below the URL
                          bar stating that multiple pop-ups are being blocked.
                          Click Preferences and choose to allow pop-ups for this
                          site.
                        </p>
                      </div>

                      <div>
                        <p className="font-medium">Safari</p>
                        <p className="text-muted-foreground">
                          After searching, look for an icon with two overlapping
                          windows at the end of the URL bar. Click it to open
                          blocked tabs. This will prevent blocking on future
                          visits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
