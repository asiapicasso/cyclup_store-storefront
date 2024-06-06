import { Metadata } from "next"

import ServiceTemplate from "@modules/service/templates"

export const metadata: Metadata = {
  title: "Service",
  description: "Explore all of our services.",
}


export default async function StorePage() {

  return (
    <ServiceTemplate
    />
  )
}
