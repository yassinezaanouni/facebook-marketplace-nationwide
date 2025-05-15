"use client"

import { useState } from "react"
import { InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ProfitCalculator() {
  const [cogs, setCogs] = useState("")
  const [amazonPrice, setAmazonPrice] = useState("")
  const [ebayPrice, setEbayPrice] = useState("")
  const [results, setResults] = useState<{
    amazon: { profit: number; roi: number }
    ebay: { profit: number; roi: number }
  } | null>(null)
  const [showValidation, setShowValidation] = useState(false)

  const calculateProfit = () => {
    const cogsNum = parseFloat(cogs)
    const amazonPriceNum = parseFloat(amazonPrice)
    const ebayPriceNum = parseFloat(ebayPrice)

    // Show validation message if COGS and at least one price isn't entered
    if (isNaN(cogsNum) || (isNaN(amazonPriceNum) && isNaN(ebayPriceNum))) {
      setShowValidation(true)
      setResults(null)
      return
    }

    setShowValidation(false)

    const amazonFeeRate = 0.15
    const ebayFeeRate = 0.13

    let results = {
      amazon: { profit: 0, roi: 0 },
      ebay: { profit: 0, roi: 0 },
    }

    // Calculate Amazon profits if price is provided
    if (!isNaN(amazonPriceNum)) {
      const amazonFees = amazonPriceNum * amazonFeeRate
      const amazonProfit = amazonPriceNum - amazonFees - cogsNum
      const amazonROI = (amazonProfit / cogsNum) * 100
      results.amazon = { profit: amazonProfit, roi: amazonROI }
    }

    // Calculate eBay profits if price is provided
    if (!isNaN(ebayPriceNum)) {
      const ebayFees = ebayPriceNum * ebayFeeRate
      const ebayProfit = ebayPriceNum - ebayFees - cogsNum
      const ebayROI = (ebayProfit / cogsNum) * 100
      results.ebay = { profit: ebayProfit, roi: ebayROI }
    }

    setResults(results)
  }

  // Reset validation message when inputs change
  const handleInputChange = (
    setter: (value: string) => void,
    value: string
  ) => {
    setShowValidation(false)
    setter(value)
  }

  return (
    <div className="bg-primary/3 text-card-foreground p-6 border border-none rounded-lg shadow-none">
      <h3 className="mb-2 text-2xl font-semibold">
        FlipScoutly Profit & ROI Calculator
      </h3>
      <div className="flex items-center gap-2 mb-6 text-muted-foreground text-xs">
        <span>Disclaimer</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="size-4 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] text-xs">
            This calculator provides rough profit estimates based on user input.
            Results are for informational purposes only and should not be
            considered exact or guaranteed. Always verify calculations
            independently before making financial decisions.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cogs" className="inline-block leading-normal">
            Total COGS (Your Cost, incl. shipping TO you):
          </Label>
          <Input
            id="cogs"
            type="number"
            step="0.01"
            value={cogs}
            onChange={(e) => handleInputChange(setCogs, e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amazon-price" className="inline-block leading-normal">
            Estimated Amazon Sale Price (incl. shipping to buyer):
          </Label>
          <Input
            id="amazon-price"
            type="number"
            step="0.01"
            value={amazonPrice}
            onChange={(e) => handleInputChange(setAmazonPrice, e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ebay-price" className="inline-block leading-normal">
            Estimated eBay Sale Price (incl. shipping to buyer):
          </Label>
          <Input
            id="ebay-price"
            type="number"
            step="0.01"
            value={ebayPrice}
            onChange={(e) => handleInputChange(setEbayPrice, e.target.value)}
            placeholder="0.00"
          />
        </div>

        <Button onClick={calculateProfit} className="w-full cursor-pointer">
          Calculate
        </Button>

        {results && (
          <div className="mt-6 space-y-4 text-sm">
            {results.amazon.profit !== 0 && (
              <div>
                <strong className="text-base">Amazon (FBM):</strong>
                <div className="mt-1">
                  Profit: ${results.amazon.profit.toFixed(2)}
                  <br />
                  ROI: {results.amazon.roi.toFixed(1)}%
                </div>
              </div>
            )}
            {results.ebay.profit !== 0 && (
              <div>
                <strong className="text-base">eBay:</strong>
                <div className="mt-1">
                  Profit: ${results.ebay.profit.toFixed(2)}
                  <br />
                  ROI: {results.ebay.roi.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        )}

        {showValidation && (
          <div className="dark:text-yellow-400 text-yellow-600">
            Please enter COGS and at least one sale price.
          </div>
        )}
      </div>
    </div>
  )
}
