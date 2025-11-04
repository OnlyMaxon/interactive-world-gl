import { Button } from '@/components/ui/button'
import { Plus, Minus, ArrowsClockwise } from '@phosphor-icons/react'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset?: () => void
}

export function ZoomControls({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="rounded-full bg-card/80 backdrop-blur-xl border-border shadow-lg hover:scale-105 transition-transform"
      >
        <Plus size={20} weight="bold" />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="rounded-full bg-card/80 backdrop-blur-xl border-border shadow-lg hover:scale-105 transition-transform"
      >
        <Minus size={20} weight="bold" />
        <span className="sr-only">Zoom out</span>
      </Button>
      {onReset && (
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="rounded-full bg-card/80 backdrop-blur-xl border-border shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowsClockwise size={20} weight="bold" />
          <span className="sr-only">Reset view</span>
        </Button>
      )}
    </div>
  )
}