import Image from 'next/image'

interface GreetingProps {
  fullName: string | null
  avatarUrl: string | null
}

export function Greeting({ fullName, avatarUrl }: GreetingProps) {
  // Time-based greeting
  const hour = new Date().getHours()
  let greeting = 'Good evening'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 18) greeting = 'Good afternoon'

  const firstName = fullName?.split(' ')[0] || 'Student'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt={fullName || 'User'}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-playfair text-space-cadet">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-slate-gray">Welcome back</p>
        </div>
      </div>
    </div>
  )
}
