import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <Loader className="animate-spin" />
    </div>
  )
}
