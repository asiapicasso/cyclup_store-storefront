import { Address } from "@medusajs/medusa"

declare module "@medusajs/medusa/dist/models/address" {
    interface Address {
        delivery_info_residency?: boolean;
        delivery_info_access?: boolean;
    }
}
