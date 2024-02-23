// utils/filter.ts
import { ElectricGadget } from '../modules/ElectricGadge/ElectricGadgetModel';
export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  releaseDate?: string;
  brand?: string;
  modelNumber?: string;
  category?: string;
  operatingSystem?: string;
  connectivity?: string;
  powerSource?: string;
  features?: string[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  compatibleAccessories?: string[];
}

export const applyFilters = (
  gadgets: ElectricGadget[],
  filters: FilterOptions,
): ElectricGadget[] => {
  const filterFunctions = {
    minPrice: (gadget: ElectricGadget) =>
      !filters.minPrice || gadget.price >= filters.minPrice,
    maxPrice: (gadget: ElectricGadget) =>
      !filters.maxPrice || gadget.price <= filters.maxPrice,
    releaseDate: (gadget: ElectricGadget) =>
      !filters.releaseDate || gadget.releaseDate >= filters.releaseDate,
    brand: (gadget: ElectricGadget) =>
      !filters.brand ||
      gadget.brand.toLowerCase() === filters.brand.toLowerCase(),
    modelNumber: (gadget: ElectricGadget) =>
      !filters.modelNumber ||
      gadget.modelNumber
        .toLowerCase()
        .includes(filters.modelNumber.toLowerCase()),
    category: (gadget: ElectricGadget) =>
      !filters.category ||
      gadget.category.toLowerCase() === filters.category.toLowerCase(),
    operatingSystem: (gadget: ElectricGadget) =>
      !filters.operatingSystem ||
      gadget.operatingSystem?.toLowerCase() ===
        filters.operatingSystem.toLowerCase(),
    connectivity: (gadget: ElectricGadget) =>
      !filters.connectivity ||
      gadget.connectivity?.toLowerCase() === filters.connectivity.toLowerCase(),
    powerSource: (gadget: ElectricGadget) =>
      !filters.powerSource ||
      gadget.powerSource?.toLowerCase() === filters.powerSource.toLowerCase(),
    features: (gadget: ElectricGadget) =>
      !filters.features ||
      filters.features.every((feature) => gadget.features?.includes(feature)),
    weight: (gadget: ElectricGadget) =>
      !filters.weight || gadget.weight === filters.weight,
    dimensions: (gadget: ElectricGadget) =>
      !filters.dimensions ||
      ((filters.dimensions.length
        ? gadget.dimensions?.length === filters.dimensions.length
        : true) &&
        (filters.dimensions.width
          ? gadget.dimensions?.width === filters.dimensions.width
          : true) &&
        (filters.dimensions.height
          ? gadget.dimensions?.height === filters.dimensions.height
          : true)),
    compatibleAccessories: (gadget: ElectricGadget) =>
      !filters.compatibleAccessories ||
      filters.compatibleAccessories.every(
        (accessory) => gadget.compatibleAccessories?.includes(accessory),
      ),
  };

  return gadgets.filter((gadget) =>
    Object.values(filterFunctions).every((filterFn) => filterFn(gadget)),
  );
};
