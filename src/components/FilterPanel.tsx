import { useState, useMemo, memo, useCallback, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { debounce } from '@/lib/performance'

interface FilterPanelProps {
  selectedCountries: string[]
  onCountriesChange: (countries: string[]) => void
  allCountries: string[]
}

const CountryButton = memo(({ 
  country, 
  isSelected, 
  onClick 
}: { 
  country: string
  isSelected: boolean
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-2 text-sm text-left rounded-md transition-all
      hover:bg-accent/10
      ${isSelected
        ? 'bg-accent/20 text-accent-foreground font-medium'
        : 'text-foreground'
      }
    `}
  >
    {country}
  </button>
))

CountryButton.displayName = 'CountryButton'

export const FilterPanel = memo(({ selectedCountries, onCountriesChange, allCountries }: FilterPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value), 150),
    []
  )

  useEffect(() => {
    debouncedSetQuery(searchQuery)
  }, [searchQuery, debouncedSetQuery])

  const filteredCountries = useMemo(() => {
    if (!debouncedQuery) return allCountries
    const query = debouncedQuery.toLowerCase()
    return allCountries.filter(country =>
      country.toLowerCase().includes(query)
    )
  }, [debouncedQuery, allCountries])

  const toggleCountry = useCallback((country: string) => {
    if (selectedCountries.includes(country)) {
      onCountriesChange(selectedCountries.filter(c => c !== country))
    } else {
      onCountriesChange([...selectedCountries, country])
    }
  }, [selectedCountries, onCountriesChange])

  const clearAll = useCallback(() => {
    onCountriesChange([])
    setSearchQuery('')
  }, [onCountriesChange])

  return (
    <Card className="w-80 bg-card/80 backdrop-blur-xl border-border shadow-xl">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filter Countries</h2>
          {selectedCountries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 px-2 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {selectedCountries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map(country => (
              <Badge
                key={country}
                variant="secondary"
                className="bg-accent text-accent-foreground hover:bg-accent/80"
              >
                {country}
                <button
                  onClick={() => toggleCountry(country)}
                  className="ml-1 hover:text-destructive"
                >
                  <X size={12} weight="bold" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <ScrollArea className="h-96">
          <div className="flex flex-col gap-1 pr-4">
            {filteredCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No countries found
              </p>
            ) : (
              filteredCountries.map(country => (
                <CountryButton
                  key={country}
                  country={country}
                  isSelected={selectedCountries.includes(country)}
                  onClick={() => toggleCountry(country)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
})

FilterPanel.displayName = 'FilterPanel'