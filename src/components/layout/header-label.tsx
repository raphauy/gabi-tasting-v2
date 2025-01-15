"use client"

import { useWineryName, useTastingName } from "@/hooks/use-names"

export function HeaderLabel() {
  const tastingName = useTastingName()
  const wineryName = useWineryName()

  return (
    <div className="flex items-center gap-2 font-medium">
      {
        tastingName && !wineryName && (
          <div className="flex items-center gap-2">
            {getSVGSlash()}
            <p>{tastingName}</p>
          </div>
        )
      }
      {
        wineryName && (
          <div className="flex items-center gap-2">
            {getSVGSlash()}
            <p>{wineryName}</p>
          </div>
        )
      }
    </div>
  )
}

function getSVGSlash() {
  return (
    <svg
      width="24"
      height="40"
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-500 h-10"
    >
      <path
        d="M14 4L10 28"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}