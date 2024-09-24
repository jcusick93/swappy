export const componentMap = [
  {
    name: "Button",
    // The parent of key of the component, regardless of the variant
    // e.g. node.mainComponent.parent.key
    oldParentKey: "db7764b6b623f78d703a479fff35a7d622cdcd8e",
    // The new component that is imported and swapped in, this MUST be specific to the variant you want!
    // e.g. node.mainComponent.key
    variants: [
      {
        name: "Large, Primary",
        keywords: ["Type=Primary", "Size=L"],
        newComponentKey: "0fc07f90ef38e7f940f815db1e3aeb1be45a6a77",
      },
      {
        name: "Large, Secondary",
        keywords: ["Type=Secondary", "Size=L"],
        newComponentKey: "fa89286f8b494dc94e5148e599bd12eaa3faf435",
      },
    ],
  },
];
