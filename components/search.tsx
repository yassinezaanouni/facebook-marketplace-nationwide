"use client"

import {
  ChangeEvent,
  JSX,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import ReactGA from "react-ga4"

import { siteConfig } from "@/config/site"
import * as Defs from "@/lib/defs"
import { TimedQueue } from "@/lib/timed-queue"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import "@/styles/components/select.css"

import useDeviceDetection from "@/lib/device"

ReactGA.initialize(process.env.NEXT_PUBLIC_GA4_ANALYTICS_ID)

export default function Search() {
  const [searchTerm, setSearch] = useState("")
  const [lastSearchTerm, setLastSearchTerm] = useState("")
  const searchThrottle = parseInt(
    useSearchParams().get("throttle") || ("0" as string)
  )
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState(siteConfig.filters.defaultSortBy)
  const [availability, setAvailability] = useState(
    siteConfig.filters.defaultAvailability
  )
  const [deliveryMethod, setDeliveryMethod] = useState(
    siteConfig.filters.defaultDeliveryMethod
  )
  const [daysSinceListed, setDaysSinceListed] = useState(
    siteConfig.filters.defaultDaysSinceListed
  )
  const [resultLinks, setResultLinks] = useState<any[]>([])
  const itemConditionInitialState: Record<string, boolean> = {}
  Object.keys(siteConfig.filters.itemCondition).map((key) => {
    itemConditionInitialState[key] = false
  })
  const [itemCondition, setItemCondition] = useState(itemConditionInitialState)

  const device = useDeviceDetection()

  const countriesData: Defs.Countries = siteConfig.countries
  const filterSortBy: Defs.FilterSortBy = siteConfig.filters.sortBy
  const filterItemCondition: Defs.FilterItemCondition =
    siteConfig.filters.itemCondition
  const filterAvailability: Defs.FilterAvailability =
    siteConfig.filters.availability
  const filterDeliveryMethod: Defs.FilterDeliveryMethod =
    siteConfig.filters.deliveryMethod
  const filterDaysSinceListed: Defs.FilterDaysSinceListed =
    siteConfig.filters.daysSinceListed

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

  const doSearch = useCallback(() => {
    if (searchTerm.trim() === "") return
    let citiesFb = countriesData["usa"].cities_fb
    let locale: string = countriesData["usa"].locale
    let jobQueue: TimedQueue = new TimedQueue()
    let linksHTML: any[] = []

    citiesFb.forEach((city, cityIdx) => {
      let searchURL = siteConfig.templateURL[
        locale as keyof typeof siteConfig.templateURL
      ]
        .replace("|CITY|", city)
        .replace("|STRING|", searchTerm)

      if (!!minPrice) searchURL += "&minPrice=" + minPrice
      if (!!maxPrice) searchURL += "&maxPrice=" + maxPrice

      if (sortBy !== siteConfig.filters.defaultSortBy)
        searchURL += "&sortBy=" + sortBy

      let itemConditionStatus: any[] = []
      Object.keys(itemCondition).map((itemKey) => {
        if (itemCondition[itemKey]) itemConditionStatus.push(itemKey)
      })
      if (itemConditionStatus.length)
        searchURL += "&itemCondition=" + itemConditionStatus.join(",")

      if (availability !== siteConfig.filters.defaultAvailability)
        searchURL += "&availability=" + availability

      searchURL += "&deliveryMethod=" + deliveryMethod

      if (daysSinceListed !== siteConfig.filters.defaultDaysSinceListed)
        searchURL += "&daysSinceListed=" + daysSinceListed

      if (device !== "Mobile") {
        if (searchThrottle) {
          let jobMinDelay = searchThrottle - searchThrottle * 0.1
          let jobMaxDelay = searchThrottle + searchThrottle * 0.1
          jobQueue.addTask({
            callback: () => {
              window.open(searchURL, "fbmpusasearch" + city)
            },
            time: Math.ceil(
              Math.random() * (jobMaxDelay - jobMinDelay) + jobMinDelay
            ),
          })
        } else {
          window.open(searchURL, "fbmpusasearch" + city)
        }
      }

      linksHTML.push(
        <Link
          className=" px-2 my-0 cursor-pointer"
          href={searchURL}
          target={`fbmpusasearch${city}`}
        >
          <div
            className={cn(
              "mb-2",
              buttonVariants({
                size: "sm",
                variant: "outline",
              })
            )}
          >
            {countriesData["usa"].cities[cityIdx]}
          </div>
        </Link>
      )
    })

    setLastSearchTerm(searchTerm)
    setResultLinks(linksHTML)

    if (searchThrottle) jobQueue.start()

    ReactGA.event({
      category: "search",
      action: "search_usa",
      label: searchTerm,
    })
    // @ts-ignore umami is defined in the global scope via the umami script
    window.umami.track("search_usa", { searchTerm: searchTerm })
  }, [
    device,
    searchTerm,
    countriesData,
    sortBy,
    itemCondition,
    availability,
    daysSinceListed,
    minPrice,
    maxPrice,
    deliveryMethod,
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
            <div className="mb-2 text-sm">
              {" "}
              500 {countriesData["usa"].locale} radius of:
            </div>
            {resultLinks}
          </div>
        )}
        <div className="fontSans flex flex-row">
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
            className="px-8 my-0 ml-8 uppercase cursor-pointer"
            onClick={doSearch}
          >
            Search
          </Button>
        </div>
        <div className="fontSans flex flex-row flex-wrap mt-4">
          <label className="sm:mb-4 sm:w-1/4 w-full mb-1 text-xs">
            <div className="bg-primary/5 p-2 m-1 rounded">
              Sort By &nbsp;
              <Select
                name="sort_by"
                onValueChange={setSortBy}
                defaultValue={siteConfig.filters.defaultSortBy}
              >
                <SelectTrigger className="text-primary p-0 mt-1 bg-transparent cursor-pointer">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(filterSortBy).map((sortKey) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={sortKey}
                      value={sortKey}
                    >
                      {filterSortBy[sortKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </label>
          <label className="sm:mb-4 sm:w-1/4 w-full mb-1 text-xs">
            <div className="bg-primary/5 p-2 m-1 rounded">
              Days Since Listed &nbsp;
              <Select
                name="daysSinceListed"
                onValueChange={setDaysSinceListed}
                defaultValue={siteConfig.filters.defaultDaysSinceListed}
              >
                <SelectTrigger className="text-primary focus-visible:outline-none p-0 mt-1 bg-transparent cursor-pointer">
                  <SelectValue placeholder="Days Since Listed" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(filterDaysSinceListed).map((daysKey) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={daysKey}
                      value={daysKey}
                    >
                      {filterDaysSinceListed[daysKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </label>
          <label className="sm:mb-4 sm:w-1/4 w-full mb-1 text-xs">
            <div className="bg-primary/5 p-2 m-1 rounded">
              Availability &nbsp;
              <Select
                name="availability"
                onValueChange={setAvailability}
                defaultValue={siteConfig.filters.defaultAvailability}
              >
                <SelectTrigger className="text-primary focus-visible:outline-none p-0 mt-1 bg-transparent cursor-pointer">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(filterAvailability).map((availKey) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={availKey}
                      value={availKey}
                    >
                      {filterAvailability[availKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </label>
          <label className="sm:mb-4 sm:w-1/4 w-full mb-1 text-xs">
            <div className="bg-primary/5 p-2 m-1 rounded">
              Delivery &nbsp;
              <Select
                name="delivery"
                onValueChange={setDeliveryMethod}
                defaultValue={siteConfig.filters.defaultDeliveryMethod}
              >
                <SelectTrigger className="text-primary focus-visible:outline-none p-0 mt-1 bg-transparent cursor-pointer">
                  <SelectValue placeholder="Delivery" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(filterDeliveryMethod).map((deliveryKey) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={deliveryKey}
                      value={deliveryKey}
                    >
                      {filterDeliveryMethod[deliveryKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </label>
          <span className="w-full h-0"></span>
          <div className="bg-primary/5 sm:mb-4 w-full p-2 m-1 mb-2 text-xs rounded">
            <div className="mb-3">Condition</div>
            <div className="w-full h-0"></div>
            <div className="flex flex-row w-full">
              {Object.keys(filterItemCondition).map((conditionKey: any) => (
                <div key={conditionKey} className="w-1/4">
                  <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-4 text-sm font-medium leading-none cursor-pointer">
                    <Checkbox
                      name="condition"
                      id={`condition_${conditionKey}`}
                      className="mr-2 border-solid cursor-pointer"
                      onCheckedChange={(checked) =>
                        updateConditions(conditionKey, checked as boolean)
                      }
                    />
                    <span className="">
                      {filterItemCondition[conditionKey]}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <span className="w-full h-0"></span>
          <div className="bg-primary/5 flex flex-row w-full p-2 m-1 mb-4 text-xs rounded">
            <label className="w-1/2">
              <span className="w-1/3 mr-2 text-xs">Min. Price</span>
              <Input
                className="prices text-primary caret-secondary flex-none w-2/3 h-8 p-1 mt-2 text-sm bg-transparent"
                id="minPrice"
                type="number"
                min="0"
                value={minPrice}
                onChange={updateMinPrice}
              />
            </label>
            <label className="w-1/2 ml-6">
              <span className="w-1/3 mr-2 text-xs">Max. Price</span>
              <Input
                className="prices text-primary caret-secondary flex-none w-2/3 h-8 p-1 mt-2 text-sm bg-transparent"
                id="maxPrice"
                type="number"
                min="0"
                value={maxPrice}
                onChange={updateMaxPrice}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
