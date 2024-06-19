import { RadioGroup } from "@headlessui/react"
import { Cart, Customer } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import Radio from "@modules/common/components/radio"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  countryCode,
}: {
  customer: Omit<Customer, "password_hash"> | null
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  checked: boolean
  onChange: () => void
  countryCode: string
}) => {
  const [formData, setFormData] = useState({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || countryCode || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
    email: cart?.email || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
  })

  const [selectedResidence, setSelectedResidence] = useState<boolean | null>(null)
  const [selectedAccess, setSelectedAccess] = useState<boolean | null>(null)
  const [residenceError, setResidenceError] = useState<string | null>(null)
  const [accessError, setAccessError] = useState<string | null>(null)


  const countriesInRegion = useMemo(
    () => cart?.region.countries.map((c) => c.iso_2),
    [cart?.region]
  )

  const addressesInRegion = useMemo(
    () =>
      customer?.shipping_addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.shipping_addresses, countriesInRegion]
  )

  useEffect(() => {
    setFormData({
      "shipping_address.first_name": cart?.shipping_address?.first_name || "",
      "shipping_address.last_name": cart?.shipping_address?.last_name || "",
      "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
      "shipping_address.company": cart?.shipping_address?.company || "",
      "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
      "shipping_address.city": cart?.shipping_address?.city || "",
      "shipping_address.country_code":
        cart?.shipping_address?.country_code || "",
      "shipping_address.province": cart?.shipping_address?.province || "",
      email: cart?.email || "",
      "shipping_address.phone": cart?.shipping_address?.phone || "",
    })
  }, [cart?.shipping_address, cart?.email])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleResidenceChange = (value: string) => {
    setSelectedResidence(value === "true")
  }

  const handleAccessChange = (value: string) => {
    setSelectedAccess(value === "true")
  }


  const handleSubmit = () => {
    let hasError = false;
    if (selectedResidence === null) {
      setResidenceError("Please select a residence option.");
      hasError = true;
    } else {
      setResidenceError(null);
    }

    if (selectedAccess === null) {
      setAccessError("Please select an access option.");
      hasError = true;
    } else {
      setAccessError(null);
    }

    if (hasError) {
      return;
    }

    const data = {
      delivery_info_residency: selectedResidence ?? false,
      delivery_info_access: selectedAccess ?? false,
    };

    updateDatabase(data);
  };

  const updateDatabase = (data: { delivery_info_residency: boolean; delivery_info_access: boolean }) => {
    fetch('/update-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect addresses={customer.shipping_addresses} cart={cart} />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
        />

        <div className="col-span-2">
          <h6 className="">Décrivez-nous l'accès de l'emplacement futur de votre achat
            <span className="text-red-500 ml-1">*</span></h6> </div>
        <RadioGroup value={selectedResidence?.toString()} onChange={handleResidenceChange}>
          <div className="grid grid-cols-2 items-center justify-between text-regular cursor-pointer py-2 border rounded-rounded px-8">
            <RadioGroup.Option value="true" className="flex items-center">
              <Radio checked={selectedResidence === true} />
              <span className="ml-2">House</span>
            </RadioGroup.Option>
            <RadioGroup.Option value="false" className="flex items-center">
              <Radio checked={selectedResidence === false} />
              <span className="ml-2">Appartement</span>
            </RadioGroup.Option>
          </div>
        </RadioGroup>
        {residenceError && <p className="text-red-500 col-span-2">{residenceError}</p>}

        <RadioGroup value={selectedAccess?.toString()} onChange={handleAccessChange}>
          <div className="grid grid-cols-2 items-center justify-between text-regular cursor-pointer py-2 border rounded-rounded px-8">
            <RadioGroup.Option value="true" className="flex items-center">
              <Radio checked={selectedAccess === true} />
              <span className="ml-2">Elevator</span>
            </RadioGroup.Option>
            <RadioGroup.Option value="false" className="flex items-center">
              <Radio checked={selectedAccess === false} />
              <span className="ml-2">Stairs</span>
            </RadioGroup.Option>
          </div>
        </RadioGroup>
        {accessError && <p className="text-red-500 col-span-2">{accessError}</p>}




        <Input
          label="Address"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Company"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
        />
        <Input
          label="Postal code"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
        />
        <Input
          label="City"
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
        />
        <CountrySelect
          name="shipping_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData["shipping_address.country_code"]}
          onChange={handleChange}
          required
        />
        <Input
          label="State / Province"
          name="shipping_address.province"
          autoComplete="address-level1"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
        />
      </div>
      <div className="my-8">
        <Checkbox
          label="Billing address same as shipping address"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
        />
      </div>
    </>
  )
}

export default ShippingAddress
