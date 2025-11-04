import { Button } from '@/components/ui/button'
import { Plus, Minus } from '@phosphor-icons/react'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
}

export function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
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
    </div>
  )
}