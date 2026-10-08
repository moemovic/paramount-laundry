export const BUSINESS = {
  name: "Paramount Laundry",
  phoneDisplay: "0703 136 5794",
  phoneHref: "tel:+2347031365794",
  email: "paramountlaundry0@gmail.com",
  addressLine1: "1 Baale Crescent, Ikola Road",
  addressLine2: "Alimosho, Lagos 102213",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Paramount+Laundry+1+Baale+Cres+Ikola+Rd+Alimosho+Lagos",
  hoursShort: "Mon – Sat, 8 AM – 7 PM",
} as const;

export const SERVICES = [
  { id: "wash", label: "Wash & Fold", desc: "Everyday clothes, towels" },
  { id: "dry", label: "Dry Cleaning", desc: "Suits, native wear, delicates" },
  { id: "iron", label: "Ironing & Pressing", desc: "Shirts, trousers, outfits" },
  { id: "bed", label: "Bedding & Household", desc: "Duvets, sheets, curtains" },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];
