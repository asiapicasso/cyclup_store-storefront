"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { ChangeEvent, useEffect, useState } from "react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions | string) => void
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

interface Collection {
  id: string
  title: string
}

const fetchCollections = async (): Promise<Collection[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections`)
  const data = await response.json()
  return data.collections
}
const SortProducts = ({ sortBy, setQueryParams }: SortProductsProps) => {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    const getCollections = async () => {
      const collectionsData = await fetchCollections()
      setCollections(collectionsData)
    }
    getCollections()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLButtonElement>) => {
    const newSortBy = e.target.value as SortOptions
    setQueryParams("sortBy", newSortBy)
  }

  const handleCollectionChange = (e: ChangeEvent<HTMLButtonElement>) => {
    const newCollection = e.target.value
    setQueryParams("collection", newCollection)
  }

  return (
    <>
      <FilterRadioGroup
        title="Sort by"
        items={sortOptions}
        value={sortBy}
        handleChange={handleChange}
      />
      <FilterRadioGroup
        title="Collections"
        items={collections.map(collection => ({
          value: collection.id,
          label: collection.title,
        }))}
        value=""
        handleChange={handleCollectionChange}
      />
    </>
  )
}

export default SortProducts
