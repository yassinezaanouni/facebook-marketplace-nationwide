import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ModeToggleProps {
  isCollectorMode: boolean
  onModeChange: (value: boolean) => void
}

export function ModeToggle({ isCollectorMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="mode-toggle" className="text-sm font-medium">
        {isCollectorMode ? "Collector Mode" : "Flipping Mode"}
      </Label>
      <Switch
        id="mode-toggle"
        checked={isCollectorMode}
        onCheckedChange={onModeChange}
      />
    </div>
  )
}
