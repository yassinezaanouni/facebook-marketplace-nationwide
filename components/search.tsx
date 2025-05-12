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

import ProfitCalculator from "./ProfitCalculator"
import SubscriptionForm from "./SubscriptionForm"
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
  const [selectedMarketplace, setSelectedMarketplace] =
    useState<string>("facebook")

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

  const getEbayConditionValue = (condition: string): string => {
    const conditionMap: Record<string, string> = {
      new: "1000",
      open_box: "1500",
      refurbished: "2010|2020|2030",
      used: "3000",
    }
    return conditionMap[condition] || ""
  }

  const getAmazonConditionValue = (condition: string): string => {
    const conditionMap: Record<string, string> = {
      new: "6503240011",
      renewed: "16907722011",
      used: "6503242011",
    }
    return conditionMap[condition] || ""
  }

  const buildSearchURL = (marketplace: MarketplaceConfig) => {
    let searchURL = marketplace.templateURL.replace("|STRING|", searchTerm)

    // Add marketplace-specific search parameters
    if (marketplace.name === "Facebook Marketplace") {
      if (minPrice) {
        searchURL += `&minPrice=${minPrice}`
      }
      if (maxPrice) {
        searchURL += `&maxPrice=${maxPrice}`
      }
    } else {
      if (minPrice && marketplace.searchParams.minPrice) {
        searchURL += `&${marketplace.searchParams.minPrice}=${minPrice}`
      }
      if (maxPrice && marketplace.searchParams.maxPrice) {
        searchURL += `&${marketplace.searchParams.maxPrice}=${maxPrice}`
      }
    }

    // Get selected conditions
    const selectedConditions = Object.entries(itemCondition)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key)

    // Add conditions based on marketplace
    if (selectedConditions.length > 0) {
      switch (marketplace.name) {
        case "Facebook Marketplace":
          const fbConditions = selectedConditions.filter(
            (c) =>
              siteConfig.filters.itemCondition.facebook[
                c as keyof typeof siteConfig.filters.itemCondition.facebook
              ]
          )
          if (fbConditions.length > 0) {
            searchURL += `&itemCondition=${fbConditions.join("%2C")}`
          }
          break

        case "eBay":
        case "eBay (Sold)":
          const ebayConditions = selectedConditions
            .map(getEbayConditionValue)
            .filter(Boolean)

          if (ebayConditions.length > 0) {
            searchURL += `&LH_ItemCondition=${ebayConditions.join("|")}`
          }
          break

        case "Amazon":
          const amazonConditions = selectedConditions
            .map(getAmazonConditionValue)
            .filter(Boolean)

          if (amazonConditions.length > 0) {
            searchURL += `&rh=n%3A21514055011%2Cp_n_condition-type%3A${amazonConditions[0]}`
          }
          break
      }
    }

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
    console.log(searchURL)
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
    <div className="md:flex-row container flex flex-col gap-6 pt-20 pb-40">
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
        <div className="flex gap-4">
          <Input
            id="search"
            className="search text-primary py-6 !text-xl"
            type="text"
            value={searchTerm}
            onChange={updateSearchTerm}
            onKeyDown={handleKeyPress}
            placeholder="Search for..."
            autoFocus
          />
          <div>
            <Button
              className="min-w-40 !h-full uppercase cursor-pointer"
              onClick={doSearch}
              disabled={!selectedMarketplace || !searchTerm.trim()}
            >
              Search
            </Button>
          </div>
        </div>
        <div className=" flex flex-row flex-wrap mt-4">
          <div className="bg-primary/3 sm:mb-4 rounded-xl w-full p-6 mb-2">
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
                    className="flex flex-col  items-center  text-center justify-center p-4 h-full rounded-lg border-2 border-muted bg-popover/50 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-center flex-1 mb-3">
                      <Image
                        src={`/marketplaces/${marketplace.icon}`}
                        alt={marketplace.name}
                        width={32}
                        height={32}
                        className="object-contain rounded-md"
                      />
                    </div>
                    <span className=" text-sm font-medium">
                      {marketplace.name}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="bg-primary/3 sm:mb-4 rounded-xl w-full p-6 mb-2">
            <div className="mb-4 text-base font-medium">Item Condition</div>
            <div className="md:grid-cols-4 grid grid-cols-2 gap-6">
              {selectedMarketplace &&
                Object.entries(
                  siteConfig.filters.itemCondition[
                    selectedMarketplace.replace(
                      "_sold",
                      ""
                    ) as keyof typeof siteConfig.filters.itemCondition
                  ]
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className="flex gap-2 cursor-pointer">
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
                ))}
            </div>
          </div>

          <div className="bg-primary/3 sm:mb-4 sm:flex-row rounded-xl flex flex-col w-full gap-6 p-6">
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
                disabled={selectedMarketplace !== "facebook"}
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
                disabled={selectedMarketplace !== "facebook"}
              />
            </label>
          </div>
        </div>
        <SubscriptionForm />
      </div>

      <ProfitCalculator />
    </div>
  )
}
