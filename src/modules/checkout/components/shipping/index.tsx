"use client"

import { RadioGroup } from "@headlessui/react"
import { formatAmount } from "@lib/util/prices"
import { CheckCircleSolid } from "@medusajs/icons"
import { Cart } from "@medusajs/medusa"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import { Alert } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Radio from "@modules/common/components/radio"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ShippingProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const Shipping: React.FC<ShippingProps> = ({ cart }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /* const [selectedResidence, setSelectedResidence] = useState<string | null>(null)
  const [selectedAccess, setSelectedAccess] = useState<string | null>(null)
  const [residenceError, setResidenceError] = useState<string | null>(null)
  const [accessError, setAccessError] = useState<string | null>(null) */

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {/*
    let hasError = false
    if (!selectedResidence) {
      setResidenceError("Veuillez sélectionner une option de résidence.")
      hasError = true
    } else {
      setResidenceError(null)
    }

    if (!selectedAccess) {
      setAccessError("Veuillez sélectionner une option d'accès.")
      hasError = true
    } else {
      setAccessError(null)
    }

    if (hasError) {
      return
    }*/

    setIsLoading(true)
    router.push(pathname + "?step=payment", { scroll: false })
  }

  useEffect(() => {
    setIsLoading(false)
    setError(null)
  }, [isOpen])

  function handleChange(value: string): void {
    throw new Error("Function not implemented.")
  }

  /*  function handleChange(value: string): void {
     throw new Error("Function not implemented.")
   } */

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods.length === 0,
            }
          )}
        >
          Delivery
          {!isOpen && cart.shipping_methods.length > 0 && <CheckCircleSolid />}
        </Heading>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <Text>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Edit
              </button>
            </Text>
          )}
      </div>
      {isOpen ? (
        <div>
          <div className="pb-8">
            <RadioGroup
              value={cart.shipping_methods[0]?.shipping_option_id}
              onChange={(value: string) => handleChange(value)}
            >
              {cart.shipping_methods ? (
                cart.shipping_methods.map((option) => {
                  return (
                    <RadioGroup.Option
                      key={option.id}
                      value={option.id}
                      className={clx(
                        "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                        {
                          "border-ui-border-interactive":
                            option.id ===
                            cart.shipping_methods[0]?.shipping_option_id,
                        }
                      )}
                    >
                      <div className="flex items-center gap-x-4">
                        <Radio
                          checked={
                            option.id ===
                            cart.shipping_methods[0]?.shipping_option_id
                          }
                        />
                        <span className="text-base-regular">{option.id}</span> {/* todo verify on id, name */}
                      </div>
                      <span className="justify-self-end text-ui-fg-base">
                        {formatAmount({
                          amount: option.price!, //todo verify on price, amont
                          region: cart?.region,
                          includeTaxes: false,
                        })}
                      </span>
                    </RadioGroup.Option>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-8 text-ui-fg-base">
                  <Spinner />
                </div>
              )}
            </RadioGroup>

            {/* <h3 className="text-lg font-medium mt-8 mb-4">Décrivez-nous l'accès de l'emplacement futur de votre achat</h3>

            <RadioGroup value={selectedResidence} onChange={setSelectedResidence}>
              <div className="grid grid-cols-2 items-center justify-between text-medium-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2">
                <RadioGroup.Option value="maison" className="flex items-center ">
                  <Radio checked={selectedResidence === 'maison'} />
                  <span className="ml-2">Maison</span>
                </RadioGroup.Option>
                <RadioGroup.Option value="appartement" className="flex items-center">
                  <Radio checked={selectedResidence === 'appartement'} />
                  <span className="ml-2">Appartement</span>
                </RadioGroup.Option>
              </div>
            </RadioGroup>

            {residenceError && <p className="text-red-500">{residenceError}</p>}

            <RadioGroup value={selectedAccess} onChange={setSelectedAccess}>
              <div className="grid grid-cols-2 items-center justify-between text-medium-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2">
                <RadioGroup.Option value="ascenseur" className="flex items-center">
                  <Radio checked={selectedAccess === 'ascenseur'} />
                  <span className="ml-2">Ascenseur</span>
                </RadioGroup.Option>
                <RadioGroup.Option value="escalier" className="flex items-center">
                  <Radio checked={selectedAccess === 'escalier'} />
                  <span className="ml-2">Escalier</span>
                </RadioGroup.Option>
              </div>
            </RadioGroup>

            {accessError && <p className="text-red-500">{accessError}</p>} */}

            <Alert variant="info">
              Les frais de livraisons varient en fonction de la valeur de l&apos;objet et de l&apos;accès au lieu.
            </Alert>
          </div>

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Continue to payment
          </Button>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_methods.length > 0 && (
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Method
                </Text>
                <Text className="txt-medium text-ui-fg-subtle">
                  {cart.shipping_methods[0].shipping_option.name} (
                  {formatAmount({
                    amount: cart.shipping_methods[0].price,
                    region: cart.region,
                    includeTaxes: false,
                  })
                    .replace(/,/g, "")
                    .replace(/\./g, ",")}
                  )
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Shipping
