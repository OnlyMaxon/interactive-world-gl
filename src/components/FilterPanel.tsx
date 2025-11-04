import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlass, X } from '@phosphor-icons/react'

interface FilterPanelProps {
  selectedCountries: string[]
  onCountriesChange: (countries: string[]) => void
  allCountries: string[]
}

export function FilterPanel({ selectedCountries, onCountriesChange, allCountries }: FilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return allCountries
    return allCountries.filter(country =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, allCountries])

  const toggleCountry = (country: string) => {
    if (selectedCountries.includes(country)) {
      onCountriesChange(selectedCountries.filter(c => c !== country))
    } else {
      onCountriesChange([...selectedCountries, country])
    }
  }

  const clearAll = () => {
    onCountriesChange([])
    setSearchQuery('')
  }

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
                <button
                  key={country}
                  onClick={() => toggleCountry(country)}
                  className={`
                    px-3 py-2 text-sm text-left rounded-md transition-all
                    hover:bg-accent/10
                    ${selectedCountries.includes(country)
                      ? 'bg-accent/20 text-accent-foreground font-medium'
                      : 'text-foreground'
                    }
                  `}
                >
                  {country}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  )
}