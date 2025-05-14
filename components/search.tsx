/*
 * Portions of this code are from facebook-marketplace-nationwide (https://github.com/gmoz22/facebook-marketplace-nationwide)
 * Licensed under the MIT License.
 */

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
import { InfoIcon } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ModeCarousel } from "./ModeCarousel"
import { ModeToggle } from "./ModeToggle"
import ProfitCalculator from "./ProfitCalculator"
import SubscriptionForm from "./SubscriptionForm"
import { Label } from "./ui/label"

const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer")
}

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
  // Initialize with all conditions from config
  Object.keys(siteConfig.filters.itemCondition).forEach((key) => {
    itemConditionInitialState[key] = false
  })
  const [itemCondition, setItemCondition] = useState(itemConditionInitialState)
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<
    Record<string, boolean>
  >({
    facebook: true,
    amazon: false,
    ebay: false,
    mercari: false,
  })
  const [isCollectorMode, setIsCollectorMode] = useState(false)

  const device = useDeviceDetection()
  const marketplaces = siteConfig.marketplaces
  const hasSelectedMarketplace =
    Object.values(selectedMarketplaces).some(Boolean)

  // Debug log the initial state
  useEffect(() => {
    console.log("Initial item condition state:", itemConditionInitialState)
  }, [])

  // Restore state from URL on mount
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.startsWith("#state=")) {
      try {
        const encodedState = hash.substring(7) // Remove '#state='
        const state = JSON.parse(decodeURIComponent(encodedState))

        console.log("Restoring state:", state)

        // Restore all the state
        if (state.selectedMarketplaces)
          setSelectedMarketplaces(state.selectedMarketplaces)
        if (state.itemCondition) {
          console.log("Restoring item condition:", state.itemCondition)
          // Start with a fresh state
          const restoredConditions = { ...itemConditionInitialState }
          // Copy over the conditions, checking for both key existence and boolean value
          Object.entries(state.itemCondition).forEach(([key, value]) => {
            if (typeof value === "boolean" && value === true) {
              restoredConditions[key] = true
            }
          })
          console.log("Restored conditions:", restoredConditions)
          setItemCondition(restoredConditions)
        }
        if (state.minPrice !== undefined) setMinPrice(state.minPrice)
        if (state.maxPrice !== undefined) setMaxPrice(state.maxPrice)
        if (state.searchTerm) setSearch(state.searchTerm)

        // Update URL without the state to allow for new state changes
        window.history.replaceState(null, "", window.location.pathname)

        // If there are URLs to open, handle them
        if (state.urls && state.urls.length > 0) {
          handleNextUrl(state)
        }
      } catch (e) {
        console.error("Error restoring state:", e)
      }
    }
  }, [itemConditionInitialState]) // Add itemConditionInitialState to dependencies

  const updateSearchTerm = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  const updateMinPrice = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value)
  }, [])

  const updateMaxPrice = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value)
  }, [])

  const itemConditions = [
    ["new", "New"],
    ["used", "Used"],
  ] as const

  // Get the item conditions for the currently selected marketplaces
  const getAvailableItemConditions = useCallback(() => {
    // Get the first selected marketplace
    const selectedMarketplace = Object.entries(selectedMarketplaces).find(
      ([_, isSelected]) => isSelected
    )?.[0]

    if (!selectedMarketplace) return []

    // Return all conditions
    return itemConditions
  }, [selectedMarketplaces])

  const updateConditions = useCallback(
    (itemIndex: string, isChecked: boolean) => {
      console.log("Updating condition:", itemIndex, isChecked)
      setItemCondition((prev) => {
        const updated = { ...prev }
        updated[itemIndex] = isChecked
        console.log("Updated conditions:", updated)
        return updated
      })
    },
    []
  )

  const updateMarketplace = (marketplaceId: string, checked: boolean) => {
    // If trying to uncheck and it's the last selected marketplace, prevent it
    if (!checked) {
      const selectedCount =
        Object.values(selectedMarketplaces).filter(Boolean).length
      if (selectedCount <= 1 && selectedMarketplaces[marketplaceId]) {
        return // Don't allow unchecking the last selected marketplace
      }
    }
    setSelectedMarketplaces((prev) => ({
      ...prev,
      [marketplaceId]: checked,
    }))
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
          const fbConditions = selectedConditions
            .map((condition) => {
              if (condition === "new") return "new"
              if (condition === "used")
                return ["used_like_new", "used_good", "used_fair"].join("%2C")
              return ""
            })
            .filter(Boolean)
            .join("%2C")

          if (fbConditions) {
            searchURL += `&itemCondition=${fbConditions}`
          }
          break

        case "eBay":
          const ebayConditions = selectedConditions
            .map((condition) => {
              if (condition === "new") return "1000"
              if (condition === "used") return "1500|2500|3000" // Include all used conditions
              return ""
            })
            .filter(Boolean)

          if (ebayConditions.length > 0) {
            searchURL += `&LH_ItemCondition=${ebayConditions.join("|")}`
          }
          break

        case "Amazon":
          const amazonConditions = selectedConditions
            .map((condition) => {
              if (condition === "new") return "6503240011"
              if (condition === "used") return "16907722011|6503242011" // Include both renewed and used conditions
              return ""
            })
            .filter(Boolean)

          if (amazonConditions.length > 0) {
            searchURL += `&rh=n%3A21514055011%2Cp_n_condition-type%3A${amazonConditions[0]}`
          }
          break

        case "Mercari":
          const mercariConditions = selectedConditions
            .map((condition) => {
              if (condition === "new") return "1"
              if (condition === "used") return "2-3-4" // Include all used conditions
              return ""
            })
            .filter(Boolean)

          if (mercariConditions.length > 0) {
            searchURL += `&itemConditions=${mercariConditions.join("-")}`
          }
          break
      }
    }

    return searchURL
  }

  const doSearch = useCallback(() => {
    if (searchTerm.trim() === "") return

    // Check if at least one marketplace is selected
    if (!hasSelectedMarketplace) return

    let linksHTML: any[] = []
    let urls: string[] = []

    // Handle each selected marketplace
    Object.entries(selectedMarketplaces).forEach(([id, isSelected]) => {
      if (!isSelected) return

      const marketplace = marketplaces[id as keyof typeof marketplaces]
      const searchURL = buildSearchURL(marketplace)
      console.log("Adding URL:", searchURL)

      if (device !== "Mobile") {
        urls.push(searchURL)
      }

      linksHTML.push(
        <Link
          key={id}
          className="px-2 my-0 cursor-pointer"
          href={searchURL}
          target={id}
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
    })

    setLastSearchTerm(searchTerm)
    setResultLinks(linksHTML)

    // Start the URL opening sequence if we have URLs
    if (urls.length > 0) {
      // Create initial state
      const state = {
        urls,
        selectedMarketplaces,
        itemCondition: { ...itemCondition }, // Ensure deep copy of itemCondition
        minPrice,
        maxPrice,
        searchTerm,
      }

      // Handle the first URL
      handleNextUrl(state)
    }

    ReactGA.event({
      category: "search",
      action: "search_multiple",
      label: searchTerm,
    })
    // @ts-ignore umami is defined in the global scope via the umami script
    window.umami.track("search_multiple", { searchTerm: searchTerm })
  }, [
    searchTerm,
    selectedMarketplaces,
    marketplaces,
    device,
    hasSelectedMarketplace,
    itemCondition,
    minPrice,
    maxPrice,
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

  // Function to handle opening the next URL
  const handleNextUrl = (state: any) => {
    const currentUrl = state.urls.shift()

    // Store remaining URLs and state back in hash for the next tab
    const remainingState = {
      ...state,
      urls: state.urls,
      itemCondition: { ...state.itemCondition },
    }

    // Create the state hash for our website
    const stateHash =
      "#state=" + encodeURIComponent(JSON.stringify(remainingState))

    // Open our website in a new tab with remaining state
    const baseUrl = window.location.href.split("#")[0]
    console.log("Opening new tab with state:", remainingState)
    const newWindow = window.open(baseUrl + stateHash)
    if (newWindow) {
      // If successful, redirect current page to marketplace URL
      setTimeout(() => {
        window.location.href = currentUrl
      }, 500)
    } else {
      alert("Please allow pop-ups on this site!")
    }
  }

  return (
    <div className="space-y-6 container pt-20 pb-40">
      <div className="md:flex-row flex flex-col gap-6 ">
        <div className="flex flex-col flex-1 max-w-2xl gap-2 md:gap-4">
          {device === "Mobile" && !!resultLinks.length && (
            <div className="inline-block mb-8 text-lg">
              <div className="text-primary mb-0 font-bold">
                Results for &quot;{lastSearchTerm}&quot;
              </div>
              <div className="mb-2 text-sm">Search results:</div>
              {resultLinks}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <ModeToggle
                isCollectorMode={isCollectorMode}
                onModeChange={setIsCollectorMode}
              />
            </div>
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
              <div className="flex items-center gap-2">
                <Button
                  className="min-w-40 !h-full uppercase cursor-pointer"
                  onClick={doSearch}
                  disabled={!hasSelectedMarketplace || !searchTerm.trim()}
                >
                  Search
                </Button>
              </div>
            </div>
            <div className="text-xs -mt-2 text-muted-foreground">
              <span className="font-semibold">Disclaimer:</span> This calculator
              provides rough profit estimates based on user input. Results are
              for informational purposes only and should not be considered exact
              or guaranteed. Always verify calculations independently before
              making financial decisions. calculations independently before
              making financial decisions.
            </div>
          </div>
          <div className=" bg-primary/3  rounded-xl p-6">
            <div className="mb-4 text-base font-medium">
              Select Marketplaces
            </div>
            <div className="md:grid-cols-4 grid grid-cols-2 gap-4">
              {Object.entries(marketplaces).map(([id, marketplace]) => (
                <div key={id} className="relative">
                  <Label
                    htmlFor={`marketplace_${id}`}
                    className="flex flex-col items-center text-center justify-center p-4 h-full rounded-lg border-2 border-muted bg-popover/50 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-center flex-1 mb-3">
                      <Image
                        src={`/marketplaces/${marketplace.icon}`}
                        alt={marketplace.name}
                        width={32}
                        height={32}
                        className={cn(
                          "object-contain rounded-md",
                          (marketplace.name === "Mercari" ||
                            marketplace.name === "eBay") &&
                            "scale-125"
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`marketplace_${id}`}
                        checked={selectedMarketplaces[id]}
                        onCheckedChange={(checked) =>
                          updateMarketplace(id, checked as boolean)
                        }
                        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                      />
                      <span className="text-sm font-medium">
                        {marketplace.name}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/3  rounded-xl p-6">
            <div className="mb-4 text-base font-medium">Item Condition</div>
            <div className="md:grid-cols-4 grid grid-cols-2 gap-6">
              {getAvailableItemConditions().map(([key, label]) => (
                <div key={key}>
                  <label className="flex gap-2 cursor-pointer">
                    <Checkbox
                      name="condition"
                      id={`condition_${key}`}
                      className="w-5 h-5"
                      checked={itemCondition[key]}
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

          <div className="bg-primary/3  sm:flex-row rounded-xl flex flex-col gap-6 p-6">
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
                disabled={!hasSelectedMarketplace}
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
                disabled={!hasSelectedMarketplace}
              />
            </label>
          </div>

          <ModeCarousel isCollectorMode={isCollectorMode} />
          <SubscriptionForm isCollectorMode={isCollectorMode} />
        </div>

        {!isCollectorMode && (
          <div className="flex-3">
            <ProfitCalculator />
          </div>
        )}
      </div>
    </div>
  )
}
