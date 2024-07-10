import { Cart, Customer } from "@medusajs/medusa";
import { Container, Label, RadioGroup } from "@medusajs/ui";
import Checkbox from "@modules/common/components/checkbox";
import Input from "@modules/common/components/input";
import { useEffect, useMemo, useState } from "react";
import AddressSelect from "../address-select";
import CountrySelect from "../country-select";

type FormData = {
  "shipping_address.first_name": string;
  "shipping_address.last_name": string;
  "shipping_address.delivery_info_residency": boolean;
  "shipping_address.delivery_info_access": boolean;
  "shipping_address.address_1": string;
  "shipping_address.company": string;
  "shipping_address.postal_code": string;
  "shipping_address.city": string;
  "shipping_address.country_code": string;
  "shipping_address.province": string;
  email: string;
  "shipping_address.phone": string;
};

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  countryCode, //warning on production
}: {
  customer: Omit<Customer, "password_hash"> | null;
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null;
  checked: boolean;
  onChange: () => void;
  countryCode: string;
}) => {
  const [formData, setFormData] = useState<FormData>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.delivery_info_residency": cart?.shipping_address?.delivery_info_residency || true,
    "shipping_address.delivery_info_access": cart?.shipping_address?.delivery_info_access || false,
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code":
      cart?.shipping_address?.country_code || countryCode || "",
    "shipping_address.province": cart?.shipping_address?.province || "",
    email: cart?.email || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
  });

  const [residenceError, setResidenceError] = useState<string | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  const countriesInRegion = useMemo(
    () => cart?.region.countries.map((c) => c.iso_2),
    [cart?.region]
  );

  const addressesInRegion = useMemo(
    () =>
      customer?.shipping_addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code)
      ),
    [customer?.shipping_addresses, countriesInRegion]
  );

  useEffect(() => {
    setFormData({
      "shipping_address.first_name": cart?.shipping_address?.first_name || "",
      "shipping_address.last_name": cart?.shipping_address?.last_name || "",
      "shipping_address.delivery_info_residency": cart?.shipping_address?.delivery_info_residency || true,
      "shipping_address.delivery_info_access": cart?.shipping_address?.delivery_info_access || false,
      "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
      "shipping_address.company": cart?.shipping_address?.company || "",
      "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
      "shipping_address.city": cart?.shipping_address?.city || "",
      "shipping_address.country_code":
        cart?.shipping_address?.country_code || countryCode || "",
      "shipping_address.province": cart?.shipping_address?.province || "",
      email: cart?.email || "",
      "shipping_address.phone": cart?.shipping_address?.phone || "",
    });
  }, [cart?.shipping_address, cart?.email]);

  /* const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  }; */

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;
    setFormData({ ...formData, [name]: newValue });
  };


  /* const handleSubmit = () => {
    let hasError = false;
    const addressId = cart?.shipping_address?.id;

    if (!addressId) {
      console.error("Address ID is undefined");
      return;
    }

    if (formData["shipping_address.delivery_info_residency"] === null) {
      setResidenceError("Please select a residence option.");
      hasError = true;
    } else {
      setResidenceError(null);
    }

    if (formData["shipping_address.delivery_info_access"] === null) {
      setAccessError("Please select an access option.");
      hasError = true;
    } else {
      setAccessError(null);
    }

    if (hasError) {
      return;
    }

    const data = {
      ...formData,
      delivery_info_residency: formData["shipping_address.delivery_info_residency"],
      delivery_info_access: formData["shipping_address.delivery_info_access"],
    };

    updateDatabase(data);
  }; */

  const handleSubmit = (e: any) => {
    e.preventDefault();

    fetch('/api/update-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  };

  const updateDatabase = (data: any) => {
    fetch('/api/update-address', {
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
          <h6>Describe the access to the future location of your current purchase
            <span className="text-red-500 ml-1">*</span>
            {/* checkout shipping address form */}
          </h6>
        </div>

        <RadioGroup name="shipping_address.delivery_info_residency" onChange={handleChange}>
          <div className="grid grid-cols-2 items-center justify-between text-regular cursor-pointer py-2 border rounded-rounded px-8">
            <div className="flex items-center gap-x-3">
              <RadioGroup.Item value="true" className="flex items-center" id="radio_house_true" />
              <Label htmlFor="radio_house_true" className="ml-2" /* weight="plus" */>House</Label>
            </div>
            <div className="flex items-center gap-x-3">
              <RadioGroup.Item value="false" className="flex items-center" id="radio_house_false" />
              <Label htmlFor="radio_house_false" className="ml-2" /* weight="plus" */>Apartment</Label>
            </div> </div>
        </RadioGroup >
        {residenceError && <p className="text-red-500 col-span-2">{residenceError}</p>
        }

        <RadioGroup name="shipping_address.delivery_info_access" onChange={handleChange}>
          <div className="grid grid-cols-2 items-center justify-between text-regular cursor-pointer py-2 border rounded-rounded px-8">
            <div className="flex items-center gap-x-3">
              <RadioGroup.Item value="true" className="flex items-center" id="radio_elevator_true" />
              <Label htmlFor="radio_elevator_true" className="ml-2">Elevator</Label>
            </div>
            <div className="flex items-center gap-x-3">
              <RadioGroup.Item value="false" className="flex items-center" id="radio_elevator_false" />
              <Label htmlFor="radio_elevator_false" className="ml-2">Stairs</Label>
            </div>
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
      </div >
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
  );
};

export default ShippingAddress;
