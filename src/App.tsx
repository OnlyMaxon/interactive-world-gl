import { useState, useRef, useMemo, useCallback } from 'react'
import { Globe, type GlobeHandle } from '@/components/Globe'
import { FilterPanel } from '@/components/FilterPanel'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ZoomControls } from '@/components/ZoomControls'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { FunnelSimple, GlobeHemisphereWest } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useIsMobile } from '@/hooks/use-mobile'
import { ALL_COUNTRIES } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [selectedCountries, setSelectedCountries] = useKV<string[]>('selected-countries', [])
  const globeRef = useRef<GlobeHandle>(null)
  const isMobile = useIsMobile()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const countries = useMemo(() => selectedCountries || [], [selectedCountries])

  const handleZoomIn = useCallback(() => {
    globeRef.current?.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    globeRef.current?.zoomOut()
  }, [])

  const handleReset = useCallback(() => {
    globeRef.current?.resetView()
  }, [])

  const handleCountryClick = useCallback((country: string) => {
    setSelectedCountries(current => {
      const currentList = current || []
      if (currentList.includes(country)) {
        return currentList.filter(c => c !== country)
      } else {
        return [...currentList, country]
      }
    })
  }, [setSelectedCountries])

  const handleCountriesChange = useCallback((newCountries: string[]) => {
    setSelectedCountries(newCountries)
  }, [setSelectedCountries])

  const FilterPanelContent = (
    <FilterPanel
      selectedCountries={countries}
      onCountriesChange={handleCountriesChange}
      allCountries={ALL_COUNTRIES}
    />
  )

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background transition-colors duration-300">
      <div className="absolute inset-0 z-0">
        <Globe
          ref={globeRef}
          selectedCountries={countries}
          onCountryClick={handleCountryClick}
          className="w-full h-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute top-6 left-6 flex flex-col gap-4 z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <GlobeHemisphereWest size={32} weight="fill" className="text-accent" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight">Globe Explorer</h1>
        </div>

        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {FilterPanelContent}
          </motion.div>
        )}

        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-lg"
              >
                <FunnelSimple size={20} weight="bold" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-96 p-0">
              <div className="p-4">
                {FilterPanelContent}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="absolute top-6 right-6 z-10"
      >
        <ThemeToggle />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="absolute bottom-6 right-6 z-10"
      >
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} />
      </motion.div>

      <AnimatePresence>
        {countries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-6 z-10"
          >
            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-xl px-4 py-3 shadow-lg">
              <p className="text-sm font-medium">
                <span className="text-muted-foreground">Selected:</span>{' '}
                <AnimatedCounter value={countries.length} className="text-accent font-semibold" />{' '}
                {countries.length === 1 ? 'country' : 'countries'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App