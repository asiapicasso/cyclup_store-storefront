
import '@medusajs/medusa';

declare module '@medusajs/medusa/dist/types/common' {
    export interface AddressPayload {
        delivery_info_resideny?: boolean;
        delivery_info_access?: boolean;
    }
}