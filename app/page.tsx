"use client"

import { useEffect } from "react"
import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Search from "@/components/search"

import useDeviceDetection from "../lib/device"

export default function IndexPage() {
  const device = useDeviceDetection()

  useEffect(() => {
    const scriptIubenda = document.createElement("script")
    scriptIubenda.src = "//cdn.iubenda.com/iubenda.js"
    scriptIubenda.async = true
    document.body.appendChild(scriptIubenda)
    return () => {
      document.body.removeChild(scriptIubenda)
    }
  }, [])

  return (
    <section className=" flex flex-col mt-16 text-lg">
      {/*{ device === "Mobile" && (
        <div className="w-full h-8 text-xs italic leading-8 text-center">
          This tool might not work correctly on <span className="font-bold">mobile</span> or <span className="font-bold">tablets</span>!
        </div>
      )}*/}
      <Search />
      <div className="flex px-8 pb-4 mt-10">
        <div className="w-1/3">
          <Link href={siteConfig.links.donate} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.donate className="size-5" />{" "}
              <span className="pl-2">Support</span>
              <span className="sr-only">Donate</span>
            </div>
          </Link>
        </div>
        <div className="w-1/3 text-xs italic text-center">
          All trademarks used are the property of their respective owners.{" "}
          <br className="xl:inline-block hidden" />
          Their use does not imply any affiliation nor endorsement.
          <br />
          <br />
          <a
            href="https://www.iubenda.com/privacy-policy/98350546/cookie-policy"
            className="iubenda-black iubenda-noiframe iubenda-embed"
            title="Cookie Policy "
          >
            Cookie Policy
          </a>{" "}
          <a
            href="https://www.iubenda.com/privacy-policy/98350546"
            className="iubenda-black iubenda-noiframe iubenda-embed"
            title="Privacy Policy "
          >
            Privacy Policy
          </a>
        </div>
        <div className="w-1/3 text-right">
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div
              className={buttonVariants({
                size: "sm",
                variant: "ghost",
              })}
            >
              <Icons.gitHub className="size-5" />{" "}
              <span className="pl-2">by @gmoz22</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
