// groupName: The name you want to call the group, this is used to sort components and is not dependent on the component name in Figma
// oldParentKey:The parent of key of the component, regardless of the variant.e.g. node.mainComponent.parent.key
// newComponentKey: The key of the the default variant. We use the setProperties method to swap in the new component node.mainComponent.key if not in a componentSet and node.mainComponent.parent.key if in a componentSet. You can get this by using the Scripter plugin in Figma and running the following code:

// console.clear();

// const selection = figma.currentPage.selection;

// // Ensure something is selected
// if (selection.length > 0) {
//   const selectedNode = selection[0];

//   // Check if the selected node is an InstanceNode
//   if (selectedNode.type === "INSTANCE") {
//     const instanceNode = selectedNode as InstanceNode; // Type assertion

//     let parentKey;

//     // Check if the main component has a parent
//     if (instanceNode.mainComponent && instanceNode.mainComponent.parent) {
//       parentKey = instanceNode.mainComponent.parent.key; // Get the parent's key
//     } else {
//       parentKey = instanceNode.mainComponent.key; // Fallback to the component's key
//     }

//     // Log the entire payload of the selected object to the console
//     console.log(`${instanceNode.name} - parent key: ${parentKey}`);
//   } else {
//     console.warn("Selected node is not an instance.");
//   }
// } else {
//   console.warn("No selection made.");

export const componentMap = [
  {
    groupName: "Alert Modal",
    oldParentKey: "7212cad51a951f4afd31c0334c3d74a426cf1ebd",
    newComponentKey: "0cfe893b6acc62a1807f5bafe8773b4fc709e60d",
  },
  {
    groupName: "Avatar",
    oldParentKey: "8cc675cd9eddc4c77760ac66a02898b4cd16ec4c",
    newComponentKey: "563cf9bce5d787af084d25dfd276ed2d01352bb4",
  },
  {
    groupName: "Badge",
    oldParentKey: "b3d2066ac44fdb1826df8122b7d02c357b3b5086",
    newComponentKey: "b2eb0e29e58a331f0853885e8c0b6c894cf6a448",
  },
  {
    groupName: "Banner Alert",
    oldParentKey: "01f2364dcb6da08c293486c117596d299ecd93a9",
    newComponentKey: "0c70bf6214271bb12d3573596123cbb0e5a6198b",
  },
  {
    groupName: "Button Group",
    oldParentKey: "060df2468891d0bade4669f57affbf43eec41e69",
    newComponentKey: "3564264c80c78a57babe1d6a64a66aa0a51807bc",
  },
  {
    groupName: "Button",
    oldParentKey: "db7764b6b623f78d703a479fff35a7d622cdcd8e",
    newComponentKey: "09a1beeac1f5dcec7e138455d43a6d6c2dfaecea",
  },
  {
    groupName: "Button Annotated",
    oldParentKey: "5b06e43b7d765663df27a03cbf4a4006dcaa0539",
    newComponentKey: "ca79ebe2bff1fe091588e77d462ffbd780e7da04",
  },
  {
    groupName: "Card",
    oldParentKey: "b67af06930489f4edb3e3c66d994b680e220739e",
    newComponentKey: "2bab3df5b6967e731c5d58518e49145f1d3649f9",
  },
  {
    groupName: "Checkbox",
    oldParentKey: "17f09fe65ffe566f178057eb32b745a119738f12",
    newComponentKey: "4e8c6c1964813f0f99cb0b5a3262c092bb46212e",
  },
  {
    groupName: "Collapsible",
    oldParentKey: "491d20a25a315d35ed73fb8e043735844cc33b4e",
    newComponentKey: "ab433e953cf258490d843be17440597f954e3115",
  },
  {
    groupName: "Copy Field",
    oldParentKey: "5a7bcab84cbb469ad9b36ec3bd4b119a80d8d33f",
    newComponentKey: "ad55a7fcd9426f11976584211ba44c3e5a18c816",
  },
  {
    groupName: "Copy Field (Multi-line)",
    oldParentKey: "1359a02bb517e725fa7daf8a05d5b21e2b3ae5fd",
    newComponentKey: "8715560b5ec4895fc4a1970f32041d5ce550e6c4",
  },
  {
    groupName: "Drawer",
    oldParentKey: "25bf1b6d5d5cb1da053252387dbb982679bfa8c5",
    newComponentKey: "80844bfc4b124631df6fb66982108923fa09da6d",
  },
  {
    groupName: "Empty State",
    oldParentKey: "9ef0dd79356c5932c5190091d28f47209ee3a3fd",
    newComponentKey: "981fc93b7aa93f61d21fe726743460cdb8d2917d",
  },
  {
    groupName: "Footer",
    oldParentKey: "685ab3ba2b693e2fea5123a8e9079509a22cd976",
    newComponentKey: "acdc0020b27b23372428c81ad8fd7dfab2730ec2",
  },
  {
    groupName: "Helper Text",
    oldParentKey: "5b6be2e7e5c94fda0edc840f84dddffd0dffe4a9",
    newComponentKey: "8b9c793a1bceae7a1088c8ecb5f077f9261c5b40",
  },
  {
    groupName: "Icon Button",
    oldParentKey: "4d166df8406213c285d116ed0cb844527eb7c5d0",
    newComponentKey: "f009ec0ac391589fe152205661ad2d3274987fbf",
  },
  {
    groupName: "Icon",
    oldParentKey: "4fd8e9665621b32fc11cef3a43cc4c08e1f93c31",
    newComponentKey: "d06460ab9fd1348f1e8a43b1a65b2a071fcd8a43",
  },
  {
    groupName: "Icon Circle",
    oldParentKey: "3e1add9bfbfb18aca7249aeace94fb5ae63585c3",
    newComponentKey: "a78822a065dc9439401bf8529325548a1014ec22",
  },
  {
    groupName: "Icon Info",
    oldParentKey: "4298160632ffbfd56eb3e091e5417c9d486565ad",
    newComponentKey: "6d047a893f28228d8bcfb952f7f9f67a9c54dd15",
  },
  {
    groupName: "Inline Input",
    oldParentKey: "9c8dcea1305615c449d54953f67d4a0d711ce160",
    newComponentKey: "8276599c3dd88c7b11211aaa8cf91b08cb4d668b",
  },
  {
    groupName: "Link (External)",
    oldParentKey: "d971ed3e8654b4aa4c93f4e1792a5d27e7d8db92",
    newComponentKey: "aaec25f6f4c375ed2a19fe359a59d017203dc3d9",
  },
  {
    groupName: "Link (Internal)",
    oldParentKey: "e4931ee589221fa2007c039f910dd44280f98b96",
    newComponentKey: "dd7ee8954b133e5a48ea6366669b21e2f5395ac3",
  },
  {
    groupName: "Field Label",
    oldParentKey: "eb093f8eda2ef8ea2a11831cbcb5d217f9608f4c",
    newComponentKey: "95bbf803157c2c3b100bb03cddd9b1a75ba2e5de",
  },
  {
    groupName: "Menu",
    oldParentKey: "8cd5c1129fefe17ff465f9aa6213c15d45729a97",
    newComponentKey: "d7507ad4a16e5f6e8539f1cc1a3a55549950fe57",
  },
  {
    groupName: "Modal",
    oldParentKey: "6aa0eba7a8829ed58e4a85a6c7a5581dacf0ef5f",
    newComponentKey: "924b3e374a07ea54c63d9d08165ac15b311e7454",
  },
  {
    groupName: "Number Input",
    oldParentKey: "a95f0df5a9a98b174dc323ecd506c253b1eea64b",
    newComponentKey: "c9163def47c46174008e1bf57c59e6e9e3272338",
  },
  {
    groupName: "Pagination",
    oldParentKey: "731681f065b5bcbfc78caa6963404da2377643c3",
    newComponentKey: "21cc2f6ba0bd79d0692d7dcb3f3af25ff0b4598f",
  },
  {
    groupName: "Pagination Footer",
    oldParentKey: "1052be78d752f5f42b7ff536c370dd3d4795659e",
    newComponentKey: "6f4d3279a6b15b103fa5fcd52af5212e2c399a49",
  },
  {
    groupName: "Popover",
    oldParentKey: "d17cdf6ed88a1a7a0a4212653175aac3004c249f",
    newComponentKey: "247a07c37451685fbf8ca26ef139d0a96482d630",
  },
  {
    groupName: "Progress Bar",
    oldParentKey: "130030f0570ad33bebb0a5a76b06d79befc1cd55",
    newComponentKey: "79e3bd14fec1e9b9c83ac8aa1dc5d3cad894fc2e",
  },
  {
    groupName: "Progress Tracker",
    oldParentKey: "774ea720ddd6c34387f9844ec53b9712456e28ad",
    newComponentKey: "5f145e51adb2ecd7ea10a3a0379d3dab7ef51458",
  },
  {
    groupName: "Radio Button Group",
    oldParentKey: "bc7b85b9606601a07346a61f9681531fa6dc2ba5",
    newComponentKey: "0b174dfb011df00dc554ae7722be08f76e866e74",
  },
  {
    groupName: "Search Input",
    oldParentKey: "f10330bfcf6dd02448464e6431d7f84225359424",
    newComponentKey: "b3a38539710e2c8b41c68e672ef476dd51e3f636",
  },
  {
    groupName: "Select",
    oldParentKey: "243fe4a20e8fff323013ed2cb7a0192d8223cb96",
    newComponentKey: "ed72b17490172fdc29a65073b0b1c4ec370413a4",
  },
  {
    groupName: "Slider",
    oldParentKey: "e4dc403cc33e6fde8b47cef7e58a860727392924",
    newComponentKey: "8489455f3c89b6786f9ddd65a3b07a15e49899ed",
  },
  {
    groupName: "Spinner",
    oldParentKey: "00c939dc43acfc0088b8de4fad66eb0576563147",
    newComponentKey: "8489455f3c89b6786f9ddd65a3b07a15e49899ed",
  },
  {
    groupName: "Split Button",
    oldParentKey: "0887349334a1c08f821e06ac09997c35e8e9a5a6",
    newComponentKey: "aba8ded03d6336d443d662b1bf268e5675fa6802",
  },
  {
    groupName: "Switch",
    oldParentKey: "f5333e7a7bb0e7649c62e661f41b927056291302",
    newComponentKey: "443e7e4f10c978b805aada828b5bc2c073a434a7",
  },
  {
    groupName: "Tab Group",
    oldParentKey: "ffefd664461c93d08dec379bdf89bddbd992dd6b",
    newComponentKey: "032553f0ef9e9a2fea8370759c9edea4b14fc658",
  },
  {
    groupName: "Tag Input",
    oldParentKey: "ef04ccb234576786d5efbcf36c950da18d7473ab",
    newComponentKey: "9f00f6832f524f461d1f8a6be5af2ad8356a9102",
  },
  {
    groupName: "Tag",
    oldParentKey: "bed09c6e9448e5254d8c0762d4bc709cc639339e",
    newComponentKey: "7e8fdcf96f6b1bba417135fa2aaba67524da27c1",
  },
  {
    groupName: "Text Area",
    oldParentKey: "f1c0278317b8b02782862198d56f103f9c7c17dd",
    newComponentKey: "18961fd0175d3f904ce7dcdb7fd51197d8a3bb19",
  },
  {
    groupName: "Text Input",
    oldParentKey: "a2fbaa4494b61905d65b7bb19ebecdc81592ec86",
    newComponentKey: "f201f5e0d29dfe683d7f9fb3d3498262a5027853",
  },
  {
    groupName: "Tile Group",
    oldParentKey: "136b0518fb115d65432364fc54abb56669859e96",
    newComponentKey: "d4d2b04b0b6b68041e7a51d4cc48858071f569c4",
  },
  {
    groupName: "Time Picker",
    oldParentKey: "19fe40125bc56d535cd9ae53baf381c33a2fad90",
    newComponentKey: "06bd98d23b291d565ea05d4719fc600dc0e0ea9e",
  },
  {
    groupName: "Toast",
    oldParentKey: "de5a542c15ead41e59e6794ef2e1a5ca67cfafeb",
    newComponentKey: "760a4ca68f8a3d5ff3d1b6f69dfbbc5ed711b353",
  },
  {
    groupName: "Tooltip",
    oldParentKey: "9b09278e4890249acfd8621a97739e274e37c0b9",
    newComponentKey: "8e06f4e1269797b3354c0c1f3771dcf77b492f07",
  },
];
