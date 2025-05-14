"use client"

import { useEffect } from "react"
import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Search from "@/components/search"
import SubscriptionForm from "@/components/SubscriptionForm"

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
      <div className="flex px-8 justify-center pb-4 mt-10">
        <div className="w-1/3 text-xs italic text-center">
          All trademarks used are the property of their respective owners.{" "}
          <br className="xl:inline-block hidden" />
          Their use does not imply any affiliation nor endorsement.
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>FlipScoutly.com</span>
            <span>•</span>
            <a
              href="mailto:j.rutger82@gmail.com"
              className="hover:text-primary transition-colors"
            >
              j.rutger82@gmail.com
            </a>
          </div>
          {/* <a
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
          </a> */}
        </div>
      </div>
    </section>
  )
}
