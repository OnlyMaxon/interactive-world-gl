import { useState, useRef, useEffect } from 'react'
import { Globe, type GlobeHandle } from '@/components/Globe'
import { FilterPanel } from '@/components/FilterPanel'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ZoomControls } from '@/components/ZoomControls'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { FunnelSimple, GlobeHemisphereWest } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useIsMobile } from '@/hooks/use-mobile'

const ALL_COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 
  'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 
  'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 
  'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 
  'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 
  'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 
  'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 
  'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 
  'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Saudi Arabia', 
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 
  'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 
  'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 
  'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort()

function App() {
  const [selectedCountries, setSelectedCountries] = useKV<string[]>('selected-countries', [])
  const globeRef = useRef<GlobeHandle>(null)
  const isMobile = useIsMobile()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const countries = selectedCountries || []

  const handleZoomIn = () => {
    globeRef.current?.zoomIn()
  }

  const handleZoomOut = () => {
    globeRef.current?.zoomOut()
  }

  const handleCountryClick = (country: string) => {
    setSelectedCountries(current => {
      const currentList = current || []
      if (currentList.includes(country)) {
        return currentList.filter(c => c !== country)
      } else {
        return [...currentList, country]
      }
    })
  }

  const handleCountriesChange = (newCountries: string[]) => {
    setSelectedCountries(newCountries)
  }

  const FilterPanelContent = (
    <FilterPanel
      selectedCountries={countries}
      onCountriesChange={handleCountriesChange}
      allCountries={ALL_COUNTRIES}
    />
  )

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background transition-colors duration-300">
      <div className="absolute inset-0 flex items-center justify-center">
        <Globe
          ref={globeRef}
          selectedCountries={countries}
          onCountryClick={handleCountryClick}
          className="w-full h-full"
        />
      </div>

      <div className="absolute top-6 left-6 flex flex-col gap-4 z-10">
        <div className="flex items-center gap-3">
          <GlobeHemisphereWest size={32} weight="fill" className="text-accent" />
          <h1 className="text-2xl font-bold tracking-tight">Globe Explorer</h1>
        </div>

        {!isMobile && (
          <div className="animate-fadeIn">
            {FilterPanelContent}
          </div>
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
      </div>

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>

      {countries.length > 0 && (
        <div className="absolute bottom-6 left-6 z-10">
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-xl px-4 py-3 shadow-lg">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">Selected:</span>{' '}
              <span className="text-accent font-semibold">{countries.length}</span>{' '}
              {countries.length === 1 ? 'country' : 'countries'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App