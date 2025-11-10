export function ProfileCardSkeleton() {
  return (
    <div className='bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm animate-pulse'>
      <div className='flex gap-4 items-start'>
        {/* Profile Picture Skeleton */}
        <div className='shrink-0'>
          <div className='w-16 h-16 rounded-full bg-gray-700/50' />
        </div>

        {/* Profile Content Skeleton */}
        <div className='flex-1 min-w-0'>
          {/* Header Skeleton */}
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1 min-w-0 space-y-2'>
              {/* Name */}
              <div className='h-6 bg-gray-700/50 rounded w-48' />
              {/* Job Title */}
              <div className='h-4 bg-gray-700/50 rounded w-36' />
              {/* Seniority & Location */}
              <div className='flex gap-2 mt-1'>
                <div className='h-3 bg-gray-700/50 rounded w-20' />
                <div className='h-3 bg-gray-700/50 rounded w-3' />
                <div className='h-3 bg-gray-700/50 rounded w-24' />
              </div>
            </div>
            {/* Match Score Skeleton */}
            <div className='text-right shrink-0'>
              <div className='h-8 w-12 bg-gray-700/50 rounded' />
              <div className='h-3 w-12 bg-gray-700/50 rounded mt-1' />
            </div>
          </div>

          {/* Skills Preview Skeleton */}
          <div className='flex flex-wrap gap-1.5 mt-3'>
            <div className='h-6 w-20 bg-gray-700/50 rounded-full' />
            <div className='h-6 w-24 bg-gray-700/50 rounded-full' />
            <div className='h-6 w-16 bg-gray-700/50 rounded-full' />
            <div className='h-6 w-12 bg-gray-700/50 rounded-full' />
          </div>

          {/* Bottom Section Skeleton */}
          <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50'>
            <div className='h-5 w-24 bg-gray-700/50 rounded' />
            <div className='h-4 w-16 bg-gray-700/50 rounded' />
          </div>
        </div>
      </div>
    </div>
  );
}
