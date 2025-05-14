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

  const calculateProfit = () => {
    const cogsNum = parseFloat(cogs)
    const amazonPriceNum = parseFloat(amazonPrice)
    const ebayPriceNum = parseFloat(ebayPrice)

    if (isNaN(cogsNum) || isNaN(amazonPriceNum) || isNaN(ebayPriceNum)) {
      setResults(null)
      return
    }

    const amazonFeeRate = 0.15
    const ebayFeeRate = 0.13

    const amazonFees = amazonPriceNum * amazonFeeRate
    const ebayFees = ebayPriceNum * ebayFeeRate

    const amazonProfit = amazonPriceNum - amazonFees - cogsNum
    const ebayProfit = ebayPriceNum - ebayFees - cogsNum

    const amazonROI = (amazonProfit / cogsNum) * 100
    const ebayROI = (ebayProfit / cogsNum) * 100

    setResults({
      amazon: { profit: amazonProfit, roi: amazonROI },
      ebay: { profit: ebayProfit, roi: ebayROI },
    })
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
            onChange={(e) => setCogs(e.target.value)}
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
            onChange={(e) => setAmazonPrice(e.target.value)}
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
            onChange={(e) => setEbayPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <Button onClick={calculateProfit} className="w-full cursor-pointer">
          Calculate
        </Button>

        {results === null && !cogs && !amazonPrice && !ebayPrice ? null : (
          <div className="mt-6 space-y-4 text-sm">
            {results ? (
              <>
                <div>
                  <strong className="text-base">Amazon (FBM):</strong>
                  <div className="mt-1">
                    Profit: ${results.amazon.profit.toFixed(2)}
                    <br />
                    ROI: {results.amazon.roi.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <strong className="text-base">eBay:</strong>
                  <div className="mt-1">
                    Profit: ${results.ebay.profit.toFixed(2)}
                    <br />
                    ROI: {results.ebay.roi.toFixed(1)}%
                  </div>
                </div>
              </>
            ) : (
              <div className="dark:text-yellow-400 text-yellow-600">
                Please enter COGS and both sale prices.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
