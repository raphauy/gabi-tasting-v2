import { UserButton } from "@/components/layout/user-button"
import Link from "next/link"
import { Logo } from "./logo"
import { HeaderLabel } from "./header-label"

type Props = {
  label?: string
}

export function Header({ label }: Props) {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 mx-auto justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-2xl">
            <Logo />
          </Link>
          <HeaderLabel />
        </div>
        <UserButton />
      </div>
    </header>
  )
} 

