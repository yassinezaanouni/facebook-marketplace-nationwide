"use client"

import {
  ChangeEvent,
  JSX,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import ReactGA from "react-ga4"

import { siteConfig } from "@/config/site"
import * as Defs from "@/lib/defs"
import useDeviceDetection from "@/lib/device"
import { TimedQueue } from "@/lib/timed-queue"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Label } from "./ui/label"

ReactGA.initialize(process.env.NEXT_PUBLIC_GA4_ANALYTICS_ID)

interface MarketplaceConfig {
  name: string
  icon: string
  templateURL: string
  searchParams: {
    [key: string]: string
  }
}

export default function Search() {
  const [searchTerm, setSearch] = useState("")
  const [lastSearchTerm, setLastSearchTerm] = useState("")
  const searchThrottle = parseInt(
    useSearchParams().get("throttle") || ("0" as string)
  )
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [resultLinks, setResultLinks] = useState<any[]>([])
  const itemConditionInitialState: Record<string, boolean> = {}
  Object.keys(siteConfig.filters.itemCondition).map((key) => {
    itemConditionInitialState[key] = false
  })
  const [itemCondition, setItemCondition] = useState(itemConditionInitialState)
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>("")

  const device = useDeviceDetection()
  const marketplaces = siteConfig.marketplaces

  const updateSearchTerm = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  const updateMinPrice = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value)
  }, [])
  const updateMaxPrice = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value)
  }, [])
  const updateConditions = (itemIndex: string, isChecked: boolean) => {
    const updatedListOfItems: Record<string, boolean> = itemCondition
    updatedListOfItems[itemIndex] = isChecked
    setItemCondition(updatedListOfItems)
  }

  const updateMarketplace = (value: string) => {
    setSelectedMarketplace(value)
  }

  const buildSearchURL = (marketplace: MarketplaceConfig) => {
    let searchURL = marketplace.templateURL.replace("|STRING|", searchTerm)

    // Add marketplace-specific search parameters
    if (minPrice && marketplace.searchParams.minPrice) {
      searchURL += `&${marketplace.searchParams.minPrice}=${minPrice}`
    }
    if (maxPrice && marketplace.searchParams.maxPrice) {
      searchURL += `&${marketplace.searchParams.maxPrice}=${maxPrice}`
    }

    // Add other marketplace-specific parameters
    Object.entries(marketplace.searchParams).forEach(([key, value]) => {
      if (!["minPrice", "maxPrice"].includes(key)) {
        searchURL += `&${key}=${value}`
      }
    })

    return searchURL
  }

  const doSearch = useCallback(() => {
    if (searchTerm.trim() === "") return

    // Check if a marketplace is selected
    if (!selectedMarketplace) return

    let jobQueue: TimedQueue = new TimedQueue()
    let linksHTML: any[] = []

    // Handle the selected marketplace
    const marketplace =
      marketplaces[selectedMarketplace as keyof typeof marketplaces]
    const searchURL = buildSearchURL(marketplace)

    if (device !== "Mobile") {
      if (searchThrottle) {
        let jobMinDelay = searchThrottle - searchThrottle * 0.1
        let jobMaxDelay = searchThrottle + searchThrottle * 0.1
        jobQueue.addTask({
          callback: () => {
            window.open(searchURL, selectedMarketplace)
          },
          time: Math.ceil(
            Math.random() * (jobMaxDelay - jobMinDelay) + jobMinDelay
          ),
        })
      } else {
        window.open(searchURL, selectedMarketplace)
      }
    }

    linksHTML.push(
      <Link
        key={selectedMarketplace}
        className="px-2 my-0 cursor-pointer"
        href={searchURL}
        target={selectedMarketplace}
      >
        <div
          className={cn(
            "mb-2 flex items-center gap-2",
            buttonVariants({
              size: "sm",
              variant: "outline",
            })
          )}
        >
          <Image
            src={`/marketplaces/${marketplace.icon}`}
            alt={marketplace.name}
            width={16}
            height={16}
          />
          <span>{marketplace.name}</span>
        </div>
      </Link>
    )

    setLastSearchTerm(searchTerm)
    setResultLinks(linksHTML)

    if (searchThrottle) jobQueue.start()

    ReactGA.event({
      category: "search",
      action: "search_multiple",
      label: searchTerm,
    })
    // @ts-ignore umami is defined in the global scope via the umami script
    window.umami.track("search_multiple", { searchTerm: searchTerm })
  }, [
    device,
    searchTerm,
    selectedMarketplace,
    marketplaces,
    itemCondition,
    minPrice,
    maxPrice,
    searchThrottle,
  ])

  const handleKeyPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (searchTerm && e.key === "Enter") {
        e.preventDefault()
        doSearch()
      } else {
        setSearch(searchTerm)
      }
    },
    [searchTerm, doSearch]
  )

  return (
    <>
      <div className="flex flex-col w-full">
        {device === "Mobile" && !!resultLinks.length && (
          <div className="inline-block mb-8 text-lg">
            <div className="text-primary mb-0 font-bold">
              Results for &quot;{lastSearchTerm}&quot;
            </div>
            <div className="mb-2 text-sm">Search results:</div>
            {resultLinks}
          </div>
        )}
        <div className=" flex gap-4">
          <Input
            id="search"
            className="search text-primary caret-secondary py-6 text-3xl"
            type="text"
            value={searchTerm}
            onChange={updateSearchTerm}
            onKeyDown={handleKeyPress}
            placeholder="Search for..."
            autoFocus
          />
          <Button
            className=" uppercase cursor-pointer"
            onClick={doSearch}
            disabled={!selectedMarketplace || !searchTerm.trim()}
          >
            Search
          </Button>
        </div>
        <div className=" flex flex-row flex-wrap mt-4">
          <div className="bg-primary/3 sm:mb-4 rounded-xl w-full p-6 m-1 mb-2">
            <div className="mb-4 text-base font-medium">Select Marketplace</div>
            <RadioGroup
              value={selectedMarketplace}
              onValueChange={updateMarketplace}
              className="md:grid-cols-4 grid grid-cols-2 gap-4"
            >
              {Object.entries(marketplaces).map(([id, marketplace]) => (
                <div key={id} className="relative">
                  <RadioGroupItem
                    value={id}
                    id={`marketplace_${id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`marketplace_${id}`}
                    className="flex flex-col  items-center justify-center p-4 h-full rounded-lg border-2 border-muted bg-popover/50 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <div className="mb-3">
                      <Image
                        src={`/marketplaces/${marketplace.icon}`}
                        alt={marketplace.name}
                        width={32}
                        height={32}
                        className="rounded-md"
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {marketplace.name}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="bg-primary/3 sm:mb-4 rounded-xl w-full p-6 m-1 mb-2">
            <div className="mb-4 text-base font-medium">Item Condition</div>
            <div className="md:grid-cols-4 grid grid-cols-2 gap-4">
              {Object.entries(siteConfig.filters.itemCondition).map(
                ([key, label]) => (
                  <div key={key}>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <Checkbox
                        name="condition"
                        id={`condition_${key}`}
                        className="w-5 h-5"
                        onCheckedChange={(checked) =>
                          updateConditions(key, checked as boolean)
                        }
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-primary/3 sm:flex-row rounded-xl flex flex-col w-full gap-6 p-6 m-1 mb-4">
            <label className="flex-1">
              <span className="block mb-2 text-base font-medium">
                Min. Price
              </span>
              <Input
                className="prices text-primary caret-secondary bg-popover h-10"
                id="minPrice"
                type="number"
                min="0"
                value={minPrice}
                onChange={updateMinPrice}
                placeholder="0"
              />
            </label>
            <label className="flex-1">
              <span className="block mb-2 text-base font-medium">
                Max. Price
              </span>
              <Input
                className="prices text-primary caret-secondary bg-popover h-10"
                id="maxPrice"
                type="number"
                min="0"
                value={maxPrice}
                onChange={updateMaxPrice}
                placeholder="No limit"
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
