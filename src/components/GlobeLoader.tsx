import { Skeleton } from '@/components/ui/skeleton'

export function GlobeLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-96 h-96 rounded-full" />
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-48 h-4" />
          <Skeleton className="w-32 h-3" />
        </div>
      </div>
    </div>
  )
}
